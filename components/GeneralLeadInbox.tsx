'use client'

import { useState } from 'react'
import { Lead } from '@/types'
import { Mail, Phone, Building2, Calendar, DollarSign, TrendingUp, Filter } from 'lucide-react'
import { format } from 'date-fns'

interface GeneralLeadInboxProps {
  leads: Lead[]
}

export default function GeneralLeadInbox({ leads }: GeneralLeadInboxProps) {
  const [filter, setFilter] = useState<'all' | 'chatbot' | 'phone'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>('all')
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'value'>('score')

  const filteredLeads = leads
    .filter(lead => filter === 'all' || lead.source === filter)
    .filter(lead => statusFilter === 'all' || lead.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return b.estimatedValue - a.estimatedValue
    })

  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-purple-100 text-purple-800',
      proposal: 'bg-orange-100 text-orange-800',
      closed: 'bg-green-100 text-green-800',
    }
    return colors[status]
  }

  const getPriorityColor = (priority: Lead['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return colors[priority]
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 font-bold'
    if (score >= 70) return 'text-yellow-600 font-semibold'
    return 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex space-x-2">
            {(['all', 'chatbot', 'phone'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All Sources' : f === 'chatbot' ? 'Chatbot' : 'Phone'}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="score">Sort by Score</option>
            <option value="date">Sort by Date</option>
            <option value="value">Sort by Value</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="divide-y divide-gray-200">
        {filteredLeads.slice(0, 20).map((lead) => (
          <div
            key={lead.id}
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Building2 className="w-4 h-4 mr-1" />
                      {lead.company}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                    {lead.priority} priority
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {lead.email}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {lead.phone}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${lead.estimatedValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Lead Score:</span>
                    <span className={`text-lg font-semibold ${getScoreColor(lead.score)}`}>
                      {lead.score}/100
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${lead.source === 'chatbot' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <span className="text-sm text-gray-600 capitalize">{lead.source}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          No leads found matching your filters.
        </div>
      )}
    </div>
  )
}

