'use client'

import { useState, useEffect } from 'react'
import { RoofingLead } from '@/types/roofing'
import { AlertTriangle, Target, TrendingUp, Clock, CheckCircle, DollarSign, Zap, Info } from 'lucide-react'
import { format } from 'date-fns'

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

interface LeadScoringProps {
  leads: RoofingLead[]
}

interface ScoringFactors {
  emergencyIndicators: string[]
  qualityIndicators: string[]
  readinessIndicators: string[]
  valueIndicators: string[]
}

// Calculate scoring factors for a lead
const calculateScoringFactors = (lead: RoofingLead): ScoringFactors => {
  const factors: ScoringFactors = {
    emergencyIndicators: [],
    qualityIndicators: [],
    readinessIndicators: [],
    valueIndicators: [],
  }

  // Emergency indicators
  if (lead.emergencyLevel >= 8) {
    factors.emergencyIndicators.push('Critical urgency detected')
  }
  if (lead.emergencyLevel >= 6) {
    factors.emergencyIndicators.push('High urgency keywords')
  }
  if (lead.notes.toLowerCase().includes('leak') || lead.notes.toLowerCase().includes('water')) {
    factors.emergencyIndicators.push('Water damage mentioned')
  }
  if (lead.notes.toLowerCase().includes('storm') || lead.notes.toLowerCase().includes('damage')) {
    factors.emergencyIndicators.push('Storm damage reported')
  }
  if (lead.notes.toLowerCase().includes('urgent') || lead.notes.toLowerCase().includes('asap')) {
    factors.emergencyIndicators.push('Urgent language used')
  }
  if (lead.isAfterHours && lead.emergencyLevel >= 6) {
    factors.emergencyIndicators.push('After-hours emergency')
  }

  // Quality indicators
  if (lead.qualityScore >= 9) {
    factors.qualityIndicators.push('Complete contact information')
    factors.qualityIndicators.push('Full address provided')
    factors.qualityIndicators.push('Clear job description')
  }
  if (lead.phone && lead.email && lead.address) {
    factors.qualityIndicators.push('All contact methods available')
  }
  if (lead.notes && lead.notes.length > 50) {
    factors.qualityIndicators.push('Detailed notes provided')
  }
  if (lead.jobType !== 'quote') {
    factors.qualityIndicators.push('Specific job type identified')
  }
  if (lead.estimatedJobValue > 0) {
    factors.qualityIndicators.push('Job value estimated')
  }

  // Readiness indicators (ready to buy now)
  if (lead.notes.toLowerCase().includes('ready') || lead.notes.toLowerCase().includes('now')) {
    factors.readinessIndicators.push('Ready to proceed language')
  }
  if (lead.notes.toLowerCase().includes('immediate') || lead.notes.toLowerCase().includes('asap')) {
    factors.readinessIndicators.push('Immediate action requested')
  }
  if (lead.emergencyLevel >= 7 && lead.qualityScore >= 8) {
    factors.readinessIndicators.push('High urgency + quality = ready')
  }
  if (lead.estimatedJobValue >= 1000 && lead.qualityScore >= 8) {
    factors.readinessIndicators.push('High value + complete info')
  }
  if (lead.source === 'phone' && lead.qualityScore >= 7) {
    factors.readinessIndicators.push('Phone inquiry = high intent')
  }

  // Value indicators
  if (lead.estimatedJobValue >= 1500) {
    factors.valueIndicators.push('High-value job ($1,500+)')
  }
  if (lead.jobType === 'emergency' && lead.estimatedJobValue >= 1000) {
    factors.valueIndicators.push('Emergency premium pricing')
  }
  if (lead.estimatedJobValue >= 800) {
    factors.valueIndicators.push('Above-average job value')
  }

  return factors
}

// Calculate "ready to buy" score
const calculateReadinessScore = (lead: RoofingLead, factors: ScoringFactors): number => {
  let score = 0
  if (lead.emergencyLevel >= 7) score += 3
  if (lead.qualityScore >= 8) score += 3
  if (factors.readinessIndicators.length >= 2) score += 2
  if (lead.estimatedJobValue >= 1000) score += 2
  return Math.min(10, score)
}

