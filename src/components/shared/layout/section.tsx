import { cn } from "@/lib/utils";

export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("flex flex-col gap-6", className)} {...props} />
  );
}
