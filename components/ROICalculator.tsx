'use client'

import { ROIData } from '@/types'
import { DollarSign, TrendingUp, Target, Percent, Clock, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ROICalculatorProps {
  roiData: ROIData
}

export default function ROICalculator({ roiData }: ROICalculatorProps) {
  const roiMetrics = [
    {
      title: 'ROI',
      value: `${roiData.roi.toFixed(0)}%`,
      description: 'Return on Investment',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'LTV:CAC Ratio',
      value: `${roiData.ltvCacRatio.toFixed(1)}:1`,
      description: 'Lifetime Value to CAC',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Cost per Lead',
      value: `$${roiData.costPerLead.toFixed(2)}`,
      description: 'Average acquisition cost',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Revenue per Lead',
      value: `$${roiData.revenuePerLead.toFixed(2)}`,
      description: 'Average revenue generated',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Payback Period',
      value: `${roiData.paybackPeriod.toFixed(1)} months`,
      description: 'Time to recover investment',
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      title: 'Lifetime Value',
      value: `$${(roiData.lifetimeValue / 1000).toFixed(0)}K`,
      description: 'Average customer LTV',
      icon: Percent,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ]

  // Generate ROI projection data
  const roiProjection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const cumulativeInvestment = roiData.totalInvestment * month
    const cumulativeRevenue = roiData.totalRevenue * month
    const netProfit = cumulativeRevenue - cumulativeInvestment
    const roi = ((netProfit / cumulativeInvestment) * 100).toFixed(1)

    return {
      month: `Month ${month}`,
      investment: cumulativeInvestment,
      revenue: cumulativeRevenue,
      profit: netProfit,
      roi: parseFloat(roi),
    }
  })

  return (
    <div className="space-y-6">
      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roiMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border-2 ${metric.borderColor} p-6`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`${metric.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{metric.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment vs Revenue</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700 font-medium">Total Investment</span>
              <span className="text-2xl font-bold text-red-600">
                ${(roiData.totalInvestment / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700 font-medium">Total Revenue</span>
              <span className="text-2xl font-bold text-green-600">
                ${(roiData.totalRevenue / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-green-300">
              <span className="text-gray-900 font-semibold">Net Profit</span>
              <span className="text-2xl font-bold text-green-600">
                ${((roiData.totalRevenue - roiData.totalInvestment) / 1000).toFixed(0)}K
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Ratios</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Lifetime Value</span>
                <span className="text-lg font-bold text-gray-900">
                  ${(roiData.lifetimeValue / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Customer Acquisition Cost</span>
                <span className="text-lg font-bold text-gray-900">
                  ${roiData.acquisitionCost.toFixed(0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(roiData.acquisitionCost / roiData.lifetimeValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">LTV:CAC Ratio</span>
                <span className="text-2xl font-bold text-green-700">
                  {roiData.ltvCacRatio.toFixed(1)}:1
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Excellent ratio! Industry standard is 3:1
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Projection Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">12-Month ROI Projection</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={roiProjection}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'roi') return `${value}%`
                return `$${value.toLocaleString()}`
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="investment"
              stroke="#ef4444"
              strokeWidth={2}
              name="Investment"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Net Profit"
            />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="ROI %"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
