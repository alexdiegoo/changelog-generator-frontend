import { Badge } from "@/components/ui/badge";
import type { ChangelogTone } from "@/types/api";

const TONE_LABELS: Record<ChangelogTone, string> = {
  technical: "Technical",
  executive: "Executive",
  public: "Public",
};

export function ToneBadge({ tone }: { tone: ChangelogTone }) {
  return <Badge variant="secondary">{TONE_LABELS[tone] ?? tone}</Badge>;
}
