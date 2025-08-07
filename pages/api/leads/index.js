import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import { scoreLead } from '../../../lib/ai'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (req.method) {
    case 'GET':
      return getLeads(req, res, session)
    case 'POST':
      return createLead(req, res, session)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getLeads(req, res, session) {
  try {
    const { page = 1, limit = 10, status, priority, source } = req.query
    
    const where = {
      assignedTo: session.user.id
    }

    if (status) where.status = status
    if (priority) where.priority = priority
    if (source) where.source = source

    const leads = await prisma.lead.findMany({
      where,
      include: {
        conversations: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        tasks: {
          where: { status: 'PENDING' },
          orderBy: { dueDate: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    })

    const total = await prisma.lead.count({ where })

    res.status(200).json({
      leads,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching leads:', error)
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
}

async function createLead(req, res, session) {
  try {
    const { firstName, lastName, email, phone, company, position, source, notes } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' })
    }

    // Check if lead already exists
    const existingLead = await prisma.lead.findFirst({
      where: { email, assignedTo: session.user.id }
    })

    if (existingLead) {
      return res.status(400).json({ error: 'Lead with this email already exists' })
    }

    // AI-powered lead scoring
    const leadData = { firstName, lastName, email, phone, company, position, source }
    const scoring = await scoreLead(leadData)

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        company,
        position,
        source: source || 'OTHER',
        notes,
        priority: scoring.priority,
        assignedTo: session.user.id
      }
    })

    // Create initial task for follow-up
    await prisma.task.create({
      data: {
        title: `Follow up with ${firstName} ${lastName}`,
        type: 'FOLLOW_UP',
        priority: scoring.priority,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        assignedTo: session.user.id,
        leadId: lead.id
      }
    })

    res.status(201).json({ 
      lead,
      scoring,
      message: 'Lead created successfully'
    })
  } catch (error) {
    console.error('Error creating lead:', error)
    res.status(500).json({ error: 'Failed to create lead' })
  }
} 