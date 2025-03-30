import * as React from "react"
import { Lock } from "lucide-react"

interface MetricCardProps {
  label: string;
  value: number;
  format: 'number' | 'percentage' | 'time' | 'custom';
  trend?: 'up' | 'down';
  suffix?: string;
  customValue?: string;
  locked?: boolean;
}

export function MetricCard({ label, value, format, trend, suffix, customValue, locked = false }: MetricCardProps) {
  const formattedValue = React.useMemo(() => {
    switch (format) {
      case 'percentage':
        return `${Math.round(value * 100)}%`;
      case 'time':
        return `${Math.round(value)}s`;
      case 'custom':
        return customValue || Math.round(value).toLocaleString();
      default:
        // Always round to whole numbers for better readability
        return Math.round(value).toLocaleString();
    }
  }, [value, format, customValue]);

  return (
    <div className="flex flex-col items-start p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 relative">
      <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className={`text-2xl font-bold text-slate-900 dark:text-zinc-50 ${locked ? 'blur-sm' : ''}`}>
          {formattedValue}{format !== 'custom' && suffix ? ` ${suffix}` : ''}
        </span>
        {trend && !locked && (
          <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
        </div>
      )}
    </div>
  );
} 