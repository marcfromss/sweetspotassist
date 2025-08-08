import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const LEADS_FILE = path.join(DATA_DIR, 'leads.json')
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json')
const COMMISSIONS_FILE = path.join(DATA_DIR, 'commissions.json')
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json')
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize files with default data
const initializeFile = (filePath, defaultData = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
  }
}

// Initialize all data files
initializeFile(USERS_FILE, [{
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  password: bcrypt.hashSync('demo123', 10),
  role: 'AGENT'
}])
initializeFile(LEADS_FILE)
initializeFile(TASKS_FILE)
initializeFile(COMMISSIONS_FILE)
initializeFile(CONVERSATIONS_FILE)
initializeFile(DOCUMENTS_FILE)

// Helper functions to read and write data
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    return false
  }
}

// Storage class
class Storage {
  // User methods
  getUserByEmail(email) {
    const users = readData(USERS_FILE)
    return users.find(user => user.email === email)
  }

  getUserById(id) {
    const users = readData(USERS_FILE)
    return users.find(user => user.id === id)
  }

  createUser(userData) {
    const users = readData(USERS_FILE)
    const newUser = {
      id: uuidv4(),
      ...userData,
      password: bcrypt.hashSync(userData.password, 10)
    }
    users.push(newUser)
    writeData(USERS_FILE, users)
    return newUser
  }

  // Lead methods
  getLeads(filters = {}) {
    const leads = readData(LEADS_FILE)
    return leads.filter(lead => {
      if (filters.assignedTo && lead.assignedTo !== filters.assignedTo) return false
      if (filters.status && lead.status !== filters.status) return false
      return true
    })
  }

  createLead(leadData) {
    const leads = readData(LEADS_FILE)
    const newLead = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...leadData
    }
    leads.push(newLead)
    writeData(LEADS_FILE, leads)
    return newLead
  }

  // Task methods
  getTasks(filters = {}) {
    const tasks = readData(TASKS_FILE)
    return tasks.filter(task => {
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false
      if (filters.status && task.status !== filters.status) return false
      return true
    })
  }

  createTask(taskData) {
    const tasks = readData(TASKS_FILE)
    const newTask = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...taskData
    }
    tasks.push(newTask)
    writeData(TASKS_FILE, tasks)
    return newTask
  }

  updateTask(id, updates) {
    const tasks = readData(TASKS_FILE)
    const index = tasks.findIndex(task => task.id === id)
    if (index === -1) return null

    const updatedTask = { ...tasks[index], ...updates }
    tasks[index] = updatedTask
    writeData(TASKS_FILE, tasks)
    return updatedTask
  }

  // Commission methods
  getCommissions(filters = {}) {
    const commissions = readData(COMMISSIONS_FILE)
    return commissions.filter(commission => {
      if (filters.status && commission.status !== filters.status) return false
      return true
    })
  }

  createCommission(commissionData) {
    const commissions = readData(COMMISSIONS_FILE)
    const newCommission = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...commissionData
    }
    commissions.push(newCommission)
    writeData(COMMISSIONS_FILE, commissions)
    return newCommission
  }

  updateCommission(id, updates) {
    const commissions = readData(COMMISSIONS_FILE)
    const index = commissions.findIndex(commission => commission.id === id)
    if (index === -1) return null

    const updatedCommission = { ...commissions[index], ...updates }
    commissions[index] = updatedCommission
    writeData(COMMISSIONS_FILE, commissions)
    return updatedCommission
  }

  // Conversation methods
  getConversations(filters = {}) {
    const conversations = readData(CONVERSATIONS_FILE)
    return conversations.filter(conversation => {
      if (filters.leadId && conversation.leadId !== filters.leadId) return false
      if (filters.clientId && conversation.clientId !== filters.clientId) return false
      return true
    })
  }

  createConversation(conversationData) {
    const conversations = readData(CONVERSATIONS_FILE)
    const newConversation = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...conversationData
    }
    conversations.push(newConversation)
    writeData(CONVERSATIONS_FILE, conversations)
    return newConversation
  }

  // Document methods
  getDocuments(filters = {}) {
    const documents = readData(DOCUMENTS_FILE)
    return documents.filter(document => {
      if (filters.leadId && document.leadId !== filters.leadId) return false
      if (filters.clientId && document.clientId !== filters.clientId) return false
      return true
    })
  }

  createDocument(documentData) {
    const documents = readData(DOCUMENTS_FILE)
    const newDocument = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...documentData
    }
    documents.push(newDocument)
    writeData(DOCUMENTS_FILE, documents)
    return newDocument
  }
}

export const storage = new Storage() 