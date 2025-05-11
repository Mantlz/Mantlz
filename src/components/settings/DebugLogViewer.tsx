import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface LogEntry {
  timestamp: string;
  level: 'info' | 'error' | 'success';
  message: string;
  details?: Record<string, any>;
}

interface DebugLogViewerProps {
  logs: LogEntry[];
}

export function DebugLogViewer({ logs }: DebugLogViewerProps) {
  return (
    <div className="mt-4 border rounded-lg border-zinc-200 dark:border-zinc-800">
      <div className="p-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 rounded-t-lg">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Debug Logs</h3>
      </div>
      <ScrollArea className="h-[200px] w-full">
        <div className="p-4 space-y-2">
          {logs.map((log, index) => (
            <div
              key={index}
              className={cn(
                "p-2 rounded text-sm font-mono",
                log.level === 'error' && "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
                log.level === 'success' && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
                log.level === 'info' && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-70">{log.timestamp}</span>
                <span>{log.message}</span>
              </div>
              {log.details && (
                <pre className="mt-2 text-xs overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 