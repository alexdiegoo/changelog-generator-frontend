"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/ui/use-debounce";

/** Filters for the PR list. State lives in the URL so it survives refresh/share. */
export function PrFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [author, setAuthor] = useState(searchParams.get("author") ?? "");
  const [label, setLabel] = useState(searchParams.get("label") ?? "");
  const [since, setSince] = useState(searchParams.get("since") ?? "");

  const debouncedAuthor = useDebounce(author, 350);
  const debouncedLabel = useDebounce(label, 350);

  // Sync debounced text filters + date into the URL.
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    setOrDelete(params, "author", debouncedAuthor);
    setOrDelete(params, "label", debouncedLabel);
    setOrDelete(params, "since", since ? toIsoStart(since) : "");

    const next = params.toString();
    if (next !== searchParams.toString()) {
      router.replace(`${pathname}${next ? `?${next}` : ""}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAuthor, debouncedLabel, since]);

  const hasFilters = !!(author || label || since);

  function clear() {
    setAuthor("");
    setLabel("");
    setSince("");
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Field id="filter-author" label="Author">
        <Input
          id="filter-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="octocat"
          className="h-8 w-40"
        />
      </Field>
      <Field id="filter-label" label="Label">
        <Input
          id="filter-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="feature"
          className="h-8 w-40"
        />
      </Field>
      <Field id="filter-since" label="Merged since">
        <Input
          id="filter-since"
          type="date"
          value={since.slice(0, 10)}
          onChange={(e) => setSince(e.target.value)}
          className="h-8 w-40"
        />
      </Field>
      {hasFilters ? (
        <Button variant="ghost" size="sm" onClick={clear}>
          <XIcon />
          Clear
        </Button>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  const trimmed = value.trim();
  if (trimmed) params.set(key, trimmed);
  else params.delete(key);
}

/** A date input gives YYYY-MM-DD; the backend expects an ISO datetime. */
function toIsoStart(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}
