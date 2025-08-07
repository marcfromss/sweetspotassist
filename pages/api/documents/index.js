import { storage } from '../../../lib/storage';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const documents = storage.getDocuments();
    return res.status(200).json(documents);
  }

  if (req.method === 'POST') {
    try {
      const { name, type, base64Data } = req.body;
      
      if (!name || !type || !base64Data) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const document = storage.createDocument({
        name,
        type,
        data: base64Data,
        uploadedAt: new Date().toISOString()
      });

      return res.status(201).json(document);
    } catch (error) {
      console.error('Error uploading document:', error);
      return res.status(500).json({ error: 'Failed to upload document' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 