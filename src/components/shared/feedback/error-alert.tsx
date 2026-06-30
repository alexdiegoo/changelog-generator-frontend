import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GithubMark } from "@/components/shared/icons/github-mark";
import { ApiError } from "@/lib/api/api-client";
import { githubLoginUrl } from "@/hooks/queries/use-auth";

function messageFor(error: unknown): string {
  if (error instanceof ApiError) return error.detail;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

interface ErrorAlertProps {
  error: unknown;
  title?: string;
  /** Optional retry handler (e.g. `() => refetch()`). */
  onRetry?: () => void;
}

export function ErrorAlert({ error, title = "Error", onRetry }: ErrorAlertProps) {
  // The expected, recoverable "GitHub token expired" case gets its own message.
  const isReauth =
    error instanceof ApiError &&
    error.status === 409 &&
    error.detail === "github_reauth_required";

  if (isReauth) {
    return (
      <Alert>
        <GithubMark />
        <AlertTitle>Reconnect GitHub</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-3">
          <span>
            Your GitHub authorization has expired. Reconnect to keep importing
            repositories and syncing pull requests.
          </span>
          <Button size="sm" render={<a href={githubLoginUrl} />}>
            Reconnect GitHub
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>{messageFor(error)}</span>
        {onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
