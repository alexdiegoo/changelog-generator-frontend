import type { Metadata } from "next";
import { CallbackView } from "./view";

export const metadata: Metadata = { title: "Signing in" };

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <CallbackView error={error} />
    </div>
  );
}
