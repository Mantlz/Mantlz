import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,

  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { client } from "@/lib/client";
import { cn } from "@/lib/utils";

interface ExportSubmissionsProps {
  formId: string;
}

export function ExportSubmissions({ formId }: ExportSubmissionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const response = await client.forms.export.$post({
        formId,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const result = await response.json();

      // Create a blob from the response
      const blob = new Blob([result.data], { type: result.contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Export completed successfully");
      setIsOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export submissions");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-3",
            "bg-slate-100 dark:bg-zinc-950",
            "px-4 py-2.5",
            "rounded-lg",
            "border border-slate-200 dark:border-zinc-700",
            "shadow-sm hover:shadow-md",
            "transition-shadow duration-200",
            "cursor-pointer",
            "h-[52px]",
            "w-full sm:w-auto"
          )}
        >
          <div className="bg-slate-200 dark:bg-zinc-800 rounded-lg p-1.5">
            <Download className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 tracking-tight">Export</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">Download CSV</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-[600px]">
        <div className="flex flex-col gap-4 sm:gap-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-zinc-100 to-white dark:from-zinc-900 dark:to-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
            <DialogTitle className={cn(
              "text-xl sm:text-2xl lg:text-2xl",
              "font-bold tracking-tight",
              "text-gray-900 dark:text-white"
            )}>
              Export Submissions
            </DialogTitle>
            <DialogDescription className={cn(
              "mt-2",
              "text-xs sm:text-sm lg:text-base",
              "text-gray-600 dark:text-zinc-300"
            )}>
              Export your form submissions as a CSV file
            </DialogDescription>
          </div>

          <div className="px-4 sm:px-5 lg:p-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range (Optional)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Start date"

                  />
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="End date"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "flex justify-end gap-2 sm:gap-3",
            "p-4 sm:p-5 lg:p-6",
            "bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-800/50",
            "border-t border-zinc-200 dark:border-zinc-800"
          )}>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
              className={cn(
                "text-sm sm:text-base",
                "px-4 py-2 sm:px-5 sm:py-2.5",
                "bg-white dark:bg-zinc-900",
                "cursor-pointer",
                "border border-zinc-200 dark:border-zinc-800",
                "text-gray-700 dark:text-gray-300",
                "hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className={cn(
                "text-sm sm:text-base lg:text-lg",
                "px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3",
                "bg-zinc-900 dark:bg-white",
                "cursor-pointer",
                "text-white dark:text-gray-900",
                "hover:bg-zinc-800 dark:hover:bg-zinc-100",
                "shadow-sm"
              )}
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-lg animate-spin" />
                  <span>Exporting...</span>
                </div>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 