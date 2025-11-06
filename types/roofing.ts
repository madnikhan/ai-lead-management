export type RoofingLead = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  source: 'chatbot' | 'phone'
  status: 'new' | 'emergency' | 'contacted' | 'scheduled' | 'converted'
  emergencyLevel: number // 1-10
  qualityScore: number // 1-10
  createdAt: string
  capturedAt: string // When lead was captured (24/7)
  isAfterHours: boolean
  estimatedJobValue: number
  jobType: 'emergency' | 'standard' | 'inspection' | 'quote'
  notes: string
  assignedTo?: string
  responseTime?: number // minutes
  convertedAt?: string
  actualJobValue?: number
}

export type RoofingTeamMember = {
  id: string
  name: string
  role: string
  avatar: string
  leadsCount: number
  emergencyLeadsCount: number
  conversionRate: number
  avgResponseTime: number // minutes
  revenueGenerated: number
}

export type RoofingAnalytics = {
  totalLeads: number
  emergencyLeads: number
  newLeads: number
  conversionRate: number
  estimatedRevenue: number
  actualRevenue: number
  leadsBySource: {
    chatbot: number
    phone: number
  }
  leadsByTime: {
    businessHours: number
    afterHours: number
  }
  leadsByStatus: {
    new: number
    emergency: number
    contacted: number
    scheduled: number
    converted: number
  }
  conversionFunnel: Array<{
    stage: string
    count: number
    percentage: number
  }>
  responseTimeMetrics: {
    avgResponseTime: number
    emergencyResponseTime: number
    standardResponseTime: number
  }
  monthlyBreakdown: Array<{
    month: string
    leads: number
    emergencyJobs: number
    standardJobs: number
    revenue: number
  }>
}

export type RoofingROI = {
  monthlyCost: number
  totalLeads: number
  emergencyLeads: number
  emergencyJobsConverted: number
  emergencyJobValue: number
  standardJobsConverted: number
  standardJobValue: number
  totalRevenue: number
  costPerLead: number
  revenuePerLead: number
  roi: number
  paybackPeriod: number
}

