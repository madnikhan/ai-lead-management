import { Lead, TeamMember, AnalyticsData, ROIData } from '@/types'

// Generate mock leads with impressive results
export const generateMockLeads = (): Lead[] => {
  const sources = ['chatbot', 'phone', 'chatbot', 'phone', 'chatbot', 'phone', 'phone', 'chatbot']
  const companies = [
    'TechCorp Inc', 'Global Solutions', 'Digital Innovations', 'Cloud Systems',
    'Data Dynamics', 'Future Works', 'Smart Solutions', 'Enterprise Plus',
    'NextGen Tech', 'Alpha Industries', 'Beta Systems', 'Gamma Labs',
    'Delta Corp', 'Epsilon Solutions', 'Zeta Technologies', 'Eta Ventures'
  ]
  const names = [
    'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis',
    'David Wilson', 'Lisa Anderson', 'Robert Taylor', 'Jennifer Brown',
    'William Martinez', 'Jessica Lee', 'James White', 'Amanda Harris',
    'Christopher Thompson', 'Michelle Garcia', 'Daniel Miller', 'Ashley Moore'
  ]

  return Array.from({ length: 50 }, (_, i) => {
    const score = Math.floor(Math.random() * 40) + 60 // 60-100 score
    const source = sources[Math.floor(Math.random() * sources.length)]
    const company = companies[Math.floor(Math.random() * companies.length)]
    const name = names[Math.floor(Math.random() * names.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    return {
      id: `lead-${i + 1}`,
      name,
      company,
      email: `${name.toLowerCase().replace(' ', '.')}@${company.toLowerCase().replace(' ', '')}.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      source: source as 'chatbot' | 'phone',
      score,
      status: ['new', 'contacted', 'qualified', 'proposal', 'closed'][Math.floor(Math.random() * 5)] as Lead['status'],
      assignedTo: `team-${Math.floor(Math.random() * 5) + 1}`,
      createdAt: date.toISOString(),
      estimatedValue: Math.floor(Math.random() * 50000) + 10000,
      priority: score > 85 ? 'high' : score > 70 ? 'medium' : 'low',
    }
  })
}

export const mockTeamMembers: TeamMember[] = [
  { id: 'team-1', name: 'Alex Thompson', role: 'Sales Manager', avatar: 'AT', leadsCount: 12, conversionRate: 68 },
  { id: 'team-2', name: 'Maria Garcia', role: 'Senior Sales', avatar: 'MG', leadsCount: 15, conversionRate: 72 },
  { id: 'team-3', name: 'James Wilson', role: 'Sales Rep', avatar: 'JW', leadsCount: 10, conversionRate: 65 },
  { id: 'team-4', name: 'Sarah Chen', role: 'Sales Rep', avatar: 'SC', leadsCount: 8, conversionRate: 70 },
  { id: 'team-5', name: 'David Lee', role: 'Junior Sales', avatar: 'DL', leadsCount: 5, conversionRate: 58 },
]

export const mockAnalytics: AnalyticsData = {
  totalLeads: 150,
  newLeads: 25,
  qualifiedLeads: 18,
  conversionRate: 24,
  totalRevenue: 187500,
  averageDealSize: 12500,
  leadsBySource: {
    chatbot: 90,
    phone: 60,
  },
  leadsByStatus: {
    new: 25,
    contacted: 45,
    qualified: 30,
    proposal: 18,
    closed: 36,
  },
  monthlyTrend: [
    { month: 'Jan', leads: 22, revenue: 27500 },
    { month: 'Feb', leads: 28, revenue: 35000 },
    { month: 'Mar', leads: 25, revenue: 31250 },
    { month: 'Apr', leads: 30, revenue: 37500 },
    { month: 'May', leads: 27, revenue: 33750 },
    { month: 'Jun', leads: 24, revenue: 30000 },
  ],
  conversionFunnel: [
    { stage: 'New Leads', count: 25, percentage: 100 },
    { stage: 'Contacted', count: 22, percentage: 88 },
    { stage: 'Qualified', count: 18, percentage: 72 },
    { stage: 'Proposal', count: 15, percentage: 60 },
    { stage: 'Closed', count: 9, percentage: 36 },
  ],
}

export const mockROIData: ROIData = {
  totalInvestment: 15000,
  totalRevenue: 187500,
  totalLeads: 150,
  costPerLead: 100.00,
  revenuePerLead: 1250.00,
  roi: 1150,
  paybackPeriod: 0.08,
  lifetimeValue: 12500,
  acquisitionCost: 100.00,
  ltvCacRatio: 125.0,
}

