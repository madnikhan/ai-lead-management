import { RoofingLead, RoofingTeamMember, RoofingAnalytics, RoofingROI } from '@/types/roofing'

const addresses = [
  '1234 Oak Street, Springfield',
  '5678 Maple Ave, Springfield',
  '9012 Pine Road, Springfield',
  '3456 Elm Street, Springfield',
  '7890 Birch Lane, Springfield',
  '2345 Cedar Drive, Springfield',
  '6789 Willow Way, Springfield',
  '1234 Spruce Court, Springfield',
  '5678 Ash Boulevard, Springfield',
  '9012 Hickory Circle, Springfield',
]

const emergencyMessages = [
  'Water leaking into living room, need immediate repair',
  'Storm damage from last night, roof is leaking badly',
  'Tree fell on roof, emergency situation',
  'Heavy rain coming through ceiling, urgent',
  'Roof shingles blown off in storm, exposed roof',
  'Water damage getting worse, need emergency fix',
  'Ice dam causing water to leak inside',
  'Wind damage - roof tiles missing',
  'Leak getting worse, furniture getting damaged',
  'Emergency roof repair needed ASAP',
]

const standardMessages = [
  'Looking for roof replacement quote',
  'Need routine roof inspection',
  'Interested in roof maintenance',
  'Looking to replace old shingles',
  'Want to get quote for new roof',
  'Need roof repair estimate',
  'Thinking about roof upgrade',
  'Looking for roof cleaning service',
  'Need advice on roof materials',
  'Want to schedule consultation',
]

const names = [
  'Michael Johnson', 'Sarah Williams', 'David Brown', 'Jennifer Davis',
  'Robert Miller', 'Lisa Anderson', 'James Martinez', 'Patricia Taylor',
  'John Thomas', 'Maria Garcia', 'William Jackson', 'Nancy White',
  'Richard Harris', 'Betty Martin', 'Joseph Thompson', 'Sandra Moore',
  'Thomas Clark', 'Margaret Lewis', 'Charles Walker', 'Dorothy Hall',
  'Christopher Young', 'Sharon King', 'Daniel Wright', 'Carol Lopez',
  'Matthew Hill', 'Donna Scott', 'Anthony Green', 'Ruth Adams',
  'Mark Baker', 'Michelle Gonzalez',
]

