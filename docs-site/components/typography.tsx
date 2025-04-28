import { PropsWithChildren } from "react";

export function Typography({ children }: PropsWithChildren) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-code:font-code 
      dark:prose-code:bg-zinc-900 dark:prose-pre:bg-zinc-900 dark:prose-code:text-white 
      prose-code:bg-zinc-100 prose-pre:bg-zinc-100 prose-code:text-neutral-800 
      prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto
      prose-code:text-sm prose-code:leading-6
      prose-code:p-1 prose-code:rounded-lg prose-pre:border 
      prose-pre:overflow-x-auto
      pt-2 prose-code:before:content-none prose-code:after:content-none 
      !min-w-full prose-img:rounded-lg prose-img:border">
      {children}
    </div>
  );
}