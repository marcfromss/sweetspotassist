import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Sweetspot Assist</h1>
          <p className="text-gray-600 mb-6 text-center">Please sign in to access your CRM dashboard</p>
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
            Sign In
          </button>
        </div>
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
              <button className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
                <Plus size={16} className="mr-2" />
                New Lead
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {session.user?.name?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Commissions</p>
                <p className="text-2xl font-bold text-gray-900">${stats.pendingCommissions.toLocaleString()}</p>
                <p className="text-xs text-orange-600">3 overdue payments</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+18% from last month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Leads</h3>
                <button className="text-sm text-blue-500 hover:text-blue-600">View All</button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {lead.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="inline-flex items-center px-3 py-1 border border-blue-500 text-blue-500 rounded text-sm disabled:opacity-50"
                        disabled
                      >
                        <Phone size={16} className="mr-1" />
                        Call (Coming Soon)
                      </button>
                      <span className={`px-2 py-1 text-xs rounded ${
                        lead.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                        lead.priority === 'HIGH' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {lead.priority}
                      </span>
                      <span className="px-2 py-1 text-xs rounded border text-gray-600">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded">
                  <Plus size={16} className="mr-2" />
                  Add New Lead
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded">
                  <Calendar size={16} className="mr-2" />
                  Schedule Meeting
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded">
                  <FileText size={16} className="mr-2" />
                  Upload Document
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded">
                  <Mail size={16} className="mr-2" />
                  Send Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
                <div className="relative">
                  <button className="text-sm text-blue-500 hover:text-blue-600">View All</button>
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                    {stats.tasksDue}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
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
                    <span className={`px-2 py-1 text-xs rounded ${
                      task.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                      task.priority === 'HIGH' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commission Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Commission Alerts</h3>
                <div className="relative">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                    {stats.urgentAlerts}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {commissionAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{alert.provider}</p>
                      <p className="text-sm text-gray-600">${alert.amount.toLocaleString()}</p>
                      {alert.reason && <p className="text-xs text-red-600">{alert.reason}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded ${
                        alert.status === 'OVERDUE' ? 'bg-red-100 text-red-600' :
                        alert.status === 'DUE_SOON' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {alert.status === 'OVERDUE' ? `${alert.daysLate}d late` :
                         alert.status === 'DUE_SOON' ? `${alert.daysLeft}d left` : alert.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Performance Overview</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Lead Conversion Rate</p>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-green-100">
                    <div style={{ width: "68%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">68% - Above target</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Commission Collection</p>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-100">
                    <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">85% - On track</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Client Retention</p>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-purple-100">
                    <div style={{ width: "92%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">92% - Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}