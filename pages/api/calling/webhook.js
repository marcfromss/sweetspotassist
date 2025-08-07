import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { CallSid, CallStatus, CallDuration, To, From, RecordingUrl } = req.body

    // Log the webhook event
    console.log('Call webhook received:', {
      callSid: CallSid,
      status: CallStatus,
      duration: CallDuration,
      to: To,
      from: From,
      recordingUrl: RecordingUrl
    })

    // Update call status in database (if you have a calls table)
    // For now, we'll just log it
    
    // If call is completed, you might want to:
    // 1. Update conversation status
    // 2. Create follow-up tasks
    // 3. Send notifications
    // 4. Update lead/client status

    if (CallStatus === 'completed') {
      // Find the conversation for this call
      const conversation = await prisma.conversation.findFirst({
        where: {
          content: {
            contains: CallSid
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (conversation) {
        // Update conversation with call results
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: {
            content: `${conversation.content}\n\nCall completed. Duration: ${CallDuration} seconds. Recording: ${RecordingUrl || 'Not available'}`
          }
        })
      }
    }

    res.status(200).json({ success: true })

  } catch (error) {
    console.error('Error processing call webhook:', error)
    res.status(500).json({ error: 'Failed to process webhook' })
  }
} 