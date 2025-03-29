import * as React from "react"

interface MetricCardProps {
  label: string;
  value: number;
  format: 'number' | 'percentage' | 'time' | 'custom';
  trend?: 'up' | 'down';
  suffix?: string;
  customValue?: string;
}

export function MetricCard({ label, value, format, trend, suffix, customValue }: MetricCardProps) {
  const formattedValue = React.useMemo(() => {
    switch (format) {
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      case 'time':
        return `${value.toFixed(1)}s`;
      case 'custom':
        return customValue || value.toLocaleString();
      default:
        return value.toLocaleString();
    }
  }, [value, format, customValue]);

  return (
    <div className="flex flex-col items-start p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
          {formattedValue}{format !== 'custom' && suffix ? ` ${suffix}` : ''}
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