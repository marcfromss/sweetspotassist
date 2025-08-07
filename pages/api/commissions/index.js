import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import { predictCommission } from '../../../lib/ai'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (req.method) {
    case 'GET':
      return getCommissions(req, res, session)
    case 'POST':
      return createCommission(req, res, session)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getCommissions(req, res, session) {
  try {
    const { page = 1, limit = 10, status, provider } = req.query
    
    const where = {
      agentId: session.user.id
    }

    if (status) where.status = status
    if (provider) {
      where.policy = {
        provider: {
          contains: provider,
          mode: 'insensitive'
        }
      }
    }

    const commissions = await prisma.commission.findMany({
      where,
      include: {
        policy: {
          include: {
            client: true
          }
        }
      },
      orderBy: { dueDate: 'asc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    })

    const total = await prisma.commission.count({ where })

    // Calculate summary statistics
    const summary = await prisma.commission.groupBy({
      by: ['status'],
      where: { agentId: session.user.id },
      _sum: {
        amount: true
      }
    })

    const overdueCommissions = await prisma.commission.findMany({
      where: {
        agentId: session.user.id,
        status: 'PENDING',
        dueDate: {
          lt: new Date()
        }
      },
      include: {
        policy: {
          include: {
            client: true
          }
        }
      }
    })

    res.status(200).json({
      commissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      summary,
      overdueCommissions
    })
  } catch (error) {
    console.error('Error fetching commissions:', error)
    res.status(500).json({ error: 'Failed to fetch commissions' })
  }
}

async function createCommission(req, res, session) {
  try {
    const { policyId, amount, dueDate, expectedPaymentDate } = req.body

    // Validate required fields
    if (!policyId || !amount || !dueDate) {
      return res.status(400).json({ error: 'Policy ID, amount, and due date are required' })
    }

    // Verify policy exists and belongs to agent's client
    const policy = await prisma.policy.findFirst({
      where: {
        id: policyId,
        client: {
          assignedTo: session.user.id
        }
      },
      include: {
        client: true
      }
    })

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found or not accessible' })
    }

    // AI-powered commission prediction
    const marketData = {
      currentDate: new Date(),
      policyType: policy.type,
      provider: policy.provider
    }
    
    const prediction = await predictCommission(policy, marketData)

    const commission = await prisma.commission.create({
      data: {
        policyId,
        agentId: session.user.id,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        expectedPaymentDate: expectedPaymentDate ? new Date(expectedPaymentDate) : null
      },
      include: {
        policy: {
          include: {
            client: true
          }
        }
      }
    })

    // Create reminder for commission follow-up
    await prisma.reminder.create({
      data: {
        title: `Commission follow-up: ${policy.provider}`,
        description: `Follow up on $${amount} commission for ${policy.client.firstName} ${policy.client.lastName}`,
        dueDate: new Date(dueDate),
        type: 'COMMISSION_FOLLOW_UP',
        agentId: session.user.id,
        clientId: policy.clientId
      }
    })

    res.status(201).json({ 
      commission,
      prediction,
      message: 'Commission created successfully'
    })
  } catch (error) {
    console.error('Error creating commission:', error)
    res.status(500).json({ error: 'Failed to create commission' })
  }
} 