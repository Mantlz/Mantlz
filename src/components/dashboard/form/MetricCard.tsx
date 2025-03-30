import * as React from "react"
import { Lock, TrendingDown, TrendingUp } from "lucide-react"

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
    <div className="relative rounded-lg border-2 border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Top accent line */}
      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-300 dark:bg-zinc-700" /> */}
      
      {/* Main content */}
      <div className="px-4 pt-4 pb-3">
        {/* Label section with icon indicator */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-medium">
            {label}
          </h3>
          {trend && !locked && (
            <div className={`flex items-center justify-center p-1 rounded-full ${
              trend === 'up' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {trend === 'up' 
                ? <TrendingUp className="h-3 w-3" /> 
                : <TrendingDown className="h-3 w-3" />
              }
            </div>
          )}
        </div>
        
        {/* Value section with additional details */}
        <div className="flex items-end gap-1.5">
          <span className={`text-2xl font-bold font-mono text-slate-900 dark:text-zinc-50 ${locked ? 'blur-sm' : ''}`}>
            {formattedValue}
          </span>
          {format !== 'custom' && suffix && (
            <span className="text-sm font-medium text-slate-500 dark:text-zinc-400 mb-0.5">
              {suffix}
            </span>
          )}
        </div>
      </div>
      
      {/* Premium lock overlay */}
      {locked && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-br from-white/60 to-white/80 dark:from-zinc-900/60 dark:to-zinc-900/80 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-800 rounded-full p-1.5 shadow-md">
            <Lock className="h-4 w-4 text-slate-600 dark:text-zinc-300" />
          </div>
        </div>
      )}
      
      {/* Add subtle grid pattern for depth */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] dark:opacity-10" />
    </div>
  );
} 