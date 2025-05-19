"use client";

import { useState, useEffect } from "react";
import { UseQueryResult, useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LoaderCircle, CheckCircle2, XCircle, ExternalLink, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const [isConnecting, setIsConnecting] = useState(false);
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
  const connectMutation = useMutation({
    mutationFn: async () => {
      console.log('Starting Stripe connection...');
      // Use direct API route for Stripe connection
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/oauth/callback`;
      console.log('Redirect URL:', redirectUrl);
      
      const stripeOAuthLink = `${window.location.origin}/api/stripe/connect?redirectUrl=${encodeURIComponent(redirectUrl)}`;
      console.log('Stripe OAuth Link:', stripeOAuthLink);
      
      return { link: stripeOAuthLink };
    },
    onSuccess: (data) => {
      console.log('Connection success data:', data);
      if (data?.link) {
        console.log('Opening Stripe OAuth window...');
        // Open the Stripe OAuth link in a new window
        window.open(data.link, "_blank");
        toast.success("Redirecting to Stripe...");
      } else {
        console.error('Missing link in response:', data);
        toast.error("Failed to generate Stripe connect link");
      }
      setIsConnecting(false);
    },
    onError: (error) => {
      console.error("Error generating connect link:", error);
      toast.error("Failed to generate Stripe connect link");
      setIsConnecting(false);
    },
  });

  // Disconnect Stripe account mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const response = await client.stripe.disconnectAccount.$post();
      return response.json;
    },
    onSuccess: () => {
      toast.success("Stripe account disconnected successfully");
      connectionStatus.refetch();
    },
    onError: (error) => {
      toast.error("Failed to disconnect Stripe account");
      console.error("Error disconnecting account:", error);
    },
  });

  // Refresh products mutation
  const refreshProductsMutation = useMutation({
    mutationFn: async () => {
      const response = await client.stripe.getProducts.$get();
      return response.json;
    },
    onSuccess: () => {
      toast.success("Products refreshed successfully");
      products.refetch();
    },
    onError: (error) => {
      toast.error("Failed to refresh products");
      console.error("Error refreshing products:", error);
    },
  });

  // Handle connect button click
  const handleConnect = () => {
    console.log('Connect button clicked');
    setIsConnecting(true);
    connectMutation.mutate();
  };

  // Handle disconnect button click
  const handleDisconnect = () => {
    if (window.confirm("Are you sure you want to disconnect your Stripe account? This will prevent any forms using Stripe payments from working.")) {
      disconnectMutation.mutate();
    }
  };

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
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

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
          <div className="mb-6 p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
              Stripe Connect
            </h3>
            <div className="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-700 mb-3"></div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Connect your Stripe account to add product checkouts to your forms.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
              <Alert variant="destructive">
                <AlertTitle>Pro Plan Required</AlertTitle>
                <AlertDescription>
                  Stripe Connect is only available on the PRO plan. Please upgrade to access this feature.
                </AlertDescription>
              </Alert>
              
              <Button 
                className="mt-4" 
                variant="default" 
                onClick={() => router.push("/dashboard/forms/settings?tab=billing")}>
                Upgrade to PRO
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="h-[550px] w-full">
        <div className="mb-6 p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
            Stripe Connect
          </h3>
          <div className="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-700 mb-3"></div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Connect your Stripe account to add product checkouts to your forms.
          </p>
        </div>

        <div className="space-y-6 pb-6">
          {/* Connection Status Card */}
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-base font-medium text-zinc-900 dark:text-white mb-4">Connection Status</h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status:</span>
              {isConnected ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Not Connected
                </Badge>
              )}
            </div>

            {connectionStatus.data?.connected && connectionStatus.data.connection && (
              <div className="space-y-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-md mb-4">
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Account ID:</span>
                  <code className="text-xs px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                    {connectionStatus.data.connection.stripeAccountId}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Connected Since:</span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    {new Date(connectionStatus.data.connection.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {connectionStatus.data.connection.lastRefreshedAt && (
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Last Refreshed:</span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {new Date(connectionStatus.data.connection.lastRefreshedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              {!isConnected ? (
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting || connectMutation.isPending}
                  size="sm"
                >
                  {connectMutation.isPending && <LoaderCircle className="animate-spin h-4 w-4 mr-2" />}
                  Connect Stripe Account
                </Button>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={handleDisconnect}
                  disabled={disconnectMutation.isPending}
                  size="sm"
                >
                  {disconnectMutation.isPending && <LoaderCircle className="animate-spin h-4 w-4 mr-2" />}
                  Disconnect
                </Button>
              )}
            </div>
          </div>

          {/* Products Section */}
          {isConnected && (
            <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-zinc-900 dark:text-white">Your Products</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refreshProductsMutation.mutate()}
                  disabled={refreshProductsMutation.isPending}
                >
                  {refreshProductsMutation.isPending ? (
                    <LoaderCircle className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <RefreshCcw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Products from your Stripe account that can be used in forms
              </p>
              
              {products.isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <LoaderCircle className="animate-spin h-6 w-6 text-zinc-500" />
                </div>
              ) : products.data?.products && products.data.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.data.products.map((product) => (
                    <div key={product.id} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col">
                      <div className="flex items-start gap-3">
                        {product.image ? (
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                            <span className="text-zinc-400 text-xs">No image</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{product.name}</h4>
                          {product.description && (
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-2 flex justify-between items-center">
                            <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                              {formatPrice(product.price, product.currency)}
                            </span>
                            {!product.active && (
                              <Badge variant="secondary" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/70">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">No products found</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-md mx-auto">
                    You don't have any products in your Stripe account yet. Add products in Stripe to display them here.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://dashboard.stripe.com/products", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Add Products in Stripe
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Help Guide */}
          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <h3 className="text-base font-medium text-zinc-900 dark:text-white mb-4">How It Works</h3>
            <ol className="space-y-2 ml-5 list-decimal text-sm text-zinc-700 dark:text-zinc-300">
              <li className="pl-1">Connect your Stripe account using the button above</li>
              <li className="pl-1">Create a form with the "Order" type or add a product field to any form</li>
              <li className="pl-1">Select products from your Stripe account to display in the form</li>
              <li className="pl-1">When users submit the form, they'll be able to purchase the selected products</li>
            </ol>
            <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-md">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-purple-500 mr-2"></span>
                <span>This feature is only available on the PRO plan</span>
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
} 