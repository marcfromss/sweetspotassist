import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Progress,
  Avatar,
  Badge,
  Divider,
  Spinner
} from '@nextui-org/react'
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  Settings,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeClients: 0,
    pendingCommissions: 0,
    monthlyRevenue: 0,
    tasksDue: 0,
    urgentAlerts: 0
  })
  const [recentLeads, setRecentLeads] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [commissionAlerts, setCommissionAlerts] = useState([])

  useEffect(() => {
    if (status === 'authenticated') {
      loadDashboardData()
    }
  }, [status])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // In a real app, these would be API calls
      // For now, using mock data
      setStats({
        totalLeads: 156,
        activeClients: 89,
        pendingCommissions: 12450,
        monthlyRevenue: 45600,
        tasksDue: 12,
        urgentAlerts: 3
      })
      
      setRecentLeads([
        { id: 1, name: 'John Smith', company: 'Tech Corp', status: 'NEW', priority: 'HIGH', source: 'WEBSITE' },
        { id: 2, name: 'Sarah Johnson', company: 'Healthcare Inc', status: 'CONTACTED', priority: 'MEDIUM', source: 'REFERRAL' },
        { id: 3, name: 'Mike Davis', company: 'Construction Co', status: 'QUALIFIED', priority: 'URGENT', source: 'COLD_CALL' }
      ])
      
      setUpcomingTasks([
        { id: 1, title: 'Follow up with John Smith', type: 'FOLLOW_UP', priority: 'HIGH', dueDate: '2024-01-15' },
        { id: 2, title: 'Collect documents from Sarah', type: 'DOCUMENT_COLLECTION', priority: 'MEDIUM', dueDate: '2024-01-16' },
        { id: 3, title: 'Commission follow-up - ABC Insurance', type: 'COMMISSION_FOLLOW_UP', priority: 'URGENT', dueDate: '2024-01-14' }
      ])
      
      setCommissionAlerts([
        { id: 1, provider: 'ABC Insurance', amount: 2500, status: 'OVERDUE', daysLate: 15 },
        { id: 2, provider: 'XYZ Life', amount: 1800, status: 'DUE_SOON', daysLeft: 3 },
        { id: 3, provider: 'DEF Health', amount: 3200, status: 'CHARGEBACK', reason: 'Policy cancellation' }
      ])
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardBody className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to Sweetspot Assist</h1>
            <p className="text-gray-600 mb-6">Please sign in to access your CRM dashboard</p>
            <Button color="primary" size="lg">
              Sign In
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - Sweetspot Assist</title>
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button color="primary" startContent={<Plus size={16} />}>
                New Lead
              </Button>
              <Avatar name={session.user?.name} size="sm" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Commissions</p>
                <p className="text-2xl font-bold text-gray-900">${stats.pendingCommissions.toLocaleString()}</p>
                <p className="text-xs text-orange-600">3 overdue payments</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+18% from last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Leads</h3>
              <Button size="sm" variant="light">View All</Button>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar name={lead.name} size="sm" />
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Chip 
                        size="sm" 
                        color={lead.priority === 'URGENT' ? 'danger' : lead.priority === 'HIGH' ? 'warning' : 'default'}
                      >
                        {lead.priority}
                      </Chip>
                      <Chip size="sm" variant="bordered">
                        {lead.status}
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <Button 
                  fullWidth 
                  color="primary" 
                  startContent={<Plus size={16} />}
                  variant="flat"
                >
                  Add New Lead
                </Button>
                <Button 
                  fullWidth 
                  color="secondary" 
                  startContent={<Calendar size={16} />}
                  variant="flat"
                >
                  Schedule Meeting
                </Button>
                <Button 
                  fullWidth 
                  color="success" 
                  startContent={<FileText size={16} />}
                  variant="flat"
                >
                  Upload Document
                </Button>
                <Button 
                  fullWidth 
                  color="warning" 
                  startContent={<Mail size={16} />}
                  variant="flat"
                >
                  Send Follow-up
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
              <Badge content={stats.tasksDue} color="danger">
                <Button size="sm" variant="light">View All</Button>
              </Badge>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        task.type === 'FOLLOW_UP' ? 'bg-blue-100' :
                        task.type === 'DOCUMENT_COLLECTION' ? 'bg-green-100' :
                        'bg-orange-100'
                      }`}>
                        {task.type === 'FOLLOW_UP' ? <Phone className="h-4 w-4 text-blue-600" /> :
                         task.type === 'DOCUMENT_COLLECTION' ? <FileText className="h-4 w-4 text-green-600" /> :
                         <DollarSign className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                      </div>
                    </div>
                    <Chip 
                      size="sm" 
                      color={task.priority === 'URGENT' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'default'}
                    >
                      {task.priority}
                    </Chip>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Commission Alerts */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Commission Alerts</h3>
              <Badge content={stats.urgentAlerts} color="danger">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </Badge>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {commissionAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{alert.provider}</p>
                      <p className="text-sm text-gray-600">${alert.amount.toLocaleString()}</p>
                      {alert.reason && <p className="text-xs text-red-600">{alert.reason}</p>}
                    </div>
                    <div className="text-right">
                      <Chip 
                        size="sm" 
                        color={alert.status === 'OVERDUE' ? 'danger' : alert.status === 'DUE_SOON' ? 'warning' : 'default'}
                      >
                        {alert.status === 'OVERDUE' ? `${alert.daysLate}d late` :
                         alert.status === 'DUE_SOON' ? `${alert.daysLeft}d left` : alert.status}
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card className="mt-8">
          <CardHeader>
            <h3 className="text-lg font-semibold">Performance Overview</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Lead Conversion Rate</p>
                <Progress 
                  value={68} 
                  color="success" 
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">68% - Above target</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Commission Collection</p>
                <Progress 
                  value={85} 
                  color="primary" 
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">85% - On track</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Client Retention</p>
                <Progress 
                  value={92} 
                  color="secondary" 
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">92% - Excellent</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}