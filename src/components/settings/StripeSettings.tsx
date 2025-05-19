"use client";

import { useEffect } from "react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LoaderCircle, CheckCircle2, XCircle, ExternalLink, RefreshCcw, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
// import Image from "next/image";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { ScrollArea } from "@/components/ui/scroll-area";

// Add client from your trpc setup
import { client } from "@/lib/client";

// Type definitions
interface StripeConnectionStatus {
  connected: boolean;
  proPlan: boolean;
  message?: string;
  connection?: {
    id: string;
    stripeAccountId: string;
    createdAt: Date;
    lastRefreshedAt?: Date;
  };
}

interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image?: string;
  active: boolean;
}

export default function StripeSettings() {
  const router = useRouter();
  // const [isConnecting, setIsConnecting] = useState(false);
  const { userPlan, isLoading: planLoading } = useSubscription();
  const isPro = userPlan === 'PRO';

  // Query connection status
  const connectionStatus: UseQueryResult<StripeConnectionStatus> = useQuery({
    queryKey: ["stripeConnectionStatus"],
    queryFn: async () => {
      console.log('Fetching connection status...');
      const response = await client.stripe.getConnectionStatus.$get();
      console.log('Raw response:', response);
      const data = await response.json();
      console.log('Parsed data:', data);
      return data;
    },
    enabled: isPro,
  });

  // Query Stripe products (only if connected)
  const products: UseQueryResult<{ products: StripeProduct[] }> = useQuery({
    queryKey: ["stripeProducts"],
    queryFn: async () => {
      console.log('Fetching Stripe products...');
      console.log('Connection status:', connectionStatus.data);
      
      const response = await client.stripe.getProducts.$get();
      console.log('Raw products response:', response);
      
      const data = await response.json();
      console.log('Parsed products data:', data);
      
      return data;
    },
    enabled: connectionStatus.data?.connected === true,
  });

  // Add debug log for connection status
  useEffect(() => {
    console.log('Current connection status:', connectionStatus.data);
  }, [connectionStatus.data]);

  // Handle connection status display
  const isConnected = connectionStatus.data?.connected === true;
  console.log('Is connected:', isConnected);

  // Add debug log for products
  useEffect(() => {
    console.log('Current products data:', products.data);
    console.log('Products loading state:', products.isLoading);
    console.log('Products error:', products.error);
  }, [products.data, products.isLoading, products.error]);

  // Connect Stripe account mutation
  // const connectMutation = useMutation({
  //   mutationFn: async () => {
  //     console.log('Starting Stripe connection...');
  //     // Use direct API route for Stripe connection
  //     const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/oauth/callback`;
  //     console.log('Redirect URL:', redirectUrl);
      
  //     const stripeOAuthLink = `${window.location.origin}/api/stripe/connect?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  //     console.log('Stripe OAuth Link:', stripeOAuthLink);
      
  //     return { link: stripeOAuthLink };
  //   },
  //   onSuccess: (data) => {
  //     console.log('Connection success data:', data);
  //     if (data?.link) {
  //       console.log('Opening Stripe OAuth window...');
  //       // Open the Stripe OAuth link in a new window
  //       window.open(data.link, "_blank");
  //       toast.success("Redirecting to Stripe...");
  //     } else {
  //       console.error('Missing link in response:', data);
  //       toast.error("Failed to generate Stripe connect link");
  //     }
  //     setIsConnecting(false);
  //   },
  //   onError: (error) => {
  //     console.error("Error generating connect link:", error);
  //     toast.error("Failed to generate Stripe connect link");
  //     setIsConnecting(false);
  //   },
  // });

  // Disconnect Stripe account mutation
  // const disconnectMutation = useMutation({
  //   mutationFn: async () => {
  //     const response = await client.stripe.disconnectAccount.$post();
  //     return response.json;
  //   },
  //   onSuccess: () => {
  //     toast.success("Stripe account disconnected successfully");
  //     connectionStatus.refetch();
  //   },
  //   onError: (error) => {
  //     toast.error("Failed to disconnect Stripe account");
  //     console.error("Error disconnecting account:", error);
  //   },
  // });

  // Refresh products mutation
  // const refreshProductsMutation = useMutation({
  //   mutationFn: async () => {
  //     const response = await client.stripe.getProducts.$get();
  //     return response.json;
  //   },
  //   onSuccess: () => {
  //     toast.success("Products refreshed successfully");
  //     products.refetch();
  //   },
  //   onError: (error) => {
  //     toast.error("Failed to refresh products");
  //     console.error("Error refreshing products:", error);
  //   },
  // });

  // Handle connect button click
  // const handleConnect = () => {
  //   console.log('Connect button clicked');
  //   setIsConnecting(true);
  //   connectMutation.mutate();
  // };

  // Handle disconnect button click
  // const handleDisconnect = () => {
  //   if (window.confirm("Are you sure you want to disconnect your Stripe account? This will prevent any forms using Stripe payments from working.")) {
  //     disconnectMutation.mutate();
  //   }
  // };

  // Check URL for success/error params
  useEffect(() => {
    const url = new URL(window.location.href);
    const success = url.searchParams.get("success");
    const error = url.searchParams.get("error");

    if (success) {
      toast.success("Stripe account connected successfully!");
      // Remove the query params from URL
      router.replace(window.location.pathname);
      connectionStatus.refetch();
    } else if (error) {
      toast.error(`Failed to connect Stripe account: ${error}`);
      router.replace(window.location.pathname);
    }
  }, [router, connectionStatus]);

  // For displaying currency formatted prices
  // const formatPrice = (price: number, currency: string) => {
  //   return new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: currency,
  //   }).format(price);
  // };

  // Loading states
  if (planLoading || connectionStatus.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] w-full">
        <LoaderCircle className="h-6 w-6 text-zinc-400 animate-spin" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Loading Stripe connection information...
        </p>
      </div>
    );
  }

  // Not PRO plan
  if (!isPro) {
    return (
      <div className="h-full flex flex-col">
        <ScrollArea className="h-[550px] w-full">
          <div className="mb-6 p-5 border-2 border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
                Stripe Integration
              </h3>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                Coming Soon
              </span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              We're currently working on integrating Stripe payments into our platform. This feature will allow you to:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-amber-600 dark:text-amber-400 list-disc list-inside">
              <li>Accept payments through your forms</li>
              <li>Manage products and pricing</li>
              <li>Track orders and transactions</li>
            </ul>
            <div className="mt-4 p-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <InfoIcon className="h-4 w-4 shrink-0" />
                This feature is currently under development and will be available to all users once completed.
              </p>
            </div>
          </div>
          
          
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="h-[550px] w-full">
        {/* Work in Progress Banner */}
        <div className="mb-6 p-5 border-2 border-amber-200 dark:border-amber-800 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200">
              Stripe Integration
            </h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            We're currently working on integrating Stripe payments into our platform. This feature will allow you to:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-600 dark:text-amber-400 list-disc list-inside">
            <li>Accept payments through your forms</li>
            <li>Manage products and pricing</li>
            <li>Track orders and transactions</li>
          </ul>
          <div className="mt-4 p-3 bg-amber-100/50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <InfoIcon className="h-4 w-4 shrink-0" />
              This feature is currently under development. Check back soon for updates!
            </p>
          </div>
        </div>

        {/* Main Content - Disabled */}
        <div className="space-y-6 opacity-50 pointer-events-none select-none">
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-base font-medium text-zinc-900 dark:text-white mb-4">Connection Status</h3>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status:</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                <XCircle className="w-3.5 h-3.5 mr-1" /> Not Available
              </Badge>
            </div>
            <div className="flex justify-end">
              <Button 
                disabled
                size="sm"
                className="bg-zinc-100 text-zinc-400 cursor-not-allowed"
              >
                Connect Stripe Account
              </Button>
            </div>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium text-zinc-900 dark:text-white">Your Products</h3>
              <Button 
                variant="outline" 
                size="sm" 
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="text-center py-8 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/70">
              <h3 className="font-medium text-zinc-400 dark:text-zinc-500 mb-2">Feature Not Available</h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4 max-w-md mx-auto">
                Product management will be available once Stripe integration is complete.
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 