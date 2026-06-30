"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CallbackViewProps {
  error?: string;
}

export function CallbackView({ error }: CallbackViewProps) {
  const router = useRouter();

  // Happy path: the backend has already set the session cookie and bounced
  // here (or straight to /dashboard). Forward the user into the app.
  useEffect(() => {
    if (!error) router.replace("/dashboard");
  }, [error, router]);

  if (error) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircleIcon className="size-6" />
          </div>
          <CardTitle>Sign-in failed</CardTitle>
          <CardDescription>
            We couldn&apos;t complete the GitHub sign-in ({error}). Please try
            again.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => router.replace("/login")}>
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <Loader2Icon className="size-6 animate-spin" />
      <p className="text-sm">Completing sign-in…</p>
    </div>
  );
}
