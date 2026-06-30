"use client";

import { Button } from "@/components/ui/button";
import { GithubMark } from "@/components/shared/icons/github-mark";
import { githubLoginUrl } from "@/hooks/queries/use-auth";

/** Redirects straight to the backend's GitHub OAuth entrypoint. */
export function GithubLoginButton() {
  return (
    <Button
      size="lg"
      className="w-full"
      render={<a href={githubLoginUrl} />}
    >
      <GithubMark />
      Sign in with GitHub
    </Button>
  );
}
