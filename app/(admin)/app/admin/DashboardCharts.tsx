"use client"

import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

interface ChartItem {
  name: string
  revenue: number
  signups: number
}

interface DashboardChartsProps {
  data7d: ChartItem[]
  data30d: ChartItem[]
  data90d: ChartItem[]
  data12m: ChartItem[]
}

export default function DashboardCharts({
  data7d,
  data30d,
  data90d,
  data12m,
}: DashboardChartsProps) {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d')

  const activeData = {
    '7d': data7d,
    '30d': data30d,
    '90d': data90d,
    '12m': data12m
  }[range]

  return (
    <div className="space-y-6">
      {/* Tab Control */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">Growth & Revenue Trends</h3>
          <p className="text-xs text-zinc-500">Visualizing platform performance metrics over time.</p>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
          {(['7d', '30d', '90d', '12m'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase transition-all ${
                range === r
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
              Gross Platform Revenue
            </h3>
            <span className="text-xs text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#10b981' }}
                  labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signups Bar Chart */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider">
              Tenant Signups
            </h3>
            <span className="text-xs text-blue-500 font-bold bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full">
              New Companies
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.15} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#71717a', fontSize: 10 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#3b82f6' }}
                  labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
                  formatter={(value: any) => [value, 'New Signups']}
                />
                <Bar
                  dataKey="signups"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
