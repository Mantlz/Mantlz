"use client"

import { useState } from "react"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { ReadonlyURLSearchParams } from "next/navigation"
import { 
  Table, 
  TableHeader as UITableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Mail, MoreHorizontal, Send } from "lucide-react"
import { CampaignResponse } from "./types"
import { formatCampaignStatus, sendCampaign } from "./tableUtils"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NoCampaignsView } from "./NoCampaignsView"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"

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
}: TableContentProps) {
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null)
  
  // If there are no campaigns, display empty state
  if (!data.campaigns.length) {
    return <NoCampaignsView />
  }

  // Handle pagination change
  const handlePaginationChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("page", page.toString())
    router.push(`?${newParams.toString()}`)
  }

  // Handle sending a campaign
  const handleSendCampaign = async (campaignId: string) => {
    try {
      setSendingCampaignId(campaignId)
      await sendCampaign(campaignId)
      refetch() // Refresh the data after sending the campaign
    } catch (error) {
      console.error("Error sending campaign:", error)
    } finally {
      setSendingCampaignId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <UITableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </UITableHeader>
          <TableBody>
            {data.campaigns.map((campaign) => {
              const statusInfo = formatCampaignStatus(campaign.status)
              const isDisabled = campaign.status !== 'DRAFT'
              
              return (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                        <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div>{campaign.name}</div>
                        {campaign.description && (
                          <div className="text-xs text-muted-foreground">
                            {campaign.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusInfo.color}`}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {campaign.sentAt 
                      ? new Date(campaign.sentAt).toLocaleDateString() 
                      : "Not sent"}
                  </TableCell>
                  <TableCell>
                    {campaign._count?.sentEmails || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            disabled={isDisabled}
                          >
                            <Send className="h-3.5 w-3.5" />
                            Send
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
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-[180px]">
                          <div className="grid gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}/edit`)}
                              disabled={campaign.status !== 'DRAFT'}
                            >
                              Edit Campaign
                            </Button>
                          </div>
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) handlePaginationChange(page - 1)
                }}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePaginationChange(i + 1)
                  }}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page < pagination.totalPages)
                    handlePaginationChange(page + 1)
                }}
                className={
                  page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
} 