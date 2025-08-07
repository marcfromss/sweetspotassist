import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import { prioritizeTasks } from '../../../lib/ai'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (req.method) {
    case 'GET':
      return getTasks(req, res, session)
    case 'POST':
      return createTask(req, res, session)
    case 'PUT':
      return updateTask(req, res, session)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getTasks(req, res, session) {
  try {
    const { page = 1, limit = 10, status, priority, type, dueDate } = req.query
    
    const where = {
      assignedTo: session.user.id
    }

    if (status) where.status = status
    if (priority) where.priority = priority
    if (type) where.type = type
    if (dueDate) {
      const date = new Date(dueDate)
      where.dueDate = {
        gte: date,
        lt: new Date(date.getTime() + 24 * 60 * 60 * 1000)
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        lead: true,
        client: true
      },
      orderBy: { dueDate: 'asc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    })

    const total = await prisma.task.count({ where })

    // Get context for AI prioritization
    const context = {
      currentDate: new Date(),
      agentId: session.user.id,
      totalTasks: total
    }

    // AI-powered task prioritization
    const prioritizedTasks = await prioritizeTasks(tasks, context)

    res.status(200).json({
      tasks: prioritizedTasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

async function createTask(req, res, session) {
  try {
    const { title, description, type, priority, dueDate, leadId, clientId } = req.body

    // Validate required fields
    if (!title || !type || !dueDate) {
      return res.status(400).json({ error: 'Title, type, and due date are required' })
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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        type,
        priority: priority || 'MEDIUM',
        dueDate: new Date(dueDate),
        assignedTo: session.user.id,
        leadId,
        clientId
      },
      include: {
        lead: true,
        client: true
      }
    })

    res.status(201).json({ 
      task,
      message: 'Task created successfully'
    })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
}

async function updateTask(req, res, session) {
  try {
    const { id } = req.query
    const { title, description, type, priority, status, dueDate, completedAt } = req.body

    // Verify task exists and belongs to agent
    const existingTask = await prisma.task.findFirst({
      where: { id, assignedTo: session.user.id }
    })

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found or not accessible' })
    }

    const updateData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (type) updateData.type = type
    if (priority) updateData.priority = priority
    if (status) updateData.status = status
    if (dueDate) updateData.dueDate = new Date(dueDate)
    if (completedAt) updateData.completedAt = new Date(completedAt)

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        lead: true,
        client: true
      }
    })

    // If task is completed, create follow-up tasks based on type
    if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      await createFollowUpTasks(task)
    }

    res.status(200).json({ 
      task,
      message: 'Task updated successfully'
    })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
}

async function createFollowUpTasks(task) {
  try {
    switch (task.type) {
      case 'FOLLOW_UP':
        // Create document collection task if lead is qualified
        if (task.lead && task.lead.status === 'QUALIFIED') {
          await prisma.task.create({
            data: {
              title: `Collect documents from ${task.lead.firstName} ${task.lead.lastName}`,
              type: 'DOCUMENT_COLLECTION',
              priority: task.priority,
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
              assignedTo: task.assignedTo,
              leadId: task.leadId
            }
          })
        }
        break

      case 'DOCUMENT_COLLECTION':
        // Create policy review task
        if (task.client) {
          await prisma.task.create({
            data: {
              title: `Review policy for ${task.client.firstName} ${task.client.lastName}`,
              type: 'POLICY_REVIEW',
              priority: task.priority,
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
              assignedTo: task.assignedTo,
              clientId: task.clientId
            }
          })
        }
        break

      case 'COMMISSION_FOLLOW_UP':
        // Create reminder for next follow-up
        await prisma.task.create({
          data: {
            title: `Follow up on commission payment`,
            type: 'COMMISSION_FOLLOW_UP',
            priority: 'HIGH',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            assignedTo: task.assignedTo,
            clientId: task.clientId
          }
        })
        break
    }
  } catch (error) {
    console.error('Error creating follow-up tasks:', error)
  }
} 