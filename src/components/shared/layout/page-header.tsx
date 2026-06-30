import { cn } from "@/lib/utils";
import { Heading } from "@/components/shared/typography/heading";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Right-aligned actions (buttons, menus). */
  children?: React.ReactNode;
  className?: string;
  /** Optional element rendered above the title (e.g. a back link / breadcrumb). */
  eyebrow?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  children,
  className,
  eyebrow,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1">
        {eyebrow}
        <Heading as="h1">{title}</Heading>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
