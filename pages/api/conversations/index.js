import { storage } from '../../../lib/storage';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const conversations = storage.getConversations();
      return res.status(200).json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { type, content, leadId, clientId } = req.body;
      
      if (!type || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const conversation = storage.createConversation({
        type,
        content,
        leadId,
        clientId,
        createdAt: new Date().toISOString()
      });

      return res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      return res.status(500).json({ error: 'Failed to create conversation' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 