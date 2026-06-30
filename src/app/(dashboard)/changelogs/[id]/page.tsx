import type { Metadata } from "next";
import { ChangelogDetailView } from "./view";

export const metadata: Metadata = { title: "Changelog" };

export default async function ChangelogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChangelogDetailView id={id} />;
}
