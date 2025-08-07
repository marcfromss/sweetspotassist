// Simple file-based storage for immediate deployment
// This replaces the database with JSON files

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json')
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json')
const COMMISSIONS_FILE = path.join(DATA_DIR, 'commissions.json')
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json')

// Ensure data directory exists
const ensureDataDir = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch (error) {
    console.error('Error creating data directory:', error)
  }
}

// Initialize default data
const initializeData = () => {
  try {
    ensureDataDir()
    
    const defaultUsers = [
      {
        id: 'admin-1',
        email: 'admin@sweetspot-assist.com',
        name: 'Admin User',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK6y', // admin123
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'agent-1',
        email: 'agent@sweetspot-assist.com',
        name: 'Sample Agent',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK6y', // agent123
        role: 'AGENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const defaultLeads = [
      {
        id: 'lead-1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0123',
        company: 'Tech Corp',
        position: 'CTO',
        source: 'WEBSITE',
        status: 'NEW',
        priority: 'HIGH',
        notes: 'Interested in business insurance for tech startup',
        assignedTo: 'agent-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'lead-2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@healthcare.com',
        phone: '+1-555-0456',
        company: 'Healthcare Inc',
        position: 'CEO',
        source: 'REFERRAL',
        status: 'CONTACTED',
        priority: 'MEDIUM',
        notes: 'Looking for health insurance solutions',
        assignedTo: 'agent-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const defaultClients = [
      {
        id: 'client-1',
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@construction.com',
        phone: '+1-555-0789',
        address: '123 Main St, Construction City, CC 12345',
        dateOfBirth: '1980-05-15T00:00:00.000Z',
        status: 'ACTIVE',
        assignedTo: 'agent-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const defaultTasks = [
      {
        id: 'task-1',
        title: 'Follow up with John Smith from Tech Corp',
        description: 'Discuss business insurance needs for their startup',
        type: 'FOLLOW_UP',
        priority: 'HIGH',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'agent-1',
        leadId: 'lead-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'task-2',
        title: 'Collect documents from Sarah Johnson',
        description: 'Policy renewal due in 30 days',
        type: 'DOCUMENT_COLLECTION',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'agent-1',
        clientId: 'client-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const defaultCommissions = [
      {
        id: 'commission-1',
        policyId: 'policy-1',
        agentId: 'agent-1',
        amount: 750.00,
        status: 'PENDING',
        dueDate: new Date('2024-02-15').toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const defaultConversations = [
      {
        id: 'conv-1',
        type: 'EMAIL',
        subject: 'Business Insurance Inquiry',
        content: 'Hi, I\'m interested in learning more about business insurance for our tech startup.',
        direction: 'INBOUND',
        agentId: 'agent-1',
        leadId: 'lead-1',
        createdAt: new Date().toISOString()
      }
    ]

    // Write default data if files don't exist
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2))
    }
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(defaultLeads, null, 2))
    }
    if (!fs.existsSync(CLIENTS_FILE)) {
      fs.writeFileSync(CLIENTS_FILE, JSON.stringify(defaultClients, null, 2))
    }
    if (!fs.existsSync(TASKS_FILE)) {
      fs.writeFileSync(TASKS_FILE, JSON.stringify(defaultTasks, null, 2))
    }
    if (!fs.existsSync(COMMISSIONS_FILE)) {
      fs.writeFileSync(COMMISSIONS_FILE, JSON.stringify(defaultCommissions, null, 2))
    }
    if (!fs.existsSync(CONVERSATIONS_FILE)) {
      fs.writeFileSync(CONVERSATIONS_FILE, JSON.stringify(defaultConversations, null, 2))
    }
  } catch (error) {
    console.error('Error initializing data:', error)
  }
}

// Initialize data on first run
initializeData()

// Helper functions
const readFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return []
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return []
  }
}

const writeFile = (filePath, data) => {
  try {
    ensureDataDir()
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error)
    throw error
  }
}

// Storage API
export const storage = {
  // Users
  getUsers: () => readFile(USERS_FILE),
  getUserByEmail: (email) => {
    const users = readFile(USERS_FILE)
    return users.find(user => user.email === email)
  },
  createUser: (userData) => {
    const users = readFile(USERS_FILE)
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    users.push(newUser)
    writeFile(USERS_FILE, users)
    return newUser
  },

  // Leads
  getLeads: (filters = {}) => {
    let leads = readFile(LEADS_FILE)
    if (filters.assignedTo) {
      leads = leads.filter(lead => lead.assignedTo === filters.assignedTo)
    }
    return leads
  },
  createLead: (leadData) => {
    const leads = readFile(LEADS_FILE)
    const newLead = {
      id: `lead-${Date.now()}`,
      ...leadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    leads.push(newLead)
    writeFile(LEADS_FILE, leads)
    return newLead
  },

  // Clients
  getClients: (filters = {}) => {
    let clients = readFile(CLIENTS_FILE)
    if (filters.assignedTo) {
      clients = clients.filter(client => client.assignedTo === filters.assignedTo)
    }
    return clients
  },
  createClient: (clientData) => {
    const clients = readFile(CLIENTS_FILE)
    const newClient = {
      id: `client-${Date.now()}`,
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    clients.push(newClient)
    writeFile(CLIENTS_FILE, clients)
    return newClient
  },

  // Tasks
  getTasks: (filters = {}) => {
    let tasks = readFile(TASKS_FILE)
    if (filters.assignedTo) {
      tasks = tasks.filter(task => task.assignedTo === filters.assignedTo)
    }
    return tasks
  },
  createTask: (taskData) => {
    const tasks = readFile(TASKS_FILE)
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    tasks.push(newTask)
    writeFile(TASKS_FILE, tasks)
    return newTask
  },

  // Commissions
  getCommissions: (filters = {}) => {
    let commissions = readFile(COMMISSIONS_FILE)
    if (filters.agentId) {
      commissions = commissions.filter(commission => commission.agentId === filters.agentId)
    }
    return commissions
  },
  createCommission: (commissionData) => {
    const commissions = readFile(COMMISSIONS_FILE)
    const newCommission = {
      id: `commission-${Date.now()}`,
      ...commissionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    commissions.push(newCommission)
    writeFile(COMMISSIONS_FILE, commissions)
    return newCommission
  },

  // Conversations
  getConversations: (filters = {}) => {
    let conversations = readFile(CONVERSATIONS_FILE)
    if (filters.agentId) {
      conversations = conversations.filter(conv => conv.agentId === filters.agentId)
    }
    return conversations
  },
  createConversation: (conversationData) => {
    const conversations = readFile(CONVERSATIONS_FILE)
    const newConversation = {
      id: `conv-${Date.now()}`,
      ...conversationData,
      createdAt: new Date().toISOString()
    }
    conversations.push(newConversation)
    writeFile(CONVERSATIONS_FILE, conversations)
    return newConversation
  }
} 