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
  Eye,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Submission } from "./types"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  onNavigate 
}: SubmissionDetailsSheetProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  
  if (!submission) return null
  
  const copyToClipboard = (key: string, value: any) => {
    navigator.clipboard.writeText(String(value))
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }
  
  // Get the email statuses
  const getUserEmailStatus = () => {
    if (!submission.email) return null;
    
    // Check for sent email confirmation
    if (submission.notificationLogs?.some(log => 
      log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SENT'
    )) {
      return {
        type: 'SENT',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        text: 'Email Sent'
      };
    }
    
    // Check for failed email
    if (submission.notificationLogs?.some(log => 
      log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'FAILED'
    )) {
      return {
        type: 'FAILED',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        text: 'Failed'
      };
    }
    
    // Check for skipped email
    if (submission.notificationLogs?.some(log => 
      log.type === 'SUBMISSION_CONFIRMATION' && log.status === 'SKIPPED'
    )) {
      return {
        type: 'SKIPPED',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        text: 'Skipped'
      };
    }
    
    // Default to pending
    return {
      type: 'PENDING',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      text: 'Pending'
    };
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
  const userEmailStatus = getUserEmailStatus() || {
    type: 'PENDING',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    text: 'Pending'
  };
  
  const developerEmailStatus = getDeveloperEmailStatus();
  const userEmailError = getUserEmailError();
  const developerEmailError = getDeveloperEmailError();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full max-w-md sm:max-w-lg p-0 overflow-y-auto">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800/50 sticky top-0 bg-white dark:bg-zinc-950 z-10">
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
              {/* Top Section: Status and Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    submission.status === 'read' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${
                    submission.status === 'read' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {submission.status === 'read' ? 'Read' : 'Unread'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    // onClick={() => markAsRead(submission.id)} // TODO: Implement mark as read
                    disabled={submission.status === 'read'}
                    className="h-8 text-xs bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-full transition-all duration-200"
                  >
                    {submission.status === 'read' ? <Check className="mr-1.5 h-3 w-3" /> : <Eye className="mr-1.5 h-3 w-3" />}
                    {submission.status === 'read' ? 'Marked as Read' : 'Mark Read'}
                  </Button>
                </div>
              </div>
              <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 mb-3"></div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Metadata</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Additional submission details</p>
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
                    <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-500" />
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">User Email</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md",
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
                          <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                            Error: {userEmailError}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Developer Email Status */}
                    <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bell className="h-3.5 w-3.5 text-gray-500" />
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Developer Email</p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md",
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
                          <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                            Error: {developerEmailError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Data Section */}
              {submission.data && (
                <div>
                  <div className="flex items-center mb-3">
                    <File className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Form Data
                    </p>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(submission.data)
                      .filter(([key]) => key !== '_meta')
                      .map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {key}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-gray-500 cursor-pointer dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
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
                        </div>
                        <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-3"></div>
                        <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">
                          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Section */}
              {submission.data?._meta && (
                <div>
                  <div className="flex items-center mb-3">
                    <BarChart className="h-3.5 w-3.5 mr-2 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Analytics
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-3.5 w-3.5 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Browser</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                        {submission.data._meta.browser || 'Unknown'}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 border border-gray-100 dark:border-gray-800/50 rounded-xl bg-white dark:bg-zinc-900">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-3.5 w-3.5 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</p>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                        {submission.data._meta.country || 'Unknown'}
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