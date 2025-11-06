'use client'

import { useState, useEffect } from 'react'
import { RoofingROI } from '@/types/roofing'
import { DollarSign, TrendingUp, Target, Calculator, CheckCircle, Users, Percent, Sliders } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Cell } from 'recharts'

interface ROICalculatorProps {
  roi: RoofingROI
}

export default function ROICalculator({ roi: defaultROI }: ROICalculatorProps) {
  const [numberOfLeads, setNumberOfLeads] = useState(defaultROI.totalLeads)
  const [averageJobValue, setAverageJobValue] = useState(900)
  const [conversionRate, setConversionRate] = useState(19)
  const [systemCost] = useState(697)

  // Calculate metrics in real-time
  const jobsConverted = Math.round((numberOfLeads * conversionRate) / 100)
  const monthlyRevenue = jobsConverted * averageJobValue
  const netProfit = monthlyRevenue - systemCost
  const roiPercentage = systemCost > 0 ? ((netProfit / systemCost) * 100).toFixed(0) : '0'
  const costPerLead = numberOfLeads > 0 ? (systemCost / numberOfLeads).toFixed(2) : '0.00'
  const revenuePerLead = numberOfLeads > 0 ? (monthlyRevenue / numberOfLeads).toFixed(2) : '0.00'
  const paybackPeriod = monthlyRevenue > 0 ? (systemCost / monthlyRevenue).toFixed(2) : '0.00'

  // Data for revenue vs cost chart
  const revenueVsCostData = [
    {
      name: 'System Cost',
      value: systemCost,
      type: 'Cost',
    },
    {
      name: 'Monthly Revenue',
      value: monthlyRevenue,
      type: 'Revenue',
    },
  ]

  // Monthly projection data
  const monthlyProjection = Array.from({ length: 6 }, (_, i) => {
    const month = i + 1
    const cumulativeCost = systemCost * month
    const cumulativeRevenue = monthlyRevenue * month
    return {
      month: `Month ${month}`,
      cost: cumulativeCost,
      revenue: cumulativeRevenue,
      profit: cumulativeRevenue - cumulativeCost,
    }
  })

  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Interactive Input Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Sliders className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Interactive ROI Calculator</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Number of Leads Input */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              <span>Number of Leads</span>
            </label>
            <input
              type="number"
              value={numberOfLeads}
              onChange={(e) => setNumberOfLeads(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all"
              min="0"
            />
            <p className="text-xs text-gray-500">Monthly leads captured</p>
          </div>

          {/* Average Job Value Input */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              <span>Average Job Value</span>
            </label>
            <input
              type="number"
              value={averageJobValue}
              onChange={(e) => setAverageJobValue(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all"
              min="0"
            />
            <p className="text-xs text-gray-500">Average revenue per job</p>
          </div>

          {/* Conversion Rate Input */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Percent className="w-4 h-4" />
              <span>Conversion Rate (%)</span>
            </label>
            <input
              type="number"
              value={conversionRate}
              onChange={(e) => setConversionRate(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all"
              min="0"
              max="100"
            />
            <p className="text-xs text-gray-500">Leads converted to jobs</p>
          </div>
        </div>
      </div>

      {/* Real-time Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Revenue Calculation */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border-2 border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-green-600" />
            Monthly Revenue Calculation
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Jobs Converted</span>
                <span className="text-lg font-bold text-gray-900">
                  {jobsConverted} jobs
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {numberOfLeads} leads × {conversionRate}% conversion rate
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Monthly Revenue</span>
                <span className="text-3xl font-bold text-green-600">
                  ${monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {jobsConverted} jobs × ${averageJobValue.toLocaleString()} avg
              </p>
            </div>
          </div>
        </div>

        {/* ROI Comparison */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border-2 border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Return on Investment
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">System Cost</span>
                <span className="text-lg font-bold text-gray-900">
                  ${systemCost.toLocaleString()}/month
                </span>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Net Profit</span>
                <span className={`text-lg font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netProfit.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500">Revenue - Cost</p>
            </div>
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-2 border-green-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-900">ROI</span>
                <span className="text-3xl font-bold text-green-700">
                  {roiPercentage}%
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">Return on Investment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue vs Cost Visual Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Revenue vs System Cost
        </h3>
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueVsCostData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Bar
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
                radius={[8, 8, 0, 0]}
              >
                {revenueVsCostData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.type === 'Cost' ? '#ef4444' : '#10b981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-700 font-medium">System Cost</p>
            <p className="text-2xl font-bold text-red-900 mt-1">
              ${systemCost.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700 font-medium">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-900 mt-1">
              ${monthlyRevenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Projection Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Projection</h3>
        <div className={`transition-opacity duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyProjection}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#ef4444"
                strokeWidth={2}
                name="Cumulative Cost"
                animationBegin={200}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                name="Cumulative Revenue"
                animationBegin={200}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#0ea5e9"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Net Profit"
                animationBegin={200}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Cost per Lead</p>
          <p className="text-2xl font-bold text-gray-900">
            ${costPerLead}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Revenue per Lead</p>
          <p className="text-2xl font-bold text-green-600">
            ${revenuePerLead}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Payback Period</p>
          <p className="text-2xl font-bold text-blue-600">
            {paybackPeriod} months
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-1">ROI Multiplier</p>
          <p className="text-2xl font-bold text-purple-600">
            {(parseFloat(roiPercentage) / 100 + 1).toFixed(1)}x
          </p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border-2 border-blue-200 p-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              MR
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-gray-900">Mike Rodriguez</p>
              <span className="text-sm text-gray-500">- Lead Estimator</span>
            </div>
            <p className="text-lg text-gray-700 italic mb-2">
              &quot;System paid for itself in first 2 weeks&quot;
            </p>
            <p className="text-sm text-gray-600">
              &quot;We were skeptical at first, but the AI lead capture system started generating quality leads immediately.
              Within the first two weeks, we had converted enough jobs to cover the entire monthly cost.
              The 24/7 capture capability means we never miss a lead, even on weekends and after hours.
              Best investment we&apos;ve made for our roofing business.&quot;
            </p>
            <div className="mt-4 flex items-center space-x-4 text-sm">
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                <span className="text-gray-600">Before:</span>
                <span className="font-semibold text-gray-900 ml-2">15-20 leads/month</span>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                <span className="text-gray-600">After:</span>
                <span className="font-semibold text-green-600 ml-2">100+ leads/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          ROI Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="font-semibold text-green-900">Exceptional ROI</p>
            </div>
            <p className="text-sm text-green-700">
              For every $1 invested, you&apos;re generating ${(parseFloat(roiPercentage) / 100 + 1).toFixed(2)} in returns.
              That&apos;s a {(parseFloat(roiPercentage) / 100 + 1).toFixed(1)}x return on your investment.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <p className="font-semibold text-blue-900">Fast Payback</p>
            </div>
            <p className="text-sm text-blue-700">
              Your investment is recovered in {paybackPeriod} months.
              After that, {roiPercentage}% of revenue is pure profit.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <p className="font-semibold text-purple-900">Low Cost per Lead</p>
            </div>
            <p className="text-sm text-purple-700">
              At ${costPerLead} per lead, your acquisition cost is significantly lower
              than traditional advertising methods.
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <p className="font-semibold text-orange-900">Scalable Growth</p>
            </div>
            <p className="text-sm text-orange-700">
              With {numberOfLeads} leads this month, scaling up would proportionally increase
              your revenue while maintaining the same cost structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
