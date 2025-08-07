import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import CallingService from '../../../lib/calling'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { toNumber, leadId, clientId, callType, notes } = req.body

    if (!toNumber) {
      return res.status(400).json({ error: 'Phone number is required' })
    }

    // Get lead or client information
    let contactInfo = null
    if (leadId) {
      contactInfo = await prisma.lead.findFirst({
        where: { id: leadId, assignedTo: session.user.id }
      })
    } else if (clientId) {
      contactInfo = await prisma.client.findFirst({
        where: { id: clientId, assignedTo: session.user.id }
      })
    }

    if (!contactInfo) {
      return res.status(404).json({ error: 'Contact not found' })
    }

    // Initialize calling service
    const callingService = new CallingService()

    // Generate call script based on contact and call type
    const script = callingService.generateCallScript(contactInfo, callType || 'follow_up')

    // Make the call
    const callResult = await callingService.makeCall(toNumber, null, {
      script,
      record: true,
      timeout: 30
    })

    // Log the call in conversations
    const conversation = await prisma.conversation.create({
      data: {
        type: 'PHONE',
        subject: `${callType || 'Follow-up'} Call`,
        content: `Outbound call to ${contactInfo.firstName} ${contactInfo.lastName} at ${toNumber}. ${notes || ''}`,
        direction: 'OUTBOUND',
        leadId: leadId || null,
        clientId: clientId || null,
        agentId: session.user.id
      }
    })

    // Create a task for follow-up if needed
    if (callType === 'new_lead' || callType === 'follow_up') {
      await prisma.task.create({
        data: {
          title: `Follow up after call with ${contactInfo.firstName} ${contactInfo.lastName}`,
          description: `Call completed. Schedule follow-up based on call outcome.`,
          type: 'FOLLOW_UP',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          assignedTo: session.user.id,
          leadId: leadId || null,
          clientId: clientId || null
        }
      })
    }

    res.status(200).json({
      success: true,
      call: callResult,
      conversation,
      message: 'Call initiated successfully'
    })

  } catch (error) {
    console.error('Error making call:', error)
    res.status(500).json({ 
      error: 'Failed to make call',
      details: error.message 
    })
  }
} 