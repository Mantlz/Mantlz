"use client";



import { InfoIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StripeSettings() {
  return (
    <div className="w-full mx-auto">
      <div className="w-full space-y-4 pr-4">
        <header className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg ">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                Stripe Integration
              </h2>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full border border-amber-200 dark:border-amber-800">
                Coming Soon
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Stripe payment integration for accepting payments through your forms
          </p>
        </header>

        <ScrollArea className="h-[450px] w-full">
          {/* Work in Progress Banner */}
          <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg ">
            <p className="text-sm text-zinc-700 dark:text-zinc-500 mb-3">
              We&apos;re currently working on integrating Stripe payments into our platform. This feature will allow you to:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-500 dark:text-zinc-400 list-disc list-inside">
              <li>Accept payments through your forms</li>
              <li>Manage products and pricing</li>
              <li>Track orders and transactions</li>
            </ul>
            <div className="mt-4 p-3 bg-zinc-100/50 dark:bg-zinc-900/20 rounded-md border border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-700 dark:text-zinc-500 flex items-center gap-2">
                <InfoIcon className="h-4 w-4 shrink-0" />
                This feature is currently under development. Check back soon for updates!
              </p>
            </div>
          </div>


        </ScrollArea>
      </div>
    </div>
  );
}