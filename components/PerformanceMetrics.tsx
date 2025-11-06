'use client'

import { RoofingAnalytics, RoofingLead } from '@/types/roofing'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Target, DollarSign, Clock } from 'lucide-react'

interface PerformanceMetricsProps {
  analytics: RoofingAnalytics
  leads: RoofingLead[]
}

export default function PerformanceMetrics({ analytics, leads }: PerformanceMetricsProps) {
  // Calculate conversion funnel data
  const funnelData = analytics.conversionFunnel.map((stage, index) => ({
    ...stage,
    index,
  }))

  // Monthly/weekly breakdown
  const breakdownData = analytics.monthlyBreakdown

  // Calculate revenue by lead source
  const revenueBySource = {
    chatbot: leads
      .filter(l => l.source === 'chatbot' && l.status === 'converted')
      .reduce((sum, l) => sum + (l.actualJobValue || l.estimatedJobValue), 0),
    phone: leads
      .filter(l => l.source === 'phone' && l.status === 'converted')
      .reduce((sum, l) => sum + (l.actualJobValue || l.estimatedJobValue), 0),
  }

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate}%</p>
          <p className="text-xs text-green-600 mt-1">↑ Above industry avg</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            ${(analytics.actualRevenue / 1000).toFixed(1)}K
          </p>
          <p className="text-xs text-blue-600 mt-1">From {analytics.totalLeads} leads</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.responseTimeMetrics.avgResponseTime} min
          </p>
          <p className="text-xs text-green-600 mt-1">Fast response time</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Revenue per Lead</p>
          <p className="text-3xl font-bold text-gray-900">
            ${Math.round(analytics.actualRevenue / analytics.totalLeads)}
          </p>
          <p className="text-xs text-blue-600 mt-1">Strong ROI</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {funnelData.map((stage, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{stage.stage}</span>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{stage.count}</span>
                  <span className="text-gray-500">{stage.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Chatbot', revenue: revenueBySource.chatbot },
                { name: 'Phone', revenue: revenueBySource.phone },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Chatbot Revenue</p>
              <p className="text-xl font-bold text-blue-900 mt-1">
                ${(revenueBySource.chatbot / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-700 font-medium">Phone Revenue</p>
              <p className="text-xl font-bold text-green-900 mt-1">
                ${(revenueBySource.phone / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={breakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="leads"
                stroke="#0ea5e9"
                strokeWidth={2}
                name="Leads"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="emergencyJobs"
                stroke="#ef4444"
                strokeWidth={2}
                name="Emergency Jobs"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="standardJobs"
                stroke="#10b981"
                strokeWidth={2}
                name="Standard Jobs"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

