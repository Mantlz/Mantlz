import { getDocsTocs } from "@/lib/markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import clsx from "clsx";

export default async function Toc({ path }: { path: string }) {
  const tocs = await getDocsTocs(path);

  if (tocs.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:flex toc flex-1 min-w-[250px] max-w-[300px] py-8 sticky top-16 h-[calc(100vh-4rem)]">
      <div className="w-full bg-card/50 backdrop-blur-sm rounded-lg border shadow-sm p-6">
        <h3 className="font-semibold text-base mb-4 pb-2 border-b">On this page</h3>
        <ScrollArea className="h-[calc(100vh-18rem)]">
          <div className="flex flex-col gap-2 text-sm">
            {tocs.map(({ href, level, text }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "py-1.5 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  {
                    "pl-3": level == 2,
                    "pl-6": level == 3,
                    "pl-9": level == 4,
                  }
                )}
              >
                {text}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}