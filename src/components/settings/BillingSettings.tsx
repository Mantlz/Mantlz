"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  Download,
  FileText
} from "lucide-react";
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
import { useSubscription } from "@/hooks/useSubscription";
import { useLoading } from "@/contexts/LoadingContext";

// Type definitions for subscription data
interface SubscriptionData {
  id?: string;
  status?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  cancelAt?: string | null;
  trialEnd?: string | null;
  price?: {
    amount?: number;
    currency?: string;
    interval?: string;
  };
  usage?: {
    formsUsed?: number;
    formsLimit?: number;
    submissionsUsed?: number;
    submissionsLimit?: number;
  };
}

// Type definition for portal session response
interface PortalSessionResponse {
  url: string;
  error?: string;
}

// Add invoice type definition
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

// Create portal session mutation hook
const useCreatePortalSession = () => {
  return useMutation<PortalSessionResponse>({
    mutationFn: async () => {
      try {
        const response = await client.payment.createPortalSession.$post();
        const data = await response.json() as PortalSessionResponse;
        
        if (!data.url) {
          throw new Error('Portal URL not found in response');
        }
        
        return data;
      } catch (error) {
        console.error('Portal session creation error:', error);
        throw error;
      }
    },
  });
};

// Add invoice query hook
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

// Plan badge component
type PlanBadgeProps = {
  plan: string | undefined;
};

const PlanBadge: React.FC<PlanBadgeProps> = ({ plan }) => {
  const badgeStyles = {
    FREE: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    STANDARD: "bg-zinc-100 text-blue-800 dark:bg-zinc-900 dark:text-blue-200",
    PRO: "bg-orange-100 text-orange-800 dark:bg-amber-700 dark:text-orange-200",
  }[plan?.toUpperCase() || 'FREE'] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";

  return (
    <Badge className={cn("ml-2 font-medium", badgeStyles)}>
      {plan ? plan.toUpperCase() : "FREE"}
    </Badge>
  );
};

// Status badge component
type StatusBadgeProps = {
  status: string | undefined;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-zinc-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200";
    
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "past_due":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "trialing":
        return "bg-zinc-100 text-blue-800 dark:bg-zinc-900 dark:text-blue-200";
      default:
        return "bg-zinc-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-200";
    }
  };

  return (
    <Badge className={cn("font-medium", getStatusColor(status))}>
      {status ? status.replace(/_/g, " ").toUpperCase() : "UNKNOWN"}
    </Badge>
  );
};

