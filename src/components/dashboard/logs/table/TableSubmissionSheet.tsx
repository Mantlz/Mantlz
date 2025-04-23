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
  Lock,
  Sparkles,
 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Submission } from "./types"
import { UpgradeModal } from "@/components/modals/UpgradeModal"


import { getUserEmailStatus } from '@/lib/submissionUtils'; // Import the shared function

interface TableSubmissionSheetProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  submission: Submission | null
  onViewFull: () => void
  isPremium?: boolean
}

export function TableSubmissionSheet({ 
  isOpen, 
  setIsOpen, 
  submission, 
  isPremium = false
}: TableSubmissionSheetProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  
  if (!submission) return null
  
  const copyToClipboard = (key: string, value: any) => {
    navigator.clipboard.writeText(String(value))
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }
  
  const handleUpgradeClick = () => {
    setShowUpgradeModal(true)
  }
  
  // Get developer notification status
  const getDeveloperEmailStatus = () => {
    if (!submission.notificationLogs) {
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
  
  // Create safe values with fallbacks
  const userEmailStatus = getUserEmailStatus(submission.notificationLogs);
  
  const developerEmailStatus = getDeveloperEmailStatus();
  const userEmailError = getUserEmailError();
  const developerEmailError = getDeveloperEmailError();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full max-w-md sm:max-w-lg p-0 overflow-y-auto">
          <div className="h-full flex flex-col">
            <SheetHeader className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800/50 sticky top-0 bg-white dark:bg-zinc-950 z-10">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Submission Details
                  {!isPremium && (
                    <Badge variant="outline" className="ml-2 text-[10px] border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                      Limited View
                    </Badge>
                  )}
                </SheetTitle>
                <Badge variant="outline" className="bg-transparent text-xs font-normal">
                  ID: {submission.id.slice(0, 8)}...
                </Badge>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Limited view upgrade banner for non-premium users */}
              {!isPremium && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Lock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">
                        Limited Preview Mode
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                        Upgrade to premium for email tracking and analytics.
                      </p>
                      <Button
                        size="sm"
                        onClick={handleUpgradeClick}
                        className="h-8 bg-gradient-to-r cursor-pointer from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200"
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        <span>Upgrade Now</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Header section with gradient background */}
              <div className="bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800 p-3 sm:p-6 border border-gray-100 dark:border-gray-800/50 rounded-lg">
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

              <div className="space-y-4 sm:space-y-6">
                {/* Email Status Section - Only show complete data for premium */}
                {submission.email && (
                  <div>
                    <div className="flex items-center mb-3">
                      <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email Status
                      </p>
                    </div>
                    <div className="space-y-3">
                      {/* User Email Status - Always visible */}
                      <div className="p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800/50 rounded-lg bg-white dark:bg-zinc-900">
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
                          {isPremium && userEmailError && (
                            <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                              Error: {userEmailError}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Developer Email Status - Premium Only */}
                      {isPremium ? (
                        <div className="p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800/50 rounded-lg bg-white dark:bg-zinc-900">
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
                      ) : (
                        <div className="p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800/50 rounded-lg bg-white dark:bg-zinc-900 opacity-50 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/80 dark:bg-black/80 px-3 py-1 rounded-lg flex items-center gap-1">
                              <Lock className="h-3 w-3 text-amber-500" />
                              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Premium Only</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-2 blur-sm">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3.5 w-3.5 text-gray-500" />
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Developer Email</p>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-2 py-0.5 rounded-lg bg-zinc-100 text-gray-600"
                            >
                              Status
                            </Badge>
                          </div>
                          <div className="space-y-2 blur-sm">
                            <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                              Developer notification details
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Data Section - Limited for non-premium */}
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
                          className="p-3 sm:p-4 border border-gray-100 dark:border-zinc-800/50 rounded-lg bg-white dark:bg-zinc-900"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-gray-300 dark:bg-zinc-600 rounded-lg mr-2"></div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                {key}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-gray-500 cursor-pointer dark:text-gray-400 hover:text-zinc-700 dark:hover:text-gray-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
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
                          <div className="h-px w-full bg-gray-100 dark:bg-zinc-800 mb-3"></div>
                          <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Analytics Section - Premium Only */}
                {submission.data?._meta && (
                  <div>
                    <div className="flex items-center mb-3">
                      <BarChart className="h-3.5 w-3.5 mr-2 text-gray-500" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Analytics
                        {/* Only show premium badge for non-premium users */}
                        {!isPremium && (
                          <Badge variant="outline" className="ml-2 text-[10px] border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                            Premium
                          </Badge>
                        )}
                      </p>
                    </div>
                    {isPremium ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 border border-zinc-100 dark:border-zinc-800/50 rounded-lg bg-white dark:bg-zinc-900">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-3.5 w-3.5 text-gray-500" />
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Browser</p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                            {submission.data._meta.browser || submission.analytics?.browser || 'Unknown'}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 border border-gray-100 dark:border-zinc-800/50 rounded-lg bg-white dark:bg-zinc-900">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-3.5 w-3.5 text-gray-500" />
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Location</p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-900 dark:text-white">
                            {submission.data._meta.country || submission.analytics?.location || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-gray-100 dark:border-gray-800/50 rounded-lg bg-white dark:bg-zinc-900 opacity-75">
                        <div className="text-center">
                          <Lock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Advanced Analytics</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            Unlock detailed submission analytics with our premium plan
                          </p>
                          <Button
                            size="sm"
                            onClick={handleUpgradeClick}
                            className="h-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all duration-200"
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            <span>Upgrade to Premium</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureName="Detailed Submission View"
        description="Unlock all submission details including email tracking, analytics, and complete form data. Get insights into your form performance and user behavior."
      />
    </>
  )
} 