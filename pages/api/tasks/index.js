import { storage } from '../../../lib/storage';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tasks = storage.getTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, type, priority, dueDate, leadId, clientId } = req.body;
      
      if (!title || !type || !priority) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const task = storage.createTask({
        title,
        type,
        priority,
        dueDate,
        leadId,
        clientId,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });

      return res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({ error: 'Failed to create task' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, status } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const task = storage.updateTask(id, { status });
      return res.status(200).json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ error: 'Failed to update task' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 