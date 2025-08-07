# Sweetspot Assist - Insurance Sales CRM

A modern CRM tailored for insurance sales agents, built with Next.js.

## Features

- Lead and client management
- Commission tracking
- Task management and daily planner
- Document management
- Analytics dashboard
- Secure authentication

## Tech Stack

- **Frontend**: Next.js 13, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: NextAuth.js
- **Storage**: File-based JSON storage (easily upgradeable to a database)
- **UI Components**: Custom Tailwind components
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sweetspot-assist.git
cd sweetspot-assist
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email Service (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="10485760" # 10MB

# Application Settings
NODE_ENV="development"
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add the required environment variables
4. Deploy!

### Docker

1. Build the image:
```bash
docker build -t sweetspot-assist .
```

2. Run the container:
```bash
docker run -p 3000:3000 sweetspot-assist
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For support, email support@sweetspotassist.com

## Roadmap

- [ ] AI-powered features
- [ ] Calling integration
- [ ] Database integration
- [ ] Mobile app
- [ ] Offline support