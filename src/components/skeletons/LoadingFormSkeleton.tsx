import { Skeleton } from "@/components/ui/skeleton";

export function LoadingFormSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full rounded-xl border border-zinc-300 dark:border-zinc-800">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-zinc-300 dark:border-zinc-800 border-t-amber-500 dark:border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-zinc-400 font-medium text-sm">Loading form data...</p>
      </div>
    </div>
  );
}