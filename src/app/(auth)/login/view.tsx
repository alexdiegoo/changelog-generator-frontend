"use client";

import { SparklesIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubLoginButton } from "./_components/github-login-button";

export function LoginView() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <SparklesIcon className="size-6" />
        </div>
        <CardTitle className="text-xl">AI Changelog Generator</CardTitle>
        <CardDescription>
          Turn merged pull requests into polished changelogs. Sign in with
          GitHub to get started — this also creates your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <GithubLoginButton />
        <p className="text-center text-xs text-muted-foreground">
          We request access to read your repositories and publish releases.
        </p>
      </CardContent>
    </Card>
  );
}
