import { cn } from "@/lib/utils";

const sizes = {
  h1: "text-2xl font-semibold tracking-tight",
  h2: "text-xl font-semibold tracking-tight",
  h3: "text-lg font-semibold",
} as const;

interface HeadingProps extends React.ComponentProps<"h1"> {
  as?: "h1" | "h2" | "h3";
}

export function Heading({ as = "h1", className, ...props }: HeadingProps) {
  const Tag = as;
  return <Tag className={cn(sizes[as], className)} {...props} />;
}