export const generateRoofingLeads = (): RoofingLead[] => {
  const leads: RoofingLead[] = []
  const now = new Date()
  
  // Generate 30+ leads over past month
  for (let i = 0; i < 32; i++) {
    const daysAgo = Math.floor(Math.random() * 30)
    const leadDate = new Date(now)
    leadDate.setDate(leadDate.getDate() - daysAgo)
    
    // 30% chance of emergency
    const isEmergency = Math.random() < 0.3
    const emergencyLevel = isEmergency ? Math.floor(Math.random() * 5) + 6 : Math.floor(Math.random() * 5) + 1
    const qualityScore = Math.floor(Math.random() * 4) + 7 // 7-10 for quality
    
    // Random time - 62% after hours, 38% business hours
    const isAfterHoursTarget = Math.random() < 0.62
    let hour: number
    if (isAfterHoursTarget) {
      // After hours: before 7 AM or after 7 PM
      hour = Math.random() < 0.5 
        ? Math.floor(Math.random() * 7) // 0-6 AM
        : Math.floor(Math.random() * 5) + 19 // 7-11 PM
    } else {
      // Business hours: 7 AM - 7 PM
      hour = Math.floor(Math.random() * 12) + 7 // 7 AM - 6 PM
    }
    const isAfterHours = hour < 7 || hour > 19
    const capturedAt = new Date(leadDate)
    capturedAt.setHours(hour, Math.floor(Math.random() * 60), 0)
    
    // 45% chatbot, 55% phone
    const source = Math.random() < 0.45 ? 'chatbot' : 'phone'
    const name = names[Math.floor(Math.random() * names.length)]
    const address = addresses[Math.floor(Math.random() * addresses.length)]
    
    // Job value based on type
    let jobType: 'emergency' | 'standard' | 'inspection' | 'quote'
    let estimatedJobValue: number
    
    if (isEmergency) {
      jobType = 'emergency'
      estimatedJobValue = Math.floor(Math.random() * 800) + 800 // $800-$1,600
    } else if (Math.random() < 0.3) {
      jobType = 'inspection'
      estimatedJobValue = Math.floor(Math.random() * 200) + 200 // $200-$400
    } else if (Math.random() < 0.5) {
      jobType = 'quote'
      estimatedJobValue = 0 // Quote only
    } else {
      jobType = 'standard'
      estimatedJobValue = Math.floor(Math.random() * 1000) + 600 // $600-$1,600
    }
    
    // Status based on age and conversion probability
    let status: RoofingLead['status']
    const daysOld = daysAgo
    if (daysOld < 1 && isEmergency) {
      status = 'emergency'
    } else if (daysOld < 2) {
      status = 'new'
    } else if (daysOld < 5 && Math.random() < 0.7) {
      status = 'contacted'
    } else if (daysOld < 10 && Math.random() < 0.5) {
      status = 'scheduled'
    } else if (Math.random() < 0.4) {
      status = 'converted'
    } else {
      status = daysOld < 3 ? 'new' : 'contacted'
    }
    
    // Response time for contacted/scheduled/converted
    let responseTime: number | undefined
    if (status !== 'new' && status !== 'emergency') {
      if (isEmergency) {
        responseTime = Math.floor(Math.random() * 30) + 15 // 15-45 min for emergencies
      } else {
        responseTime = Math.floor(Math.random() * 240) + 60 // 1-5 hours for standard
      }
    }
    
    // Actual job value if converted
    let actualJobValue: number | undefined
    let convertedAt: string | undefined
    if (status === 'converted') {
      actualJobValue = Math.floor(estimatedJobValue * (0.85 + Math.random() * 0.3)) // 85-115% of estimate
      const convertedDate = new Date(leadDate)
      convertedDate.setDate(convertedDate.getDate() + Math.floor(Math.random() * 5) + 1)
      convertedAt = convertedDate.toISOString()
    }
    
    const notes = isEmergency
      ? emergencyMessages[Math.floor(Math.random() * emergencyMessages.length)]
      : standardMessages[Math.floor(Math.random() * standardMessages.length)]
    
    leads.push({
      id: `roofing-lead-${i + 1}`,
      name,
      address,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      source,
      status,
      emergencyLevel,
      qualityScore,
      createdAt: leadDate.toISOString(),
      capturedAt: capturedAt.toISOString(),
      isAfterHours,
      estimatedJobValue,
      jobType,
      notes,
      assignedTo: status !== 'new' && status !== 'emergency' ? `team-${Math.floor(Math.random() * 4) + 1}` : undefined,
      responseTime,
      convertedAt,
      actualJobValue,
    })
  }
  
  // Sort by emergency level and date (newest first)
  return leads.sort((a, b) => {
    if (a.status === 'emergency' && b.status !== 'emergency') return -1
    if (a.status !== 'emergency' && b.status === 'emergency') return 1
    if (a.emergencyLevel !== b.emergencyLevel) return b.emergencyLevel - a.emergencyLevel
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export const roofingTeamMembers: RoofingTeamMember[] = [
  {
    id: 'team-1',
    name: 'Mike Rodriguez',
    role: 'Lead Estimator',
    avatar: 'MR',
    leadsCount: 11,
    emergencyLeadsCount: 4,
    conversionRate: 73,
    avgResponseTime: 28,
    revenueGenerated: 12400,
  },
  {
    id: 'team-2',
    name: 'Amanda Foster',
    role: 'Sales Manager',
    avatar: 'AF',
    leadsCount: 9,
    emergencyLeadsCount: 3,
    conversionRate: 78,
    avgResponseTime: 22,
    revenueGenerated: 9800,
  },
  {
    id: 'team-3',
    name: 'Tom Wilson',
    role: 'Estimator',
    avatar: 'TW',
    leadsCount: 7,
    emergencyLeadsCount: 2,
    conversionRate: 71,
    avgResponseTime: 35,
    revenueGenerated: 7200,
  },
  {
    id: 'team-4',
    name: 'Jessica Martinez',
    role: 'Sales Rep',
    avatar: 'JM',
    leadsCount: 5,
    emergencyLeadsCount: 1,
    conversionRate: 60,
    avgResponseTime: 42,
    revenueGenerated: 4800,
  },
]

export const roofingAnalytics: RoofingAnalytics = {
  totalLeads: 52,
  emergencyLeads: 12,
  newLeads: 8,
  conversionRate: 19,
  estimatedRevenue: 11700,
  actualRevenue: 9900,
  leadsBySource: {
    chatbot: 23, // 45%
    phone: 29,   // 55%
  },
  leadsByTime: {
    businessHours: 20,  // 38%
    afterHours: 32,     // 62%
  },
  leadsByStatus: {
    new: 8,
    emergency: 3,
    contacted: 18,
    scheduled: 12,
    converted: 10,
  },
  conversionFunnel: [
    { stage: 'Leads', count: 52, percentage: 100 },
    { stage: 'Contacted', count: 40, percentage: 77 },
    { stage: 'Scheduled', count: 22, percentage: 42 },
    { stage: 'Completed', count: 10, percentage: 19 },
  ],
  responseTimeMetrics: {
    avgResponseTime: 32,
    emergencyResponseTime: 18,
    standardResponseTime: 45,
  },
  monthlyBreakdown: [
    { month: 'Week 1', leads: 13, emergencyJobs: 1, standardJobs: 2, revenue: 3000 },
    { month: 'Week 2', leads: 14, emergencyJobs: 1, standardJobs: 2, revenue: 3000 },
    { month: 'Week 3', leads: 12, emergencyJobs: 0, standardJobs: 2, revenue: 1800 },
    { month: 'Week 4', leads: 13, emergencyJobs: 1, standardJobs: 1, revenue: 2100 },
  ],
}

export const roofingROI: RoofingROI = {
  monthlyCost: 697,
  totalLeads: 52,
  emergencyLeads: 12,
  emergencyJobsConverted: 3,
  emergencyJobValue: 1200,
  standardJobsConverted: 7,
  standardJobValue: 900,
  totalRevenue: 9900,
  costPerLead: 13.40,
  revenuePerLead: 190.38,
  roi: 1320,
  paybackPeriod: 0.07,
}

