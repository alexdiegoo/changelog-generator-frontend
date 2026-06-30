"use client";

import { useEffect } from "react";
import { ErrorAlert } from "@/components/shared/feedback/error-alert";
import { Section } from "@/components/shared/layout/section";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface unexpected route errors for debugging.
    console.error(error);
  }, [error]);

  return (
    <Section>
      <ErrorAlert
        error={error}
        title="Something went wrong"
        onRetry={reset}
      />
    </Section>
  );
}
