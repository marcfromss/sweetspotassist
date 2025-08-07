# Sweetspot Assist - AI-Powered Smart CRM for Insurance Agents

A comprehensive, AI-powered Customer Relationship Management system specifically designed for insurance sales agents. This CRM leverages artificial intelligence to automate lead scoring, task prioritization, commission tracking, and compliance monitoring.

## 🚀 Features

### 🤖 AI-Powered Intelligence
- **Smart Lead Scoring**: AI analyzes lead quality based on contact info, company, position, and source
- **Task Prioritization**: Automatically prioritizes tasks based on policy status, client urgency, and earnings potential
- **Reply Suggestions**: AI generates professional reply suggestions for conversations
- **Compliance Checking**: Real-time compliance monitoring for scripts and communications
- **Commission Prediction**: AI predicts commission potential based on policy and market data
- **Document Analysis**: OCR processing with AI-powered document analysis and missing field detection

### 📊 Lead & Client Management
- **Auto-Capture**: Automatically capture and categorize leads from multiple sources
- **Smart Tagging**: AI-powered lead tagging and categorization
- **Conversation Logging**: Complete conversation history with AI-generated insights
- **Status Tracking**: Visual status tracking from new lead to closed deal
- **Priority Management**: Intelligent priority assignment based on AI scoring

### 💰 Commission Tracking
- **Provider Identification**: Automatic provider recognition and commission calculation
- **Payment Monitoring**: Track commission payments and due dates
- **Chargeback Alerts**: Real-time alerts for chargebacks and disputes
- **Revenue Analytics**: Detailed commission analytics and forecasting
- **Automated Follow-ups**: AI-powered commission follow-up scheduling

### 📅 Daily Planner
- **Smart Task Prioritization**: AI prioritizes tasks based on multiple factors
- **Automated Scheduling**: Intelligent scheduling based on urgency and earnings potential
- **Follow-up Automation**: Automatic follow-up task creation
- **Progress Tracking**: Visual progress tracking and completion analytics
- **Time Management**: Optimized daily planning based on agent workload

### 📧 Unified Inbox
- **Smart Reply Suggestions**: AI-generated professional reply options
- **Auto-Follow-up Logic**: Intelligent follow-up scheduling
- **Compliance Monitoring**: Real-time compliance checking for all communications
- **Conversation History**: Complete conversation tracking across all channels
- **Multi-channel Support**: Email, phone, SMS, and in-person conversation logging

### 📄 Document Management
- **OCR Processing**: Automatic text extraction from uploaded documents
- **eSignature Support**: Digital signature capabilities
- **AI Analysis**: Intelligent document analysis and missing field detection
- **Secure Storage**: Local storage with optional cloud sync
- **Compliance Checking**: Document compliance verification

### 🔒 Compliance & Security
- **Script Compliance**: Real-time script violation detection
- **Regulatory Monitoring**: Automated regulatory requirement checking
- **Secure Storage**: Encrypted data storage and transmission
- **Audit Trails**: Complete audit trails for all activities
- **Access Control**: Role-based access control and permissions

### 📈 Analytics Dashboard
- **Real-time Metrics**: Live performance tracking and KPIs
- **Commission Analytics**: Detailed commission tracking and forecasting
- **Lead Conversion**: Conversion rate analysis and optimization
- **Performance Insights**: AI-powered performance recommendations
- **Custom Reports**: Flexible reporting and data export

## 🛠️ Technology Stack

- **Frontend**: Next.js 13+ with App Router
- **UI Framework**: NextUI with Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (production-ready for PostgreSQL/MySQL)
- **AI Services**: OpenAI GPT-4 and Anthropic Claude
- **Authentication**: NextAuth.js
- **File Processing**: Tesseract.js for OCR
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Anthropic API key (optional)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sweetspot-assist-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Authentication
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # AI Services
   OPENAI_API_KEY="your-openai-api-key"
   ANTHROPIC_API_KEY="your-anthropic-api-key"
   
   # Email Service (for notifications)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   
   # File Storage
   UPLOAD_DIR="./uploads"
   MAX_FILE_SIZE="10485760"
   
   # Application Settings
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### Getting Started

1. **First Login**: Create your first user account through the signup process
2. **Dashboard Overview**: Review your personalized dashboard with key metrics
3. **Add Your First Lead**: Use the "New Lead" button to add your first lead
4. **AI Scoring**: The system will automatically score and prioritize your leads
5. **Task Management**: Review AI-generated tasks and follow the suggested workflow

### Lead Management

1. **Add New Lead**: Click "New Lead" and fill in the required information
2. **AI Scoring**: The system automatically scores leads based on multiple factors
3. **Follow-up Tasks**: AI creates appropriate follow-up tasks automatically
4. **Conversation Logging**: Log all interactions with leads and clients
5. **Status Updates**: Update lead status as they progress through your pipeline

### Commission Tracking

1. **Add Commission**: Create commission records for each policy
2. **Payment Monitoring**: Track payment due dates and status
3. **Chargeback Alerts**: Receive alerts for chargebacks and disputes
4. **Follow-up Automation**: AI schedules commission follow-up tasks
5. **Analytics**: Review commission performance and trends

### Document Management

1. **Upload Documents**: Drag and drop or select files to upload
2. **OCR Processing**: Images are automatically processed for text extraction
3. **AI Analysis**: AI analyzes documents for missing information
4. **Task Creation**: Missing document tasks are created automatically
5. **Compliance Checking**: Documents are checked for compliance requirements

### Task Management

1. **AI Prioritization**: Tasks are automatically prioritized by AI
2. **Smart Scheduling**: Follow AI-suggested task scheduling
3. **Progress Tracking**: Mark tasks as complete to update progress
4. **Follow-up Creation**: Completing tasks triggers new follow-up tasks
5. **Performance Analytics**: Review task completion rates and efficiency

## 🔧 Configuration

### AI Model Configuration

The system supports both OpenAI and Anthropic models. Configure your preferred models in the AI service:

```javascript
// lib/ai.js
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4" // or "gpt-3.5-turbo"
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: "claude-3-sonnet-20240229"
});
```

### Database Configuration

For production, update your database configuration:

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/sweetspot_crm"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/sweetspot_crm"
```

### File Storage

Configure cloud storage for production:

```javascript
// Add cloud storage configuration
const cloudStorage = {
  provider: 'aws-s3', // or 'google-cloud', 'azure'
  bucket: 'your-bucket-name',
  region: 'us-east-1'
};
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**: Connect your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables in Vercel dashboard
3. **Database**: Set up a production database (PostgreSQL recommended)
4. **Deploy**: Vercel will automatically deploy your application

### Docker Deployment

1. **Build the image**:
   ```bash
   docker build -t sweetspot-assist .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 sweetspot-assist
   ```

### Production Considerations

- **Database**: Use PostgreSQL or MySQL for production
- **File Storage**: Implement cloud storage (AWS S3, Google Cloud Storage)
- **Security**: Enable HTTPS, implement rate limiting
- **Monitoring**: Add application monitoring and logging
- **Backup**: Implement regular database backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@sweetspot-assist.com
- Documentation: [docs.sweetspot-assist.com](https://docs.sweetspot-assist.com)

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Integration with popular insurance software
- [ ] Multi-language support
- [ ] Advanced AI features (predictive analytics)
- [ ] API for third-party integrations
- [ ] White-label solution for agencies

---

**Built with ❤️ for insurance professionals**