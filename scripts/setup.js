const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up Sweetspot Assist CRM...')

  try {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@sweetspot-assist.com' },
      update: {},
      create: {
        email: 'admin@sweetspot-assist.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Admin user created:', adminUser.email)

    // Create sample agent user
    const agentPassword = await bcrypt.hash('agent123', 12)
    
    const agentUser = await prisma.user.upsert({
      where: { email: 'agent@sweetspot-assist.com' },
      update: {},
      create: {
        email: 'agent@sweetspot-assist.com',
        name: 'Sample Agent',
        password: agentPassword,
        role: 'AGENT'
      }
    })

    console.log('✅ Sample agent created:', agentUser.email)

    // Create sample lead
    const sampleLead = await prisma.lead.create({
      data: {
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
        assignedTo: agentUser.id
      }
    })

    console.log('✅ Sample lead created:', sampleLead.firstName, sampleLead.lastName)

    // Create sample client
    const sampleClient = await prisma.client.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@healthcare.com',
        phone: '+1-555-0456',
        address: '123 Main St, Healthcare City, HC 12345',
        dateOfBirth: new Date('1985-03-15'),
        status: 'ACTIVE',
        assignedTo: agentUser.id
      }
    })

    console.log('✅ Sample client created:', sampleClient.firstName, sampleClient.lastName)

    // Create sample policy
    const samplePolicy = await prisma.policy.create({
      data: {
        policyNumber: 'POL-2024-001',
        clientId: sampleClient.id,
        provider: 'ABC Insurance',
        type: 'BUSINESS',
        status: 'ACTIVE',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        premium: 5000.00,
        coverage: 'General Liability, Property, Cyber',
        commissionRate: 0.15
      }
    })

    console.log('✅ Sample policy created:', samplePolicy.policyNumber)

    // Create sample commission
    const sampleCommission = await prisma.commission.create({
      data: {
        policyId: samplePolicy.id,
        agentId: agentUser.id,
        amount: 750.00,
        status: 'PENDING',
        dueDate: new Date('2024-02-15')
      }
    })

    console.log('✅ Sample commission created: $', sampleCommission.amount)

    // Create sample tasks
    const sampleTasks = await Promise.all([
      prisma.task.create({
        data: {
          title: 'Follow up with John Smith from Tech Corp',
          description: 'Discuss business insurance needs for their startup',
          type: 'FOLLOW_UP',
          priority: 'HIGH',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          assignedTo: agentUser.id,
          leadId: sampleLead.id
        }
      }),
      prisma.task.create({
        data: {
          title: 'Collect renewal documents from Sarah Johnson',
          description: 'Policy renewal due in 30 days',
          type: 'DOCUMENT_COLLECTION',
          priority: 'MEDIUM',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          assignedTo: agentUser.id,
          clientId: sampleClient.id
        }
      }),
      prisma.task.create({
        data: {
          title: 'Commission follow-up - ABC Insurance',
          description: 'Follow up on pending $750 commission payment',
          type: 'COMMISSION_FOLLOW_UP',
          priority: 'URGENT',
          status: 'PENDING',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
          assignedTo: agentUser.id,
          clientId: sampleClient.id
        }
      })
    ])

    console.log('✅ Sample tasks created:', sampleTasks.length, 'tasks')

    // Create sample conversations
    const sampleConversations = await Promise.all([
      prisma.conversation.create({
        data: {
          type: 'EMAIL',
          subject: 'Business Insurance Inquiry',
          content: 'Hi, I\'m interested in learning more about business insurance for our tech startup. We have 25 employees and handle sensitive customer data.',
          direction: 'INBOUND',
          agentId: agentUser.id,
          leadId: sampleLead.id
        }
      }),
      prisma.conversation.create({
        data: {
          type: 'PHONE',
          subject: 'Policy Renewal Discussion',
          content: 'Called to discuss policy renewal options and premium adjustments for the upcoming year.',
          direction: 'OUTBOUND',
          agentId: agentUser.id,
          clientId: sampleClient.id
        }
      })
    ])

    console.log('✅ Sample conversations created:', sampleConversations.length, 'conversations')

    // Create sample reminders
    const sampleReminders = await Promise.all([
      prisma.reminder.create({
        data: {
          title: 'Policy Renewal - Sarah Johnson',
          description: 'Policy POL-2024-001 expires on December 31, 2024',
          dueDate: new Date('2024-12-15'),
          type: 'POLICY_RENEWAL',
          status: 'PENDING',
          agentId: agentUser.id,
          clientId: sampleClient.id
        }
      }),
      prisma.reminder.create({
        data: {
          title: 'Commission Payment Due',
          description: 'ABC Insurance commission payment of $750 due on February 15, 2024',
          dueDate: new Date('2024-02-15'),
          type: 'COMMISSION_FOLLOW_UP',
          status: 'PENDING',
          agentId: agentUser.id,
          clientId: sampleClient.id
        }
      })
    ])

    console.log('✅ Sample reminders created:', sampleReminders.length, 'reminders')

    console.log('\n🎉 Setup completed successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('Admin User:')
    console.log('  Email: admin@sweetspot-assist.com')
    console.log('  Password: admin123')
    console.log('\nAgent User:')
    console.log('  Email: agent@sweetspot-assist.com')
    console.log('  Password: agent123')
    console.log('\n🌐 Access the application at: http://localhost:3000')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 