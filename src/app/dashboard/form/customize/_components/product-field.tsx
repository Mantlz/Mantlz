"use client";

import { useState, useEffect } from "react";
import { 
 // UseQueryResult,
   useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
import { LoaderCircle, Store, Image as ImageIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  //CardDescription,
  //CardHeader,
  //CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { client } from "@/lib/client";
import { FormField, ProductDisplayMode } from "../types";
import { useSubscription } from "@/hooks/useSubscription";
import { JsonValue } from "@prisma/client/runtime/library";

interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image: string | null;
  active: boolean;
  stripeConnectionId: string;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: JsonValue;
}

// Add a new interface for the raw API response
interface StripeProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string }; // This handles Decimal type
  currency: string;
  image: string | null;
  active: boolean;
  stripeConnectionId: string;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: JsonValue;
}

type StripeConnectionResponse = {
  connected: boolean;
  proPlan: boolean;
  message?: string;
  connection?: {
    id: string;
    stripeAccountId: string;
    createdAt: Date;
    lastRefreshedAt: Date | null;
  } | null;
};

type StripeProductsResponse = {
  products: Array<StripeProduct>;
};

interface ProductFieldProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
}

export default function ProductField({ field, onUpdate }: ProductFieldProps) {
  const { userPlan, isLoading: planLoading } = useSubscription();
  const isProUser = userPlan === 'PRO';
  
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    field.productIds || []
  );
  const [displayMode, setDisplayMode] = useState<ProductDisplayMode>(
    field.displayMode || "grid"
  );

  // Get connection status
  const connectionStatus = useQuery<StripeConnectionResponse, Error>({
    queryKey: ["stripeConnectionStatus"],
    queryFn: async () => {
      try {
        const response = await client.stripe.getConnectionStatus.$get();
        const data = await response.json();
        return data as StripeConnectionResponse;
      } catch (error) {
        console.error("Failed to fetch connection status:", error);
        return { connected: false, proPlan: false };
      }
    },
    enabled: isProUser,
  });

  // Get products if connected
  const products = useQuery<StripeProductsResponse, Error>({
    queryKey: ["stripeProducts"],
    queryFn: async () => {
      try {
        const response = await client.stripe.getProducts.$get();
        const data = await response.json();
        return { products: data.products.map((p: StripeProductResponse) => ({
          ...p,
          price: Number(p.price.toString()), // Convert Decimal to number
        })) } as StripeProductsResponse;
      } catch (error) {
        console.error("Failed to fetch products:", error);
        return { products: [] };
      }
    },
    enabled: connectionStatus.data?.connected === true,
  });

  // Update parent when settings change
  useEffect(() => {
    onUpdate({
      ...field,
      productIds: selectedProductIds,
      displayMode,
    });
  }, [selectedProductIds, displayMode, field, onUpdate]);

  // Format price for display
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  // Toggle product selection
  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle display mode change
  const handleDisplayModeChange = (mode: ProductDisplayMode) => {
    setDisplayMode(mode);
  };

  // Loading states
  if (planLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  // Not PRO plan
  if (!isProUser) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>Pro Plan Required</AlertTitle>
        <AlertDescription>
          Stripe product fields are only available on the PRO plan. Please
          upgrade to add this feature to your form.
        </AlertDescription>
      </Alert>
    );
  }

  // Not connected to Stripe
  if (
    !connectionStatus.isLoading &&
    (!connectionStatus.data || !connectionStatus.data.connected)
  ) {
    return (
      <Alert className="mt-4">
        <Store className="h-4 w-4" />
        <AlertTitle>Connect your Stripe Account</AlertTitle>
        <AlertDescription>
          You need to connect your Stripe account to add product fields to your
          form. Go to Settings &gt; Stripe Integration to connect your account.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Display Mode Selector */}
      <div className="mb-4">
        <Label htmlFor="display-mode">Display Mode</Label>
        <Select
          value={displayMode}
          onValueChange={(value) =>
            handleDisplayModeChange(value as ProductDisplayMode)
          }
        >
          <SelectTrigger id="display-mode" className="w-full">
            <SelectValue placeholder="Select display mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid (Default)</SelectItem>
            <SelectItem value="list">List</SelectItem>
            <SelectItem value="single">Single Product</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Selection */}
      {products.isLoading ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : products.data?.products && products.data.products.length > 0 ? (
        <div className="space-y-3">
          <Label>Select Products</Label>
          <ScrollArea className="h-[300px] rounded-md border p-2">
            <div className="space-y-2">
              {products.data.products.map((product) => (
                <Card
                  key={product.id}
                  className={`cursor-pointer transition-all ${
                    selectedProductIds.includes(product.id)
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => toggleProduct(product.id)}
                >
                  <CardContent className="p-3 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {product.image ? (
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm truncate">
                          {product.name}
                        </p>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          {formatPrice(product.price, product.currency)}
                        </Badge>
                      </div>
                      {product.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <Switch
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={() => toggleProduct(product.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-2">
            <p className="text-sm text-gray-500">
              Selected products: {selectedProductIds.length}
            </p>
          </div>
        </div>
      ) : (
        <Alert>
          <Store className="h-4 w-4" />
          <AlertTitle>No Products Available</AlertTitle>
          <AlertDescription>
            You don&apos;t have any products in your connected Stripe account. Add
            products to your Stripe account first, then refresh the product list.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 