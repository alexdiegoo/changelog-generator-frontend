import { cn } from "@/lib/utils";

const tones = {
  default: "text-foreground",
  muted: "text-muted-foreground",
} as const;

interface TextProps extends React.ComponentProps<"p"> {
  tone?: keyof typeof tones;
  size?: "sm" | "base";
}

export function Text({
  tone = "default",
  size = "base",
  className,
  ...props
}: TextProps) {
  return (
    <p
      className={cn(
        tones[tone],
        size === "sm" ? "text-sm" : "text-base",
        className,
      )}
      {...props}
    />
  );
}
