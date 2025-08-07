import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import { generateReplySuggestion, checkCompliance } from '../../../lib/ai'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (req.method) {
    case 'GET':
      return getConversations(req, res, session)
    case 'POST':
      return createConversation(req, res, session)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getConversations(req, res, session) {
  try {
    const { page = 1, limit = 10, leadId, clientId, type } = req.query
    
    const where = {
      agentId: session.user.id
    }

    if (leadId) where.leadId = leadId
    if (clientId) where.clientId = clientId
    if (type) where.type = type

    const conversations = await prisma.conversation.findMany({
      where,
      include: {
        lead: true,
        client: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    })

    const total = await prisma.conversation.count({ where })

    res.status(200).json({
      conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
}

async function createConversation(req, res, session) {
  try {
    const { type, subject, content, direction, leadId, clientId, aiGenerated = false } = req.body

    // Validate required fields
    if (!type || !content || !direction) {
      return res.status(400).json({ error: 'Type, content, and direction are required' })
    }

    // Verify lead/client exists and belongs to agent
    if (leadId) {
      const lead = await prisma.lead.findFirst({
        where: { id: leadId, assignedTo: session.user.id }
      })
      if (!lead) {
        return res.status(404).json({ error: 'Lead not found or not accessible' })
      }
    }

    if (clientId) {
      const client = await prisma.client.findFirst({
        where: { id: clientId, assignedTo: session.user.id }
      })
      if (!client) {
        return res.status(404).json({ error: 'Client not found or not accessible' })
      }
    }

    // Check compliance for outbound messages
    let complianceResult = null
    if (direction === 'OUTBOUND') {
      complianceResult = await checkCompliance(content, type)
      
      if (!complianceResult.compliant) {
        return res.status(400).json({ 
          error: 'Content violates compliance requirements',
          issues: complianceResult.issues,
          suggestions: complianceResult.suggestions
        })
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        type,
        subject,
        content,
        direction,
        leadId,
        clientId,
        agentId: session.user.id,
        aiGenerated
      },
      include: {
        lead: true,
        client: true
      }
    })

    // Generate AI reply suggestions for inbound messages
    let replySuggestions = null
    if (direction === 'INBOUND') {
      try {
        // Get recent conversation history
        const recentConversations = await prisma.conversation.findMany({
          where: {
            OR: [
              { leadId },
              { clientId }
            ],
            agentId: session.user.id
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        })

        const conversationHistory = recentConversations
          .map(conv => `${conv.direction}: ${conv.content}`)
          .join('\n')

        const context = {
          lead: leadId ? await prisma.lead.findUnique({ where: { id: leadId } }) : null,
          client: clientId ? await prisma.client.findUnique({ where: { id: clientId } }) : null,
          conversationType: type
        }

        replySuggestions = await generateReplySuggestion(conversationHistory, JSON.stringify(context))
      } catch (error) {
        console.error('Error generating reply suggestions:', error)
      }
    }

    // Create follow-up task for inbound messages
    if (direction === 'INBOUND') {
      const entity = leadId ? await prisma.lead.findUnique({ where: { id: leadId } }) : 
                    clientId ? await prisma.client.findUnique({ where: { id: clientId } }) : null

      if (entity) {
        await prisma.task.create({
          data: {
            title: `Follow up on ${type.toLowerCase()} from ${entity.firstName} ${entity.lastName}`,
            type: 'FOLLOW_UP',
            priority: 'HIGH',
            dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
            assignedTo: session.user.id,
            leadId,
            clientId
          }
        })
      }
    }

    res.status(201).json({ 
      conversation,
      complianceResult,
      replySuggestions,
      message: 'Conversation created successfully'
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    res.status(500).json({ error: 'Failed to create conversation' })
  }
} 