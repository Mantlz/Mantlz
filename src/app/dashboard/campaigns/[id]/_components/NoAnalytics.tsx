import { BarChart3 } from 'lucide-react';

interface NoAnalyticsProps {
  isDraft?: boolean;
}

export function NoAnalytics({ isDraft = true }: NoAnalyticsProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Campaign Analytics</h3>
        </div>
      </div>
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <BarChart3 className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Analytics Available
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-sm">
          {isDraft 
            ? "Analytics will be available after you send your campaign. Send your campaign to start tracking its performance."
            : "Analytics are being processed. They will be available shortly after your campaign is sent."
          }
        </p>
      </div>
    </div>
  );
} 