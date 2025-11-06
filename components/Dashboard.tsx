'use client'

import { useState, useEffect } from 'react'
import { generateMockLeads, mockAnalytics, mockTeamMembers, mockROIData } from '@/lib/mockData'
import LeadInbox from './LeadInbox'
import PerformanceAnalytics from './PerformanceAnalytics'
import TeamAssignment from './TeamAssignment'
import ROICalculator from './ROICalculator'
import { BarChart3, Users, TrendingUp, DollarSign, Mail, Phone } from 'lucide-react'
import { Lead } from '@/types'

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'inbox' | 'analytics' | 'team' | 'roi'>('inbox')

  useEffect(() => {
    // Only generate data on client side to avoid hydration mismatch
    setIsMounted(true)
    setLeads(generateMockLeads())
  }, [])

  // Show loading state during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Leads',
      value: mockAnalytics.totalLeads.toLocaleString(),
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'New Leads',
      value: mockAnalytics.newLeads.toLocaleString(),
      change: '+8.2%',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Conversion Rate',
      value: `${mockAnalytics.conversionRate}%`,
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Revenue',
      value: `$${(mockAnalytics.totalRevenue / 1000000).toFixed(1)}M`,
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lead Management Dashboard</h1>
              <p className="text-gray-600 mt-1">Unified lead management system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Live Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} vs last month</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'inbox', name: 'Lead Inbox', icon: Mail },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 },
                { id: 'team', name: 'Team Assignment', icon: Users },
                { id: 'roi', name: 'ROI Calculator', icon: DollarSign },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="mb-8">
          {activeTab === 'inbox' && <LeadInbox leads={leads} />}
          {activeTab === 'analytics' && <PerformanceAnalytics analytics={mockAnalytics} />}
          {activeTab === 'team' && <TeamAssignment teamMembers={mockTeamMembers} leads={leads} />}
          {activeTab === 'roi' && <ROICalculator roiData={mockROIData} />}
        </div>
      </div>
    </div>
  )
}

