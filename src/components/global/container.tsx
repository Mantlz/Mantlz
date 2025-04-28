import clsx from "clsx";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={clsx("w-full min-h-screen mx-auto px-4 py-8 bg-white dark:bg-neutral-950", className)} {...props} />;
}