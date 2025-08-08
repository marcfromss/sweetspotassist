import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Demo user for testing
const demoUser = {
  id: '1',
  email: 'demo@example.com',
  name: 'Demo User',
  // Plain password is 'demo123'
  hashedPassword: '$2a$10$6KqGK1IhCqYoUZF99qYEYuX6.WkxUX6Y1qLK1cXuXtZsHkZbPXnwK'
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('Attempting login with:', credentials?.email)

          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }

          // For demo, only allow the demo user
          if (credentials.email !== demoUser.email) {
            console.log('Email not found:', credentials.email)
            return null
          }

          // For demo, just check if password is 'demo123'
          if (credentials.password !== 'demo123') {
            console.log('Invalid password')
            return null
          }

          console.log('Login successful for:', demoUser.email)

          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  debug: true,
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
}) 