"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // resolvedTheme is only known on the client (it reads localStorage / system
  // preference), so defer rendering the theme-dependent icon until after mount
  // to avoid a server/client hydration mismatch.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  // Before mount, render the same icon the server did (<SunIcon />) so the
  // markup matches during hydration; swap to the real icon afterwards.
  const showMoon = mounted && isDark;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {showMoon ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
