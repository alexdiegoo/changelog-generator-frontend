"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparklesIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useDisclosure } from "@/hooks/ui/use-disclosure";
import { useGenerateChangelog } from "@/hooks/queries/use-changelogs";
import { ApiError } from "@/lib/api/api-client";
import {
  generateChangelogSchema,
  type GenerateChangelogDto,
} from "@/lib/validations/changelog";
import type { SelectOption } from "@/types/ui";
import type { ChangelogTone } from "@/types/api";

const TONE_OPTIONS: SelectOption<ChangelogTone>[] = [
  { value: "technical", label: "Technical", description: "For developers" },
  { value: "executive", label: "Executive", description: "For stakeholders" },
  { value: "public", label: "Public", description: "For end users" },
];

const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: "pt-BR", label: "Português (BR)" },
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
];

interface GenerateChangelogDialogProps {
  repoId: string;
  pullRequestIds: string[];
}

export function GenerateChangelogDialog({
  repoId,
  pullRequestIds,
}: GenerateChangelogDialogProps) {
  const { isOpen, setIsOpen } = useDisclosure();
  const count = pullRequestIds.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        disabled={count === 0}
        onClick={() => setIsOpen(true)}
      >
        <SparklesIcon />
        Generate changelog
        {count > 0 ? (
          <Badge variant="secondary" className="ml-1">
            {count}
          </Badge>
        ) : null}
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate changelog</DialogTitle>
          <DialogDescription>
            AI will summarize {count} selected pull request
            {count === 1 ? "" : "s"} in the tone and language you choose.
          </DialogDescription>
        </DialogHeader>
        {isOpen ? (
          <GenerateChangelogForm
            repoId={repoId}
            pullRequestIds={pullRequestIds}
            onDone={() => setIsOpen(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function GenerateChangelogForm({
  repoId,
  pullRequestIds,
  onDone,
}: GenerateChangelogDialogProps & { onDone: () => void }) {
  const router = useRouter();
  const generate = useGenerateChangelog(repoId);

  const form = useForm<GenerateChangelogDto>({
    resolver: zodResolver(generateChangelogSchema),
    mode: "onChange",
    defaultValues: {
      pullRequestIds,
      tone: "technical",
      language: "pt-BR",
      publishAsRelease: false,
      version: "",
    },
  });

  const publishAsRelease = useWatch({
    control: form.control,
    name: "publishAsRelease",
  });

  function onSubmit(values: GenerateChangelogDto) {
    generate.mutate(
      {
        pull_request_ids: values.pullRequestIds,
        tone: values.tone,
        language: values.language,
        version: values.version?.trim() || undefined,
      },
      {
        onSuccess: (changelog) => {
          toast.success("Changelog generated.");
          onDone();
          router.push(`/changelogs/${changelog.id}`);
        },
        onError: (error) =>
          toast.error(
            error instanceof ApiError
              ? error.detail
              : "Couldn't generate the changelog.",
          ),
      },
    );
  }

  const isPending = generate.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                        {opt.description ? (
                          <span className="text-muted-foreground">
                            {" "}
                            — {opt.description}
                          </span>
                        ) : null}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publishAsRelease"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-2.5">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <div className="grid gap-0.5 leading-none">
                <FormLabel>I plan to publish this as a GitHub Release</FormLabel>
                <FormDescription>
                  A version tag becomes required when publishing.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {publishAsRelease ? (
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input placeholder="v1.4.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || isPending}
        >
          {isPending ? "Generating…" : "Generate changelog"}
        </Button>
      </form>
    </Form>
  );
}
