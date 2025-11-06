'use client'

import { useState, useEffect } from 'react'
import { generateRoofingLeads, roofingAnalytics, roofingTeamMembers, roofingROI } from '@/lib/mock-data'
import HeaderMetrics from './HeaderMetrics'
import LeadInbox from './LeadInbox'
import AnalyticsOverview from './AnalyticsOverview'
import LeadScoring from './LeadScoring'
import PerformanceMetrics from './PerformanceMetrics'
import ROICalculator from './RoofingROICalculator'
import TeamManagement from './TeamManagement'
import { AlertTriangle, BarChart3, Users, DollarSign, Mail, Target } from 'lucide-react'
import { RoofingLead } from '@/types/roofing'

export default function RoofingDashboard() {
  const [leads, setLeads] = useState<RoofingLead[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'inbox' | 'analytics' | 'scoring' | 'performance' | 'roi' | 'team'>('inbox')

  useEffect(() => {
    // Only generate data on client side to avoid hydration mismatch
    setIsMounted(true)
    setLeads(generateRoofingLeads())
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Lead Management Dashboard</h1>
              <p className="text-gray-600 mt-1">Roofing Company Lead Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  {roofingAnalytics.emergencyLeads} Active Emergencies
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <HeaderMetrics analytics={roofingAnalytics} leads={leads} />
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
              {[
                { id: 'inbox', name: 'Lead Inbox', icon: Mail },
                { id: 'scoring', name: 'AI Scoring', icon: Target },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 },
                { id: 'performance', name: 'Performance', icon: BarChart3 },
                { id: 'roi', name: 'ROI Calculator', icon: DollarSign },
                { id: 'team', name: 'Team Management', icon: Users },
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
                    } flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
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
          {activeTab === 'scoring' && <LeadScoring leads={leads} />}
          {activeTab === 'analytics' && <AnalyticsOverview analytics={roofingAnalytics} />}
          {activeTab === 'performance' && <PerformanceMetrics analytics={roofingAnalytics} leads={leads} />}
          {activeTab === 'roi' && <ROICalculator roi={roofingROI} />}
          {activeTab === 'team' && <TeamManagement teamMembers={roofingTeamMembers} leads={leads} />}
        </div>
      </div>
    </div>
  )
}