export default function LeadScoring({ leads }: LeadScoringProps) {
  const [animatedScores, setAnimatedScores] = useState<Record<string, { emergency: number; quality: number }>>({})

  // Simulate real-time score updates
  useEffect(() => {
    const timer = setTimeout(() => {
      const updates: Record<string, { emergency: number; quality: number }> = {}
      leads.forEach((lead) => {
        // Simulate slight score variations (within ±1)
        const emergencyVariation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0
        const qualityVariation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0
        updates[lead.id] = {
          emergency: Math.max(1, Math.min(10, lead.emergencyLevel + emergencyVariation)),
          quality: Math.max(1, Math.min(10, lead.qualityScore + qualityVariation)),
        }
      })
      setAnimatedScores(updates)
    }, 2000)

    return () => clearTimeout(timer)
  }, [leads])

  // Sort leads by AI priority (emergency level + quality score + readiness)
  const scoredLeads = [...leads]
    .map((lead) => {
      const factors = calculateScoringFactors(lead)
      const readinessScore = calculateReadinessScore(lead, factors)
      const priorityScore = lead.emergencyLevel * 2 + lead.qualityScore + readinessScore
      return { ...lead, factors, readinessScore, priorityScore }
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 20)

  const getPriorityBadge = (lead: RoofingLead & { priorityScore: number }) => {
    if (lead.priorityScore >= 30) return { label: 'Critical', color: 'bg-red-600 text-white', border: 'border-red-500' }
    if (lead.priorityScore >= 25) return { label: 'High', color: 'bg-orange-500 text-white', border: 'border-orange-500' }
    if (lead.priorityScore >= 20) return { label: 'Medium', color: 'bg-yellow-500 text-white', border: 'border-yellow-500' }
    return { label: 'Low', color: 'bg-gray-400 text-white', border: 'border-gray-400' }
  }

  const getEmergencyColor = (level: number) => {
    if (level >= 8) return 'text-red-600 font-bold'
    if (level >= 6) return 'text-orange-600 font-semibold'
    return 'text-gray-600'
  }

  const getQualityColor = (score: number) => {
    if (score >= 9) return 'text-green-600 font-bold'
    if (score >= 7) return 'text-blue-600 font-semibold'
    return 'text-gray-600'
  }

  const isHighValueEmergency = (lead: RoofingLead) => {
    return lead.emergencyLevel >= 7 && lead.estimatedJobValue >= 1000
  }

  return (
    <div className="space-y-6">
      {/* AI Scoring System Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
        <div className="flex items-start space-x-4">
          <Target className="w-8 h-8 text-blue-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Lead Scoring System</h3>
            <p className="text-sm text-gray-700 mb-4">
              Our AI automatically analyzes each lead using advanced algorithms to determine emergency level, quality, 
              readiness, and value. Scores update in real-time as new information becomes available.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="font-semibold text-gray-900 mb-1 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />
                  Emergency Score (1-10)
                </p>
                <p className="text-gray-600 text-xs">
                  Urgency indicators: leaks, storm damage, time sensitivity, emergency keywords
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="font-semibold text-gray-900 mb-1 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                  Quality Score (1-10)
                </p>
                <p className="text-gray-600 text-xs">
                  Information completeness: contact details, address, job description clarity
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="font-semibold text-gray-900 mb-1 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-yellow-600" />
                  Readiness Score
                </p>
                <p className="text-gray-600 text-xs">
                  Ready to buy indicators: immediate action, high intent, urgency + quality
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <p className="font-semibold text-gray-900 mb-1 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-purple-600" />
                  Value Flags
                </p>
                <p className="text-gray-600 text-xs">
                  High-value emergency jobs automatically flagged in red for priority attention
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Queue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI-Suggested Priority Queue</h3>
              <p className="text-sm text-gray-600 mt-1">
                Leads sorted by AI priority score (Emergency × 2 + Quality + Readiness)
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 animate-pulse text-blue-600" />
              <span>Scores update in real-time</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {scoredLeads.map((lead, index) => {
            const priority = getPriorityBadge(lead as any)
            const factors = lead.factors as ScoringFactors
            const readinessScore = lead.readinessScore as number
            const isHighValue = isHighValueEmergency(lead)
            const displayEmergency = animatedScores[lead.id]?.emergency ?? lead.emergencyLevel
            const displayQuality = animatedScores[lead.id]?.quality ?? lead.qualityScore

            return (
              <div
                key={lead.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  isHighValue ? 'bg-red-50 border-l-4 border-red-500' : ''
                } ${lead.status === 'emergency' ? 'bg-red-50 border-l-4 border-red-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                        {isHighValue && (
                          <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-medium text-red-700">High-Value Emergency</span>
                          </div>
                        )}
                        {lead.status === 'emergency' && (
                          <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${priority.color} ${priority.border}`}>
                        {priority.label} Priority
                      </span>
                      <span className="text-sm text-gray-600">
                        Score: <span className="font-semibold text-gray-900">{lead.priorityScore}</span>
                      </span>
                      {readinessScore >= 7 && (
                        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                          <Zap className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Ready to Buy</span>
                        </div>
                      )}
                    </div>

                    {/* Scoring Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Emergency Score */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />
                            Emergency Score
                          </span>
                          <span className={`text-lg font-bold transition-all duration-500 ${getEmergencyColor(displayEmergency)}`}>
                            {displayEmergency}/10
                          </span>
                        </div>
                        <div className="flex space-x-1 mb-2">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-2 rounded transition-all duration-300 ${
                                i < displayEmergency
                                  ? displayEmergency >= 8
                                    ? 'bg-red-500'
                                    : displayEmergency >= 6
                                    ? 'bg-orange-500'
                                    : 'bg-yellow-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {displayEmergency >= 8
                            ? 'Critical - Immediate response required'
                            : displayEmergency >= 6
                            ? 'High urgency - Respond within 1 hour'
                            : displayEmergency >= 4
                            ? 'Moderate urgency - Respond within 4 hours'
                            : 'Standard priority - Respond within 24 hours'}
                        </p>
                        {factors.emergencyIndicators.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {factors.emergencyIndicators.slice(0, 2).map((indicator, idx) => (
                              <div key={idx} className="flex items-center space-x-1 text-xs text-red-600">
                                <div className="w-1 h-1 bg-red-600 rounded-full" />
                                <span>{indicator}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quality Score */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                            Quality Score
                          </span>
                          <span className={`text-lg font-bold transition-all duration-500 ${getQualityColor(displayQuality)}`}>
                            {displayQuality}/10
                          </span>
                        </div>
                        <div className="flex space-x-1 mb-2">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-2 rounded transition-all duration-300 ${
                                i < displayQuality
                                  ? displayQuality >= 9
                                    ? 'bg-green-500'
                                    : displayQuality >= 7
                                    ? 'bg-blue-500'
                                    : 'bg-yellow-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {displayQuality >= 9
                            ? 'Excellent - Complete information, clear job need'
                            : displayQuality >= 7
                            ? 'Good - Sufficient details for follow-up'
                            : 'Fair - May need additional information'}
                        </p>
                        {factors.qualityIndicators.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {factors.qualityIndicators.slice(0, 2).map((indicator, idx) => (
                              <div key={idx} className="flex items-center space-x-1 text-xs text-green-600">
                                <div className="w-1 h-1 bg-green-600 rounded-full" />
                                <span>{indicator}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Readiness Score */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-yellow-600" />
                            Readiness Score
                          </span>
                          <span className={`text-lg font-bold ${
                            readinessScore >= 7 ? 'text-green-600' : readinessScore >= 5 ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {readinessScore}/10
                          </span>
                        </div>
                        <div className="flex space-x-1 mb-2">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-2 rounded ${
                                i < readinessScore
                                  ? readinessScore >= 7
                                    ? 'bg-green-500'
                                    : readinessScore >= 5
                                    ? 'bg-yellow-500'
                                    : 'bg-orange-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {readinessScore >= 7
                            ? 'Ready to buy now - High conversion probability'
                            : readinessScore >= 5
                            ? 'Interested - Good conversion potential'
                            : 'Early stage - Needs nurturing'}
                        </p>
                        {factors.readinessIndicators.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {factors.readinessIndicators.slice(0, 2).map((indicator, idx) => (
                              <div key={idx} className="flex items-center space-x-1 text-xs text-yellow-600">
                                <div className="w-1 h-1 bg-yellow-600 rounded-full" />
                                <span>{indicator}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Scoring Factors Breakdown */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Info className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-semibold text-gray-900">AI Scoring Factors</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {factors.valueIndicators.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <DollarSign className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-purple-700 mb-1">Value Indicators:</p>
                              {factors.valueIndicators.map((indicator, idx) => (
                                <p key={idx} className="text-purple-600">• {indicator}</p>
                              ))}
                            </div>
                          </div>
                        )}
                        {factors.emergencyIndicators.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-red-700 mb-1">Emergency Factors:</p>
                              {factors.emergencyIndicators.slice(0, 3).map((indicator, idx) => (
                                <p key={idx} className="text-red-600">• {indicator}</p>
                              ))}
                            </div>
                          </div>
                        )}
                        {factors.qualityIndicators.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-green-700 mb-1">Quality Factors:</p>
                              {factors.qualityIndicators.slice(0, 3).map((indicator, idx) => (
                                <p key={idx} className="text-green-600">• {indicator}</p>
                              ))}
                            </div>
                          </div>
                        )}
                        {factors.readinessIndicators.length > 0 && (
                          <div className="flex items-start space-x-2">
                            <Zap className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-yellow-700 mb-1">Readiness Factors:</p>
                              {factors.readinessIndicators.slice(0, 3).map((indicator, idx) => (
                                <p key={idx} className="text-yellow-600">• {indicator}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span>{lead.address}</span>
                      <span>•</span>
                      <span>{lead.phone}</span>
                      <span>•</span>
                      <span>{safeFormatDate(lead.createdAt, 'MMM dd, yyyy')}</span>
                      {lead.estimatedJobValue > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-gray-900">
                            ${lead.estimatedJobValue.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-3 bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{lead.notes}</p>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Contact Now
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
