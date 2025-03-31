import { Copy, CheckCheck, Calendar, Hash, Database, AlertCircle, ExternalLink, ChevronLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export interface FormSubmission {
  id: string;
  submittedAt: Date;
  data: Record<string, any>;
  location?: {
    lat: number;
    lng: number;
    country?: string;
    city?: string;
  };
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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const copyToClipboard = (key: string, value: any) => {
    navigator.clipboard.writeText(String(value));
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!submission) return;
    
    setIsDeleting(true);
    
    try {
      // Instead of calling API directly, use the callback
      // which will trigger the mutation in the parent component
      onDelete?.(submission.id);
      
      // Show success toast will be handled in the parent
      
    } catch (error) {
      // Error handling will be done by the parent
      console.error("Error triggering delete:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-zinc-900 border-l-4 border-gray-300 dark:border-zinc-700 rounded-sm shadow-md">
        <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded-sm animate-pulse mb-3"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-zinc-800 rounded-sm animate-pulse mb-8"></div>
        <div className="space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-sm animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-sm animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-zinc-800 rounded-sm animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="w-full p-4 sm:p-8 bg-white dark:bg-zinc-900 border-l-4 border-gray-300 dark:border-zinc-700 rounded-sm shadow-lg transition-all duration-300">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="rounded-sm bg-gray-100 dark:bg-zinc-800 p-3 mb-4 shadow-sm">
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-300 tracking-tight">
            No Submission Selected
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Please select a submission from the list to view details
          </p>
          <Button 
            className="text-sm bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-sm shadow-md transition-all duration-200 hover:translate-y-[-1px]"
            onClick={onBack}
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="p-0 bg-white dark:bg-zinc-900 border-0 rounded-sm shadow-lg overflow-hidden transition-all duration-300">
        {/* Header section with gradient background */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 tracking-tight flex flex-wrap items-center gap-2">
                <span>Submission Details</span>
                <Badge className="uppercase text-[10px] bg-gray-200 text-gray-800 dark:bg-zinc-700 dark:text-gray-200  px-2 py-0">
                  ID: {submission.id.slice(0, 8)}
                </Badge>
              </h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 ">
                <Calendar className="h-3.5 w-3.5 mr-1.5 shrink-0" /> 
                <span className="truncate">Received {formatDistanceToNow(submission.submittedAt, { addSuffix: true })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto mt-2 sm:mt-0">
              <Button 
                variant="destructive" 
                size="sm" 
                className="bg-white hover:bg-gray-100 text-red-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-sm transition-all duration-200"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin mr-1.5" />
                ) : (
                  <Trash2 className="h-4 w-4 sm:mr-1.5" />
                )}
                <span className="hidden sm:inline">{isDeleting ? "Deleting..." : "Delete"}</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-4 sm:p-6 space-y-4">
          {Object.entries(submission.data).map(([key, value], index) => (
            <div 
              key={key} 
              className="group p-3 sm:p-5 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-sm shadow-sm hover:shadow transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-zinc-600 rounded-full mr-2 group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-colors duration-200"></div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {key}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-sm"
                    onClick={() => copyToClipboard(key, value)}
                  >
                    {copiedField === key ? (
                      <CheckCheck className="h-3.5 w-3.5 mr-1 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1" />
                    )}
                    <span className="text-xs font-medium">
                      {copiedField === key ? 'Copied!' : 'Copy'}
                    </span>
                  </Button>
                  <Badge 
                    className="text-[10px] bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400 "
                  >
                    {typeof value === 'string' ? `${value.length} chars` : typeof value}
                  </Badge>
                </div>
              </div>
              <div className="h-px w-full bg-gray-100 dark:bg-zinc-800 mb-3"></div>
              <div className="overflow-x-auto">
                <p className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap break-words">
                  {String(value)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <style jsx global>{`
          .grid-bg {
            background-image: radial-gradient(circle, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
            background-size: 24px 24px;
          }
          
          @media (prefers-color-scheme: dark) {
            .grid-bg {
              background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            }
          }
        `}</style>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => !isDeleting && setDeleteDialogOpen(open)}>
        <AlertDialogContent className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100">
              Delete Submission
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this submission? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-gray-200 border border-gray-300 dark:border-zinc-700 rounded-sm"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600 rounded-sm"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 