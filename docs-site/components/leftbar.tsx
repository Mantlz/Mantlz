import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { AlignLeftIcon } from "lucide-react";
import DocsMenu from "./docs-menu";
import Link from "next/link";

export function Leftbar() {
  return (
    <aside className="md:flex hidden flex-[1] min-w-[230px] sticky top-16 flex-col h-[94.5vh] overflow-y-auto border-r border-border/40">
      <ScrollArea className="py-2 px-1">
        <DocsMenu />
      </ScrollArea>
    </aside>
  );
}

export function SheetLeftbar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden flex">
          <AlignLeftIcon className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 px-0 border-r border-border/50" side="left">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetHeader>
          <h2 className="font-extrabold text-start px-8">Menu</h2>
        </SheetHeader>
        <div className="px-8 pb-4">
          <Link
            href="https://mantlz.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 px-3 py-2 rounded-lg border border-amber-500/20 text-sm font-medium transition-colors justify-center"
          >
            Dashboard
          </Link>
        </div>
        <ScrollArea className="flex flex-col gap-4">
          <div className="mx-2 px-5">
            <DocsMenu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
