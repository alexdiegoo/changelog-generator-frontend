import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { SidebarNav } from "@/components/shared/layout/sidebar-nav";
import { ThemeToggle } from "@/components/shared/layout/theme-toggle";
import { UserMenu } from "@/components/shared/layout/user-menu";
import { Container } from "@/components/shared/layout/container";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <SparklesIcon className="size-4" />
            </span>
            <span className="hidden sm:inline">Changelog Generator</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-border bg-sidebar md:block">
          <div className="sticky top-14 p-4">
            <SidebarNav />
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 py-8">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
}
