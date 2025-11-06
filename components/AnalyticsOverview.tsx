'use client'

import { useState, useEffect } from 'react'
import { RoofingAnalytics } from '@/types/roofing'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { TrendingUp, Users, Phone, MessageSquare, Clock, AlertCircle, DollarSign } from 'lucide-react'

interface AnalyticsOverviewProps {
  analytics: RoofingAnalytics
}

const COLORS = {
  chatbot: '#0ea5e9',
  phone: '#10b981',
  businessHours: '#8b5cf6',
  afterHours: '#f59e0b',
  emergency: '#ef4444',
  general: '#3b82f6',
}

export default function AnalyticsOverview({ analytics }: AnalyticsOverviewProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const sourceData = [
    { name: 'Chatbot', value: analytics.leadsBySource.chatbot, fill: COLORS.chatbot },
    { name: 'Phone', value: analytics.leadsBySource.phone, fill: COLORS.phone },
  ]

  const timeData = [
    { name: 'Business Hours', value: analytics.leadsByTime.businessHours, fill: COLORS.businessHours },
    { name: 'After Hours', value: analytics.leadsByTime.afterHours, fill: COLORS.afterHours },
  ]

  const conversionFunnelData = analytics.conversionFunnel.map((stage, index) => ({
    ...stage,
    fill: index === 0 ? COLORS.chatbot : index === 1 ? COLORS.phone : index === 2 ? COLORS.businessHours : COLORS.afterHours,
  }))

  // Calculate emergency vs general distribution
  const emergencyVsGeneral = [
    { name: 'Emergency', value: analytics.emergencyLeads, fill: COLORS.emergency },
    { name: 'General', value: analytics.totalLeads - analytics.emergencyLeads, fill: COLORS.general },
  ]

  // Calculate revenue by source (mock data - would come from actual leads)
  const revenueBySource = [
    { name: 'Chatbot', revenue: analytics.actualRevenue * 0.45, leads: analytics.leadsBySource.chatbot },
    { name: 'Phone', revenue: analytics.actualRevenue * 0.55, leads: analytics.leadsBySource.phone },
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].dataKey === 'revenue' ? '$' : ''}
            {payload[0].value?.toLocaleString()}
            {payload[0].dataKey === 'revenue' ? '' : ' leads'}
          </p>
          {payload[0].payload.percentage !== undefined && (
            <p className="text-xs text-gray-500 mt-1">{payload[0].payload.percentage}%</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">24/7 Capture</p>
              <p className="text-2xl font-bold text-blue-900">
                {analytics.leadsByTime.afterHours} Leads
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {((analytics.leadsByTime.afterHours / analytics.totalLeads) * 100).toFixed(0)}% after hours
              </p>
            </div>
            <Clock className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">Emergency Response</p>
              <p className="text-2xl font-bold text-red-900">
                {analytics.responseTimeMetrics.emergencyResponseTime} min
              </p>
              <p className="text-xs text-red-600 mt-1">Avg emergency response time</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-900">
                {analytics.conversionRate}%
              </p>
              <p className="text-xs text-green-600 mt-1">Leads converted to jobs</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source - Animated Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Leads by Source
          </h3>
          <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 transition-transform duration-300 hover:scale-105">
              <p className="text-sm text-blue-700 font-medium">Chatbot</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {analytics.leadsBySource.chatbot}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {((analytics.leadsBySource.chatbot / analytics.totalLeads) * 100).toFixed(0)}% of total
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 transition-transform duration-300 hover:scale-105">
              <p className="text-sm text-green-700 font-medium">Phone</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {analytics.leadsBySource.phone}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {((analytics.leadsBySource.phone / analytics.totalLeads) * 100).toFixed(0)}% of total
              </p>
            </div>
          </div>
        </div>

        {/* Leads by Time - Animated Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Leads by Time
          </h3>
          <div className={`transition-opacity duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={timeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 transition-transform duration-300 hover:scale-105">
              <p className="text-sm text-purple-700 font-medium">Business Hours</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {analytics.leadsByTime.businessHours}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {((analytics.leadsByTime.businessHours / analytics.totalLeads) * 100).toFixed(0)}% | 7 AM - 7 PM
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 transition-transform duration-300 hover:scale-105">
              <p className="text-sm text-orange-700 font-medium">After Hours</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {analytics.leadsByTime.afterHours}
              </p>
              <p className="text-xs text-orange-600 mt-1">
                {((analytics.leadsByTime.afterHours / analytics.totalLeads) * 100).toFixed(0)}% | 24/7 capture
              </p>
            </div>
          </div>
        </div>

        {/* Conversion Funnel - Animated Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Conversion Funnel
          </h3>
          <div className={`transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionFunnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill="#0ea5e9"
                  animationBegin={300}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  radius={[0, 8, 8, 0]}
                >
                  {conversionFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {conversionFunnelData.map((stage, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.fill }}
                  />
                  <span className="text-gray-600">{stage.stage}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{stage.count}</span>
                  <span className="text-gray-500 w-12 text-right">{stage.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Lead Source */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            Revenue by Lead Source
          </h3>
          <div className={`transition-opacity duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueBySource}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#10b981"
                  animationBegin={400}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 transition-transform duration-300 hover:scale-105">
              <p className="text-sm text-blue-700 font-medium">Chatbot Revenue</p>
              <p className="text-xl font-bold text-blue-900 mt-1">
                ${(revenueBySource[0].revenue / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {revenueBySource[0].leads} leads
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 transition-transform duration-300 hover:scale-105">
              <p className="text-sm text-green-700 font-medium">Phone Revenue</p>
              <p className="text-xl font-bold text-green-900 mt-1">
                ${(revenueBySource[1].revenue / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-green-600 mt-1">
                {revenueBySource[1].leads} leads
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency vs General Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
          Emergency vs General Lead Distribution
        </h3>
        <div className={`transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emergencyVsGeneral}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={500}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {emergencyVsGeneral.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-3 border border-red-200 transition-transform duration-300 hover:scale-105">
            <p className="text-sm text-red-700 font-medium">Emergency Leads</p>
            <p className="text-2xl font-bold text-red-900 mt-1">
              {analytics.emergencyLeads}
            </p>
            <p className="text-xs text-red-600 mt-1">
              {((analytics.emergencyLeads / analytics.totalLeads) * 100).toFixed(0)}% of total
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 transition-transform duration-300 hover:scale-105">
            <p className="text-sm text-blue-700 font-medium">General Leads</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {analytics.totalLeads - analytics.emergencyLeads}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {(((analytics.totalLeads - analytics.emergencyLeads) / analytics.totalLeads) * 100).toFixed(0)}% of total
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
