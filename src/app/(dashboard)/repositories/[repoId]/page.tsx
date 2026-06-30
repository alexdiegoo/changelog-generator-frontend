import type { Metadata } from "next";
import { Suspense } from "react";
import { RepositoryDetailView } from "./view";

export const metadata: Metadata = { title: "Pull requests" };

export default async function RepositoryDetailPage({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const { repoId } = await params;
  return (
    <Suspense>
      <RepositoryDetailView repoId={repoId} />
    </Suspense>
  );
}
