'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';


import {
  ChartConfig,
  ChartTooltip,
} from '@/components/ui/chart';



interface CampaignMetric {
  date: string;
  opens: number;
  clicks: number;
  bounces: number;
}

type MetricKey = 'opens' | 'clicks' | 'bounces';

interface MonthlyMetric {
  month: string;
  opens: number;
  clicks: number;
  bounces: number;
}

const chartConfig = {
  metrics: {
    label: 'Email Metrics',
  },
  opens: {
    label: 'Opens',
    color: 'hsl(265, 89%, 78%)', // Purple
  },
  clicks: {
    label: 'Clicks',
    color: 'hsl(212, 89%, 78%)', // Blue
  },
  bounces: {
    label: 'Bounces',
    color: 'hsl(32, 89%, 78%)', // Orange
  },
} satisfies ChartConfig;

interface CampaignChartProps {
  data: CampaignMetric[];
}

export function CampaignChart({ data }: CampaignChartProps) {
  // Group data by month
  const monthlyData = React.useMemo(() => {
    const monthGroups = data.reduce((acc, curr) => {
      const date = new Date(curr.date);
      const monthKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          opens: 0,
          clicks: 0,
          bounces: 0,
        };
      }

      acc[monthKey].opens += curr.opens;
      acc[monthKey].clicks += curr.clicks;
      acc[monthKey].bounces += curr.bounces;

      return acc;
    }, {} as Record<string, MonthlyMetric>);

    return Object.values(monthGroups).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
  }, [data]);

  const totals = React.useMemo(
    () => ({
      opens: data.reduce((acc, curr) => acc + curr.opens, 0),
      clicks: data.reduce((acc, curr) => acc + curr.clicks, 0),
      bounces: data.reduce((acc, curr) => acc + curr.bounces, 0),
    }),
    [data]
  );

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Analytics</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly email campaign performance metrics</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['opens', 'clicks', 'bounces'] as const).map((key) => (
              <div
                key={key}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: chartConfig[key].color }}
                />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {chartConfig[key].label}:
                  <span className="ml-1 font-medium text-zinc-900 dark:text-white">
                    {totals[key].toLocaleString()}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800/50 rounded-lg p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800/50">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 65 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  className="text-xs text-gray-500 dark:text-gray-400"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs text-gray-500 dark:text-gray-400"
                />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-3 border border-zinc-100 dark:border-zinc-800">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            {label}
                          </p>
                          {payload.map((entry) => {
                            const metricName = entry.dataKey as MetricKey;
                            const value = typeof entry.value === 'number' ? entry.value : 0;
                            return (
                              <p
                                key={metricName}
                                className="text-sm text-gray-500 dark:text-gray-400"
                                style={{ color: chartConfig[metricName].color }}
                              >
                                {chartConfig[metricName].label}: {value.toLocaleString()}
                              </p>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="opens"
                  fill={chartConfig.opens.color}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="clicks"
                  fill={chartConfig.clicks.color}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="bounces"
                  fill={chartConfig.bounces.color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 