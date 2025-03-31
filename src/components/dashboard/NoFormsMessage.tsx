import { FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NoFormsMessage() {
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="p-8 text-center max-w-md mx-auto bg-gray-50 dark:bg-zinc-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-zinc-700">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 mb-4 border-2 border-gray-300 dark:border-zinc-700">
          <FileSpreadsheet className="h-8 w-8 text-gray-700 dark:text-gray-300" />
        </div>
        <h3 className="text-xl  font-bold mb-2">No Forms Yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't created any forms yet. Create a form to get started.
        </p>
        <Link href="/dashboard/forms/new" passHref>
          <Button className=" bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">
            CREATE FORM
          </Button>
        </Link>
      </div>
    </div>
  );
} 