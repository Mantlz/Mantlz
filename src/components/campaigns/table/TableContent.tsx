"use client"

import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Calendar, Eye, ArrowLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { ReadonlyURLSearchParams } from "next/navigation"
import { CampaignCard } from "../CampaignCard"

interface TableContentProps {
  data: any[]
  isLoading: boolean
  page: number
  searchParams: ReadonlyURLSearchParams
  router: any
  itemsPerPage: number
}

export function TableContent({ 
  data, 
  isLoading, 
  page, 
  searchParams, 
  router,
  itemsPerPage
}: TableContentProps) {
  const queryClient = useQueryClient()
  const viewMode = searchParams.get("view") as "grid" | "list" | null;

  const { mutate: sendCampaign, isPending } = useMutation({
    mutationFn: (campaignId: string) => client.campaign.send.$post({ campaignId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })

  const statusConfig = {
    DRAFT: {
      className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    },
    SENDING: {
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    },
    SENT: {
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    }
  }

  // Get total pages - for demonstration, assuming 1 page per 10 items
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  function handlePaginationChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set("page", String(newPage))
    router.push(`?${newParams.toString()}`)
  }

  // If view mode is grid, show campaign cards
  if (viewMode === "grid") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        
        {/* Pagination controls */}
        <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>Page</span>
            <span className="font-medium">{page}</span>
            <span>of</span>
            <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => handlePaginationChange(page - 1)}
              disabled={page <= 1}
            >
              <ArrowLeft className="h-3 w-3" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1 text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => handlePaginationChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default list view
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-zinc-100 dark:border-zinc-800/50">
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 w-[250px]">Campaign Name</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Subject</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Status</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Created</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4">Sent</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 dark:text-gray-400 py-3 sm:py-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((campaign) => (
              <TableRow 
                key={campaign.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 last:border-0"
              >
                <TableCell className="pl-4 sm:pl-6 py-3 font-medium text-gray-900 dark:text-gray-100">{campaign.name}</TableCell>
                <TableCell className="py-3 text-gray-500 dark:text-gray-400">{campaign.subject}</TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline" className={`${statusConfig[campaign.status as keyof typeof statusConfig]?.className}`}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                    <span>{format(new Date(campaign.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-sm text-gray-500 dark:text-gray-400">
                  {campaign.sentAt ? (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                      <span>{format(new Date(campaign.sentAt), 'MMM d, yyyy')}</span>
                    </div>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-right py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs gap-1 rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                    >
                      <Eye className="h-3 w-3" />
                      <span>View</span>
                    </Button>
                    
                    {campaign.status === 'DRAFT' && (
                      <Button 
                        size="sm" 
                        className="h-7 px-2 text-xs gap-1 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-900 dark:hover:bg-zinc-100"
                        onClick={() => sendCampaign(campaign.id)}
                        disabled={isPending}
                      >
                        <Send className="h-3 w-3" />
                        <span>{isPending ? 'Sending...' : 'Send'}</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination controls */}
      <div className="flex justify-between items-center p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Page</span>
          <span className="font-medium">{page}</span>
          <span>of</span>
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => handlePaginationChange(page - 1)}
            disabled={page <= 1}
          >
            <ArrowLeft className="h-3 w-3" />
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-xs border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => handlePaginationChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
} 