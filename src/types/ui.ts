import type { LucideIcon } from "lucide-react";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  description?: string;
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};
