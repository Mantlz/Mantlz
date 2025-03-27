import * as React from "react"

interface MetricCardProps {
  label: string;
  value: number;
  format: 'number' | 'percentage' | 'time';
  trend?: 'up' | 'down';
  suffix?: string;
}

export function MetricCard({ label, value, format, trend, suffix }: MetricCardProps) {
  const formattedValue = React.useMemo(() => {
    switch (format) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'time':
        return `${value.toFixed(1)}s`;
      default:
        return value.toLocaleString();
    }
  }, [value, format]);

  return (
    <div className="flex flex-col items-start p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
          {formattedValue}{suffix ? ` ${suffix}` : ''}
        </span>
        {trend && (
          <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </div>
  );
} 