export default function BillingSettings() {
  const { userPlan } = useSubscription();
  const { setIsLoading, setLoadingMessage, renderSkeleton } = useLoading();
  const { data: usageData, isLoading: isLoadingUsage } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const response = await client.usage.getUsage.$get();
      return response.json();
    }
  });

  // Set global loading state
  useEffect(() => {
    if (isLoadingUsage) {
      setLoadingMessage('Loading subscription information...');
    }
    setIsLoading(isLoadingUsage);
  }, [isLoadingUsage, setIsLoading, setLoadingMessage]);

  const subscriptionData: SubscriptionData = {
    status: "active",
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
    cancelAt: null,
    trialEnd: null,
    price: {
      amount: userPlan === "PRO" ? 1500 : userPlan === "STANDARD" ? 800 : 0,
      currency: "usd",
      interval: "month"
    },
    usage: {
      formsUsed: usageData?.usage?.forms?.used || 0,
      formsLimit: usageData?.usage?.forms?.limit || 0,
      submissionsUsed: usageData?.usage?.submissions?.used || 0,
      submissionsLimit: usageData?.usage?.submissions?.limit || 0
    }
  };

  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices();
  const createPortalSession = useCreatePortalSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsRedirecting(true);
      const response = await createPortalSession.mutateAsync();
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      
      // Check if the error is due to no active subscription
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('No active subscription found')) {
        toast.error("No active subscription", {
          description: "You don't have an active subscription to manage."
        });
      } else {
        // Show error toast with more specific error message
        toast.error("Failed to open subscription portal", {
          description: errorMessage || "Please try again later or contact support."
        });
      }
    } finally {
      setIsRedirecting(false);
    }
  };

  const formatCurrency = (amount: number | undefined, currency: string | undefined) => {
    if (amount === undefined || currency === undefined) {
      return "N/A";
    }
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  // Create a renderContent function to handle conditional rendering
  const renderContent = () => {
    // Create a common header component that's always visible
    const headerContent = (
      <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg ">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              Subscription Information
            </h2>
            <PlanBadge plan={userPlan} />
          </div>
          <Button 
            onClick={handleManageSubscription} 
            disabled={isRedirecting}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <ExternalLink className="h-3 w-3 mr-1" />
                Manage Subscription
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Manage your subscription and billing information
        </p>
      </header>
    );

    if (isLoadingUsage) {
      return (
        <div className="w-full max-w-5xl mx-auto">
          <ScrollArea className="h-[550px] w-full">
            <div className="w-full space-y-4 pr-4">
              {headerContent}
              {renderSkeleton('card', 2)}
            </div>
          </ScrollArea>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto">
        <ScrollArea className="h-[550px] w-full">
          <div className="w-full space-y-4 pr-4">
            {headerContent}

            {/* Current Plan Card */}
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <div className="space-y-4">
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Price</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {subscriptionData?.price 
                        ? `${formatCurrency(subscriptionData.price.amount, subscriptionData.price.currency)}/${subscriptionData.price.interval}`
                        : "Free"}
                    </p>
                  </div>
                  
                  {/* Plan Features */}
                  <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">Plan Features</p>
                    <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                      {userPlan === "PRO" && (
                        <>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Unlimited forms</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Unlimited submissions</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Advanced analytics & reporting</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Custom branding</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Priority support</span>
                          </li>
                        </>
                      )}
                      {userPlan === "STANDARD" && (
                        <>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Advanced form builder</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Custom form themes</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Advanced analytics</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Email notifications</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Priority support</span>
                          </li>
                        </>
                      )}
                      {(!userPlan || userPlan === "FREE") && (
                        <>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Basic form builder</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Up to 100 submissions per month</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Basic analytics</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                            <span>Community support</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Section */}
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-none">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-zinc-900 dark:text-white text-sm flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                      Recent Invoices
                    </CardTitle>
                    <CardDescription className="text-zinc-600 dark:text-zinc-400 text-xs">
                      View and download your recent invoices
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => window.location.href = '/dashboard/billing'}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                {isLoadingInvoices ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
                    <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">Loading invoices...</span>
                  </div>
                ) : invoices && invoices.length > 0 ? (
                  <div className="space-y-2">
                    {invoices.slice(0, 3).map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">
                            Invoice #{invoice.number}
                          </span>
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">
                            {new Date(invoice.created * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">
                            {formatCurrency(invoice.amount, invoice.currency)}
                          </span>
                          <StatusBadge status={invoice.status} />
                          <div className="flex space-x-1">
                            {invoice.pdf && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => invoice.pdf && window.open(invoice.pdf, "_blank")}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {invoice.hostedUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => invoice.hostedUrl && window.open(invoice.hostedUrl, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    No invoices found
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Free Plan Upgrade Message */}
            {(!userPlan || userPlan === "FREE") && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 dark:bg-amber-900/30 dark:border-amber-800/30 dark:text-amber-400 text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>You are on a free plan. Consider upgrading for more features.</span>
                </div>
                <Button 
                  onClick={() => window.location.href = '/pricing'} 
                  variant="link"
                  size="sm"
                  className="h-6 text-xs p-0 text-zinc-950 dark:text-zinc-200 hover:underline"
                >
                  View Plans
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  // Return the renderContent result instead of conditional rendering
  return renderContent();
}