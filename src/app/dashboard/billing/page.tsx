"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { client } from "@/lib/client";

// Invoice type definition
interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  pdf: string | null;
  hostedUrl: string | null;
}

interface InvoiceResponse {
  invoices: Invoice[];
  error?: string;
}

// Create custom hook for invoice data
const useInvoices = () => {
  return useQuery<Invoice[]>({
    queryKey: ["userInvoices"],
    queryFn: async () => {
      try {
        const response = await client.payment.getInvoices.$post();
        const data = await response.json() as InvoiceResponse;
        if (data.error) {
          throw new Error(data.error);
        }
        return data.invoices;
      } catch (error) {
        console.error("Error fetching invoices:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

export default function BillingHistoryPage() {
  const { data: invoices, isLoading, error } = useInvoices();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Loading billing history...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <p className="mt-2 text-sm text-zinc-800 dark:text-zinc-300">
          Could not load your billing history.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Billing History
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              View and download your complete billing history
            </p>
          </div>
        </div>

        {/* Invoices List */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-background dark:bg-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-900 dark:text-white text-sm">
              All Invoices
            </CardTitle>
            <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
              Your complete invoice history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full">
              {invoices && invoices.length > 0 ? (
                <div className="space-y-2">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          Invoice #{invoice.number}
                        </span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                          {new Date(invoice.created * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </span>
                        <Badge
                          className={cn(
                            "text-xs",
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          )}
                        >
                          {invoice.status.toUpperCase()}
                        </Badge>
                        <div className="flex space-x-2">
                          {invoice.pdf && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => invoice.pdf && window.open(invoice.pdf, "_blank")}
                            >
                              <Download className="h-3.5 w-3.5 mr-1.5" />
                              Download PDF
                            </Button>
                          )}
                          {invoice.hostedUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() => invoice.hostedUrl && window.open(invoice.hostedUrl, "_blank")}
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                              View Online
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-zinc-600 dark:text-zinc-400">
                  No invoices found
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 