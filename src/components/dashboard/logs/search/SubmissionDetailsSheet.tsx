"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Calendar, 
  Copy, 
  CheckCheck, 
  BarChart, 
  Globe, 
  MapPin, 
  Bell,
  File,
  Download,
  FileIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Submission } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getUserEmailStatus } from '@/lib/submissionUtils'

// Add a type definition for the submission data
interface SubmissionData {
  _meta?: {
    browser?: string;
    country?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface SubmissionDetailsSheetProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  submission: Submission | null
  onNavigate: () => void
}

export function SubmissionDetailsSheet({ 
  isOpen, 
  setIsOpen, 
  submission, 
}: SubmissionDetailsSheetProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  
  if (!submission) return null
  
  const copyToClipboard = (key: string, value: unknown) => {
    navigator.clipboard.writeText(String(value))
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }
  
  // Get developer notification status
  const getDeveloperEmailStatus = () => {
    // Default to pending if no notification logs
    if (!submission.notificationLogs || submission.notificationLogs.length === 0) {
      return {
        type: 'PENDING', 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        text: 'Pending'
      };
    }
    
    // Check for sent dev notification
    if (submission.notificationLogs.some(log => 
      log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'SENT'
    )) {
      return {
        type: 'SENT',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        text: 'Sent'
      };
    }
    
    // Check for failed notification
    if (submission.notificationLogs.some(log => 
      log.type === 'DEVELOPER_NOTIFICATION' && log.status === 'FAILED'
    )) {
      return {
        type: 'FAILED',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        text: 'Failed'
      };
    }
    
    // Default to pending
    return {
      type: 'PENDING',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      text: 'Pending'
    };
  }
  
  // Get error messages
  const getUserEmailError = () => {
    const errorLog = submission.notificationLogs?.find(log => 
      log.type === 'SUBMISSION_CONFIRMATION' && log.error
    );
    return errorLog?.error || null;
  }
  
  const getDeveloperEmailError = () => {
    const errorLog = submission.notificationLogs?.find(log => 
      log.type === 'DEVELOPER_NOTIFICATION' && log.error
    );
    return errorLog?.error || null;
  }
  
  // Safe access to email statuses with fallbacks
  const userEmailStatus = getUserEmailStatus(submission.notificationLogs);
  
  const developerEmailStatus = getDeveloperEmailStatus();
  const userEmailError = getUserEmailError();
  const developerEmailError = getDeveloperEmailError();

  // Add helper functions for file handling
  const isFileUrl = (value: string | null | undefined): boolean => {
    if (!value) return false;
    return value.startsWith('https://ucarecdn.com/') || value.startsWith('http');
  }

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1] || 'Download';
    } catch {
      return 'Download';
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-md sm:max-w-lg p-0 overflow-y-auto">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800/50 sticky top-0 bg-white dark:bg-zinc-950 z-10">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Submission Details
              </SheetTitle>
              <Badge variant="outline" className="bg-transparent text-xs font-normal">
                ID: {submission.id.slice(0, 8)}...
              </Badge>
            </div>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)]"> 
            <div className="p-4 sm:p-6 space-y-6">
              
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-3 sm:p-6 border border-zinc-200 dark:border-zinc-800/50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
                      <span>Submission #{submission.id.slice(0, 8)}</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] ",
                          userEmailStatus.color
                        )}
                      >
                        {userEmailStatus.type === 'SENT' ? "Email Sent" : "No Email Sent"}
                      </Badge>
                    </h2>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      <span>
                        Received{" "}
                        {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs bg-white cursor-pointer hover:bg-zinc-200 text-gray-600 dark:bg-zinc-950 dark:hover:bg-zinc-700 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                      onClick={() => copyToClipboard("id", submission.id)}
                    >
                      {copiedField === "id" ? (
                        <CheckCheck className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      <span className="text-xs">
                        {copiedField === "id" ? "Copied!" : "Copy ID"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            

              {/* Email Status Section */}
              {submission.email && (
                <div>
                  <div className="flex items-center mb-3">
                    <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email Status
                    </p>
                  </div>
                  <div className="space-y-3">
                    {/* User Email Status */}
                    <div className="p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-500" />
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">User Email</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-lg",
                            userEmailStatus.color
                          )}
                        >
                          {userEmailStatus.text}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                          {submission.email}
                        </p>
                        {userEmailError && (
                          <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                            Error: {userEmailError}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Developer Email Status */}
                    <div className="p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bell className="h-3.5 w-3.5 text-gray-500" />
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Developer Email</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-lg",
                            developerEmailStatus.color
                          )}
                        >
                          {developerEmailStatus.text}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                          Developer notifications are {developerEmailStatus.type === 'SENT' ? 'enabled' : 'disabled'}
                        </p>
                        {developerEmailError && (
                          <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                            Error: {developerEmailError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {submission.data && (
                <div>
                  <div className="flex items-center mb-3">
                    <File className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Form Data
                    </p>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(submission.data as SubmissionData)
                      .filter(([key]) => key !== '_meta')
                      .map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {typeof value === 'string' && isFileUrl(value) ? (
                              <FileIcon className="h-3.5 w-3.5 text-gray-500" />
                            ) : (
                              <div className="w-2 h-2 bg-zinc-300 dark:bg-zinc-600 rounded-lg"></div>
                            )}
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {key}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {typeof value === 'string' && isFileUrl(value) ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-gray-500 cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                onClick={() => window.open(value, '_blank')}
                              >
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                <span className="text-xs font-medium">Download</span>
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-gray-500 cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                                onClick={() => copyToClipboard(key, value)}
                              >
                                {copiedField === key ? (
                                  <CheckCheck className="h-3.5 w-3.5 mr-1 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5 mr-1" />
                                )}
                                <span className="text-xs font-medium">
                                  {copiedField === key ? "Copied!" : "Copy"}
                                </span>
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 mb-3"></div>
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">
                          {typeof value === 'string' && isFileUrl(value) ? (
                            <span className="text-blue-500 dark:text-blue-400">{getFileNameFromUrl(value)}</span>
                          ) : (
                            typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Section */}
              {submission.data && (submission.data as SubmissionData)._meta && (
                <div>
                  <div className="flex items-center mb-3">
                    <BarChart className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Analytics
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-3.5 w-3.5 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Browser</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                        {(submission.data as SubmissionData)._meta?.browser || 'Unknown'}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                        {(submission.data as SubmissionData)._meta?.country || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
} 