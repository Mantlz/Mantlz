"use client";



import { InfoIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StripeSettings() {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="h-[550px] w-full">
        {/* Work in Progress Banner */}
        <div className="mb-6 p-5 border-2 border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Stripe Integration
            </h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            We&apos;re currently working on integrating Stripe payments into our platform. This feature will allow you to:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
            <li>Accept payments through your forms</li>
            <li>Manage products and pricing</li>
            <li>Track orders and transactions</li>
          </ul>
          <div className="mt-4 p-3 bg-zinc-100/50 dark:bg-zinc-900/20 rounded-md border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <InfoIcon className="h-4 w-4 shrink-0" />
              This feature is currently under development. Check back soon for updates!
            </p>
          </div>
        </div>


        

          

        
      </ScrollArea>
    </div>
  );
}