'use client'

import { useState } from 'react'
import { RoofingLead } from '@/types/roofing'
import { Mail, Phone, MapPin, Calendar, DollarSign, AlertTriangle, Filter, Clock, CheckCircle } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

// Helper function to safely format dates
const safeFormatDate = (dateString: string, formatStr: string, fallback: string = 'Invalid date'): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return fallback
    }
    return format(date, formatStr)
  } catch {
    return fallback
  }
}

interface LeadInboxProps {
  leads: RoofingLead[]
}

export default function LeadInbox({ leads }: LeadInboxProps) {
  const [filter, setFilter] = useState<'all' | 'chatbot' | 'phone'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | RoofingLead['status']>('all')
  const [sortBy, setSortBy] = useState<'emergency' | 'date' | 'value'>('emergency')

  const filteredLeads = leads
    .filter(lead => filter === 'all' || lead.source === filter)
    .filter(lead => statusFilter === 'all' || lead.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'emergency') {
        if (a.status === 'emergency' && b.status !== 'emergency') return -1
        if (a.status !== 'emergency' && b.status === 'emergency') return 1
        return b.emergencyLevel - a.emergencyLevel
      }
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return b.estimatedJobValue - a.estimatedJobValue
    })

  const getStatusColor = (status: RoofingLead['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      emergency: 'bg-red-100 text-red-800 border-red-300',
      contacted: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
    }
    return colors[status]
  }

  const getJobTypeColor = (jobType: RoofingLead['jobType']) => {
    const colors = {
      emergency: 'bg-red-500',
      standard: 'bg-blue-500',
      inspection: 'bg-yellow-500',
      quote: 'bg-gray-500',
    }
    return colors[jobType]
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
            <option value="emergency">Emergency</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="converted">Converted</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="emergency">Sort by Priority</option>
            <option value="date">Sort by Date</option>
            <option value="value">Sort by Value</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                lead.status === 'emergency' ? 'bg-red-50 border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                        {lead.status === 'emergency' && (
                          <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                        )}
                        {lead.status === 'converted' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {lead.address}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getJobTypeColor(lead.jobType)}`} title={lead.jobType} />
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
                      {safeFormatDate(lead.createdAt, 'MMM dd, yyyy')}
                      {lead.isAfterHours && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          After Hours
                        </span>
                      )}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {safeFormatDate(lead.capturedAt, 'h:mm a', safeFormatDate(lead.createdAt, 'h:mm a'))}
                    </span>
                    {lead.estimatedJobValue > 0 && (
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${lead.estimatedJobValue.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700">{lead.notes}</p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Emergency Level:</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < lead.emergencyLevel ? 'bg-red-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{lead.emergencyLevel}/10</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Quality Score:</span>
                      <span className="text-sm font-semibold text-gray-900">{lead.qualityScore}/10</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Source:</span>
                      <span className="text-sm font-medium text-gray-900 capitalize">{lead.source}</span>
                    </div>
                    {lead.responseTime && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Response:</span>
                        <span className="text-sm font-medium text-green-600">{lead.responseTime} min</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Call
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Email
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Schedule
                  </button>
                  {lead.status !== 'converted' && (
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Convert
                    </button>
                  )}
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
    </div>
  )
}
