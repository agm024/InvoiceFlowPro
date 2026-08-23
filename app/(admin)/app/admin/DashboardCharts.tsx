"use client"

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
} from 'recharts'

interface DashboardChartsProps {
  revenueData: { name: string; revenue: number }[]
  signupsData: { name: string; signups: number }[]
}

export default function DashboardCharts({
  revenueData,
  signupsData,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Revenue Line Chart */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">
          Revenue Overview
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.2} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                itemStyle={{ color: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Signups Bar Chart */}
      <div className="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-white">
          New Companies
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={signupsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.2} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: '#27272a', opacity: 0.4 }}
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Bar
                dataKey="signups"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
