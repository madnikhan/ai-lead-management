'use client'

import { AnalyticsData } from '@/types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react'

interface PerformanceAnalyticsProps {
  analytics: AnalyticsData
}

export default function PerformanceAnalytics({ analytics }: PerformanceAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Leads</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{analytics.totalLeads.toLocaleString()}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Conversion Rate</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{analytics.conversionRate}%</p>
            </div>
            <Target className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Total Revenue</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                ${(analytics.totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-purple-600 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Avg Deal Size</p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                ${(analytics.averageDealSize / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Lead & Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === 'revenue') return `$${value.toLocaleString()}`
                  return value
                }}
              />
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
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Source */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Chatbot', value: analytics.leadsBySource.chatbot },
                  { name: 'Phone', value: analytics.leadsBySource.phone },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#0ea5e9" />
                <Cell fill="#10b981" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leads by Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(analytics.leadsByStatus).map(([key, value]) => ({ name: key, value }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analytics.conversionFunnel}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {analytics.conversionFunnel.map((stage, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{stage.stage}</span>
                <span className="font-semibold text-gray-900">{stage.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

