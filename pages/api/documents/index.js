import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from '../../../lib/prisma'
import { analyzeDocument } from '../../../lib/ai'
import { createWorker } from 'tesseract.js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  switch (req.method) {
    case 'GET':
      return getDocuments(req, res, session)
    case 'POST':
      return uploadDocument(req, res, session)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function getDocuments(req, res, session) {
  try {
    const { page = 1, limit = 10, type, leadId, clientId } = req.query
    
    const where = {
      uploadedBy: session.user.id
    }

    if (type) where.type = type
    if (leadId) where.leadId = leadId
    if (clientId) where.clientId = clientId

    const documents = await prisma.document.findMany({
      where,
      include: {
        lead: true,
        client: true
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    })

    const total = await prisma.document.count({ where })

    res.status(200).json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

async function uploadDocument(req, res, session) {
  try {
    const form = formidable({
      uploadDir: join(process.cwd(), 'uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' })
      }

      const file = files.file?.[0]
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const { name, type, leadId, clientId, notes } = fields

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type' })
      }

      // Verify lead/client exists and belongs to agent
      if (leadId) {
        const lead = await prisma.lead.findFirst({
          where: { id: leadId[0], assignedTo: session.user.id }
        })
        if (!lead) {
          return res.status(404).json({ error: 'Lead not found or not accessible' })
        }
      }

      if (clientId) {
        const client = await prisma.client.findFirst({
          where: { id: clientId[0], assignedTo: session.user.id }
        })
        if (!client) {
          return res.status(404).json({ error: 'Client not found or not accessible' })
        }
      }

      // Create document record
      const document = await prisma.document.create({
        data: {
          name: name?.[0] || file.originalFilename,
          type: type?.[0] || 'OTHER',
          filePath: file.filepath,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedBy: session.user.id,
          leadId: leadId?.[0],
          clientId: clientId?.[0]
        }
      })

      // Process OCR for image files
      let ocrText = null
      if (file.mimetype.startsWith('image/')) {
        try {
          const worker = await createWorker('eng')
          const { data: { text } } = await worker.recognize(file.filepath)
          await worker.terminate()
          
          ocrText = text

          // Update document with OCR text
          await prisma.document.update({
            where: { id: document.id },
            data: { ocrText }
          })

          // AI-powered document analysis
          const analysis = await analyzeDocument(ocrText, type?.[0] || 'OTHER')
          
          // Create tasks based on analysis
          if (analysis.missing && analysis.missing.length > 0) {
            await prisma.task.create({
              data: {
                title: `Collect missing documents: ${analysis.missing.join(', ')}`,
                type: 'DOCUMENT_COLLECTION',
                priority: 'HIGH',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
                assignedTo: session.user.id,
                leadId: leadId?.[0],
                clientId: clientId?.[0]
              }
            })
          }
        } catch (ocrError) {
          console.error('OCR processing failed:', ocrError)
        }
      }

      res.status(201).json({ 
        document: {
          ...document,
          ocrText
        },
        message: 'Document uploaded successfully'
      })
    })
  } catch (error) {
    console.error('Error uploading document:', error)
    res.status(500).json({ error: 'Failed to upload document' })
  }
} 