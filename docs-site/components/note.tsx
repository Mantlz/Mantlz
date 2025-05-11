import { cn } from "@/lib/utils";
import clsx from "clsx";
import { PropsWithChildren } from "react";

type NoteProps = PropsWithChildren & {
  title?: string;
  type?: "note" | "danger" | "warning" | "success";
};

export default function Note({
  children,
  title = "Note",
  type = "note",
}: NoteProps) {
  const noteClassNames = clsx({
    "dark:bg-zinc-900 dark:bg-gradient-to-tr dark:from-neutral-900 dark:to-neutral-800/70 bg-zinc-100 bg-gradient-to-tr from-neutral-100 to-neutral-50": type == "note",
    "dark:bg-red-950 dark:bg-gradient-to-tr dark:from-red-950 dark:to-red-900/70 bg-red-100 bg-gradient-to-tr from-red-100 to-red-50 border-red-200 dark:border-red-900/50":
      type === "danger",
    "dark:bg-orange-950 dark:bg-gradient-to-tr dark:from-orange-950 dark:to-orange-900/70 bg-orange-100 bg-gradient-to-tr from-orange-100 to-orange-50 border-orange-200 dark:border-orange-900/50":
      type === "warning",
    "dark:bg-green-950 dark:bg-gradient-to-tr dark:from-green-950 dark:to-green-900/70 bg-green-100 bg-gradient-to-tr from-green-100 to-green-50 border-green-200 dark:border-green-900/50":
      type === "success",
  });

  return (
    <div
      className={cn(
        "border rounded-lg py-1.5 px-4 text-sm tracking-wide shadow-sm",
        noteClassNames
      )}
    >
      <p className="font-semibold -mb-3">{title}:</p> {children}
    </div>
  );
}
