import { storage } from '../../../lib/storage';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const commissions = storage.getCommissions();
      return res.status(200).json(commissions);
    } catch (error) {
      console.error('Error fetching commissions:', error);
      return res.status(500).json({ error: 'Failed to fetch commissions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { policyNumber, provider, amount, status, paymentDate, clientId } = req.body;
      
      if (!policyNumber || !provider || !amount) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const commission = storage.createCommission({
        policyNumber,
        provider,
        amount,
        status: status || 'PENDING',
        paymentDate,
        clientId,
        createdAt: new Date().toISOString()
      });

      return res.status(201).json(commission);
    } catch (error) {
      console.error('Error creating commission:', error);
      return res.status(500).json({ error: 'Failed to create commission' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, status, paymentDate } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const commission = storage.updateCommission(id, { status, paymentDate });
      return res.status(200).json(commission);
    } catch (error) {
      console.error('Error updating commission:', error);
      return res.status(500).json({ error: 'Failed to update commission' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 