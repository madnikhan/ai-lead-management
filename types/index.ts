export type Lead = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  source: 'chatbot' | 'phone'
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed'
  assignedTo: string
  createdAt: string
  estimatedValue: number
  priority: 'high' | 'medium' | 'low'
}

export type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
  leadsCount: number
  conversionRate: number
}

export type AnalyticsData = {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  conversionRate: number
  totalRevenue: number
  averageDealSize: number
  leadsBySource: {
    chatbot: number
    phone: number
  }
  leadsByStatus: {
    new: number
    contacted: number
    qualified: number
    proposal: number
    closed: number
  }
  monthlyTrend: Array<{
    month: string
    leads: number
    revenue: number
  }>
  conversionFunnel: Array<{
    stage: string
    count: number
    percentage: number
  }>
}

export type ROIData = {
  totalInvestment: number
  totalRevenue: number
  totalLeads: number
  costPerLead: number
  revenuePerLead: number
  roi: number
  paybackPeriod: number
  lifetimeValue: number
  acquisitionCost: number
  ltvCacRatio: number
}

