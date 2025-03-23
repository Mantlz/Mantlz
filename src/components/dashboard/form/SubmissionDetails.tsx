import { format } from "date-fns";
import { Copy, CheckCheck, Calendar, Hash, Database, AlertCircle, ExternalLink, ChevronLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface FormSubmission {
  id: string;
  submittedAt: Date;
  data: Record<string, any>;
}

interface SubmissionDetailsProps {
  submission?: FormSubmission;
  isLoading?: boolean;
  onBack?: () => void;
  onDelete?: (id: string) => void;
}

export function SubmissionDetails({
  submission,
  isLoading,
  onBack,
  onDelete,
}: SubmissionDetailsProps) {
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm">
        <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-3"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-8"></div>
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="w-full p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="rounded-full bg-gray-100 dark:bg-zinc-800 p-3 mb-4">
            <ChevronLeft className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-mono font-medium mb-2 text-gray-700 dark:text-gray-300">
            No submission selected
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please select a submission from the list to view details
          </p>
          <Button 
            className="font-mono text-sm bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white"
            onClick={onBack}
          >
            BACK TO LIST
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-mono font-bold text-gray-800 dark:text-gray-200">
              Submission Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Received {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
          onClick={() => onDelete?.(submission.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="space-y-5">
        {Object.entries(submission.data).map(([key, value]) => (
          <div key={key} className="p-4 border border-gray-200 dark:border-zinc-800 rounded-md bg-gray-50 dark:bg-zinc-800/50">
            <p className="text-sm font-mono font-medium mb-1 text-gray-500 dark:text-gray-400 uppercase">{key}</p>
            <p className="text-gray-800 dark:text-gray-200">{String(value)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
} 