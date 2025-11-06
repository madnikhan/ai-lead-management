'use client'

import { RoofingAnalytics, RoofingLead } from '@/types/roofing'
import { Users, AlertCircle, TrendingUp, DollarSign, Clock } from 'lucide-react'

interface HeaderMetricsProps {
  analytics: RoofingAnalytics
  leads: RoofingLead[]
}

export default function HeaderMetrics({ analytics, leads }: HeaderMetricsProps) {
  const emergencyLeads = leads.filter(l => l.status === 'emergency' || l.emergencyLevel >= 7)
  const newLeads = leads.filter(l => l.status === 'new')
  const convertedLeads = leads.filter(l => l.status === 'converted')
  const totalRevenue = convertedLeads.reduce((sum, lead) => sum + (lead.actualJobValue || lead.estimatedJobValue), 0)

  const metrics = [
    {
      title: 'Total Leads (24/7)',
      value: analytics.totalLeads.toString(),
      change: `${analytics.totalLeads} captured this month`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Emergency Leads',
      value: emergencyLeads.length.toString(),
      change: `${analytics.emergencyLeads} flagged as urgent`,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      isAlert: true,
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: `${convertedLeads.length} jobs converted`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Estimated Revenue',
      value: `$${(totalRevenue / 1000).toFixed(1)}K`,
      change: `$${analytics.estimatedRevenue.toLocaleString()} pipeline`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-sm border-2 ${metric.borderColor} p-6 ${
              metric.isAlert ? 'ring-2 ring-red-300' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.change}</p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </div>
            {metric.isAlert && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-red-700 font-medium">⚠️ Immediate attention required</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

