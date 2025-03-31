import clsx from "clsx";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div className={clsx("mx-auto bg-white dark:bg-neutral-950", className)} {...props} />;
}