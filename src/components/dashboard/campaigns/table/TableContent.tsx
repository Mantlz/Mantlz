"use client"

import { useState } from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { ReadonlyURLSearchParams } from "next/navigation"
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Mail, MoreHorizontal, Send, CalendarIcon, Trash2, Eye, CalendarDays, X } from "lucide-react"
import { CampaignResponse } from "./types"
import { formatCampaignStatus } from "./tableUtils"
import { Badge } from "@/components/ui/badge"
import { NoCampaignsView } from "./NoCampaignsView"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { client } from "@/lib/client"
import { toast } from "sonner"
import { ScheduleCampaignDialog } from "./ScheduleCampaignDialog"
import { TestEmailDialog } from "./TestEmailDialog"

interface TableContentProps {
  data: CampaignResponse
  isLoading: boolean
  page: number
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
  }
  searchParams: ReadonlyURLSearchParams
  router: AppRouterInstance
  isPremium: boolean
  userPlan: string
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<CampaignResponse, Error>>
  itemsPerPage: number
  onUpgradeClick?: () => void
}

export function TableContent({
  data,
  isLoading,
  page,
  pagination,
  searchParams,
  router,
  isPremium,
  userPlan,
  refetch,
  itemsPerPage,
  onUpgradeClick,
}: TableContentProps) {
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null)
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<string | null>(null)
  const [showTestEmailDialog, setShowTestEmailDialog] = useState<string | null>(null)
  const pathname = usePathname();
  
  // If there are no campaigns, display empty state
  if (!data.campaigns.length) {
    return <NoCampaignsView isPremium={isPremium} onUpgradeClick={onUpgradeClick} />
  }

  // Handle pagination change
  const handlePaginationChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("page", page.toString())
    router.push(`${pathname}?${newParams.toString()}`)
  }

  // Handle sending a campaign
  const handleSendCampaign = async (campaignId: string) => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }
    try {
      setSendingCampaignId(campaignId)
      await client.campaign.send.$post({ campaignId })
      refetch() // Refresh the data after sending the campaign
    } catch (error) {
      console.error("Error sending campaign:", error)
    } finally {
      setSendingCampaignId(null)
    }
  }

  // Handle deleting a campaign
  const handleDeleteCampaign = async (campaignId: string) => {
    if (!isPremium) {
      onUpgradeClick?.();
      return;
    }
    try {
      setDeletingCampaignId(campaignId)
      await client.campaign.delete.$post({ campaignId })
      toast.success("Campaign deleted successfully")
      refetch()
      // Only close the dialog after successful deletion
      setIsDeleteDialogOpen(null)
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast.error("Failed to delete campaign")
    } finally {
      setDeletingCampaignId(null)
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Campaign List
          </h3>
          <Badge className="ml-2 bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
            {data.campaigns.length} campaigns
          </Badge>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800">
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Campaign Name</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Status</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Created</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Schedule/Sent Date</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Recipients</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.campaigns.map((campaign) => {
              const statusInfo = formatCampaignStatus(campaign.status)
              const isDisabled = campaign.status !== 'DRAFT' || !isPremium
              
              return (
                <TableRow key={campaign.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                        <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">{campaign.name}</div>
                        {campaign.description && (
                          <div className="text-xs  text-gray-500 dark:text-gray-400">
                            {campaign.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <Badge variant="outline" className={`${statusInfo.color}`}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    {campaign.status === 'SCHEDULED' ? (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-purple-500" />
                        <div className="flex flex-col space-y-1">
                          <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
                            {campaign.scheduledAt && formatDistanceToNow(new Date(campaign.scheduledAt), { addSuffix: true })}
                          </div>
                          <div className="text-xs text-purple-500 dark:text-purple-400 flex items-center">
                            <span>
                              {campaign.scheduledAt && `${Math.ceil((new Date(campaign.scheduledAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until post`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : campaign.sentAt ? (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {formatDistanceToNow(new Date(campaign.sentAt), { addSuffix: true })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400">Not sent</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        {campaign._count?.sentEmails || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {campaign.status === 'DRAFT' && (
                        <>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs cursor-pointer gap-1 bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                                disabled={isDisabled}
                                onClick={() => !isPremium && onUpgradeClick?.()}
                              >
                                <Send className="h-3.5 w-3.5" />
                                Send Now
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Send Campaign</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to send this campaign? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleSendCampaign(campaign.id)}
                                  disabled={sendingCampaignId === campaign.id}
                                >
                                  {sendingCampaignId === campaign.id ? "Sending..." : "Send Campaign"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          
                          <ScheduleCampaignDialog
                            campaignId={campaign.id}
                            onScheduled={refetch}
                            isPremium={isPremium}
                            onUpgradeClick={onUpgradeClick}
                            userPlan={userPlan}
                          />
                        </>
                      )}

                      {campaign.status === 'SCHEDULED' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs cursor-pointer gap-1 bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200"
                              disabled={!isPremium}
                              onClick={() => !isPremium && onUpgradeClick?.()}
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancel Schedule
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Scheduled Campaign</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this scheduled campaign? It will be moved back to draft status.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Keep Scheduled</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  try {
                                    await client.campaign.cancelSchedule.$post({ campaignId: campaign.id });
                                    toast.success("Campaign schedule cancelled");
                                    refetch();
                                  } catch (error) {
                                    console.error("Error cancelling schedule:", error);
                                    toast.error("Failed to cancel schedule");
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Cancel Schedule
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[180px] p-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <button
                            className="w-full flex items-center px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                            onClick={() => !isPremium ? onUpgradeClick?.() : setShowTestEmailDialog(campaign.id)}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Test Email
                          </button>
                          <button
                            className="w-full flex items-center px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                            onClick={() => !isPremium ? onUpgradeClick?.() : router.push(`/dashboard/campaigns/${campaign.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <AlertDialog open={isDeleteDialogOpen === campaign.id} onOpenChange={(open) => {
                            if (!deletingCampaignId) {
                              setIsDeleteDialogOpen(open ? campaign.id : null)
                            }
                          }}>
                            <AlertDialogTrigger asChild>
                              <button
                                className="w-full flex items-center px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left text-sm text-red-600 dark:text-red-400 border-t border-zinc-200 dark:border-zinc-800 cursor-pointer"
                                onClick={() => !isPremium && onUpgradeClick?.()}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Delete Campaign</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                  Are you sure you want to delete this campaign? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={deletingCampaignId === campaign.id}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCampaign(campaign.id)}
                                  disabled={deletingCampaignId === campaign.id}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  {deletingCampaignId === campaign.id ? (
                                    <>
                                      <span className="animate-spin mr-2">⏳</span>
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => handlePaginationChange(pagination.currentPage - 1)}
              className="h-8 text-xs bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 cursor-pointer dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => handlePaginationChange(pagination.currentPage + 1)}
              className="h-8 text-xs bg-white hover:bg-zinc-100 text-gray-600 dark:bg-zinc-900 cursor-pointer dark:hover:bg-zinc-800 dark:text-gray-300 border border-zinc-200 dark:border-zinc-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Test Email Dialog */}
      {showTestEmailDialog && (
        <TestEmailDialog
          campaignId={showTestEmailDialog}
          isOpen={true}
          onClose={() => setShowTestEmailDialog(null)}
          onUpgradeClick={onUpgradeClick}
          userPlan={userPlan}
        />
      )}
    </div>
  )
} 