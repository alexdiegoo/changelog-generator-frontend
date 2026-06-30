import type { Metadata } from "next";
import { ChangelogHistoryView } from "./view";

export const metadata: Metadata = { title: "Changelog history" };

export default async function ChangelogHistoryPage({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const { repoId } = await params;
  return <ChangelogHistoryView repoId={repoId} />;
}
