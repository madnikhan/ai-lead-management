'use client'

import { TeamMember, Lead } from '@/types'
import { Users, Target, TrendingUp, Mail } from 'lucide-react'

interface TeamAssignmentProps {
  teamMembers: TeamMember[]
  leads: Lead[]
}

export default function TeamAssignment({ teamMembers, leads }: TeamAssignmentProps) {
  const getLeadsForMember = (memberId: string) => {
    return leads.filter(lead => lead.assignedTo === memberId)
  }

  const getLeadsByStatus = (memberLeads: Lead[]) => {
    return {
      new: memberLeads.filter(l => l.status === 'new').length,
      contacted: memberLeads.filter(l => l.status === 'contacted').length,
      qualified: memberLeads.filter(l => l.status === 'qualified').length,
      proposal: memberLeads.filter(l => l.status === 'proposal').length,
      closed: memberLeads.filter(l => l.status === 'closed').length,
    }
  }

  const getTotalValue = (memberLeads: Lead[]) => {
    return memberLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0)
  }

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Team Performance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Total Team Members</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{teamMembers.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Avg Conversion Rate</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              {(teamMembers.reduce((sum, m) => sum + m.conversionRate, 0) / teamMembers.length).toFixed(1)}%
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Total Assigned Leads</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">
              {teamMembers.reduce((sum, m) => sum + m.leadsCount, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamMembers.map((member) => {
          const memberLeads = getLeadsForMember(member.id)
          const statusBreakdown = getLeadsByStatus(memberLeads)
          const totalValue = getTotalValue(memberLeads)

          return (
            <div
              key={member.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-semibold">{member.conversionRate}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Conversion</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Assigned Leads</p>
                  <p className="text-xl font-bold text-gray-900">{member.leadsCount}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Pipeline Value</p>
                  <p className="text-xl font-bold text-gray-900">${(totalValue / 1000).toFixed(0)}K</p>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Lead Status Breakdown</p>
                <div className="space-y-2">
                  {Object.entries(statusBreakdown).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            status === 'new'
                              ? 'bg-blue-500'
                              : status === 'contacted'
                              ? 'bg-yellow-500'
                              : status === 'qualified'
                              ? 'bg-purple-500'
                              : status === 'proposal'
                              ? 'bg-orange-500'
                              : 'bg-green-500'
                          }`}
                        />
                        <span className="text-sm text-gray-600 capitalize">{status}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Leads */}
              {memberLeads.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Top Leads</p>
                  <div className="space-y-2">
                    {memberLeads
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                            <p className="text-xs text-gray-600">{lead.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">Score: {lead.score}</p>
                            <p className="text-xs text-gray-600">${(lead.estimatedValue / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

