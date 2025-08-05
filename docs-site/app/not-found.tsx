import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[99vh] flex flex-col items-center justify-center text-center">
      <div className="mb-6">
        <h2 className="text-6xl font-bold mb-2">404</h2>
        <p className="text-muted-foreground text-lg">Page not found</p>
      </div>

      <Link href="/" className={buttonVariants({
        className: "px-4",
        size: "lg"
      })}>
        Back to homepage
      </Link>
    </div>
  );
}
