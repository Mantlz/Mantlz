"use client";

import { EachRoute } from "@/lib/routes-config";
import Anchor from "./anchor";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SubLink({
  title,
  href,
  items,
  noLink,
  level,
  isSheet,
}: EachRoute & { level: number; isSheet: boolean }) {
  const [isOpen, setIsOpen] = useState(level == 0);

  const Comp = (
    <Anchor activeClassName="text-primary font-medium" href={href} className="hover:translate-x-0.5 transition-transform duration-200">
      {title}
    </Anchor>
  );

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h4 className="font-medium sm:text-sm">{title}</h4>
  );

  if (!items) {
    return <div className="flex flex-col">{titleOrLink}</div>;
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center gap-2 group">
          {titleOrLink}
          <CollapsibleTrigger asChild>
            <Button
              className="ml-auto mr-3.5 h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors duration-200"
              variant="link"
              size="icon"
            >
              {!isOpen ? (
                <ChevronRight className="h-[0.9rem] w-[0.9rem] transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-[0.9rem] w-[0.9rem] transition-transform duration-200" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="transition-all duration-200">
          <div
            className={cn(
              "flex flex-col items-start sm:text-sm dark:text-neutral-300/85 text-neutral-800 ml-0.5 mt-2.5 gap-3",
              level > 0 && "pl-4 border-l ml-1 border-border/60"
            )}
          >
            {items?.map((innerLink) => {
              const modifiedItems = {
                ...innerLink,
                href: `${href + innerLink.href}`,
                level: level + 1,
                isSheet,
              };
              return <SubLink key={modifiedItems.href} {...modifiedItems} />;
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
