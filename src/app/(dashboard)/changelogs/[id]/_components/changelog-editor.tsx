"use client";

import dynamic from "next/dynamic";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateChangelog } from "@/hooks/queries/use-changelogs";
import { ApiError } from "@/lib/api/api-client";
import {
  editChangelogSchema,
  type EditChangelogDto,
} from "@/lib/validations/changelog";

// Heavy markdown renderer — load it only on the client when needed.
const MarkdownPreview = dynamic(
  () => import("@/components/shared/changelogs/markdown-preview"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full" />,
  },
);

export function ChangelogEditor({
  changelogId,
  content,
}: {
  changelogId: string;
  content: string;
}) {
  const update = useUpdateChangelog(changelogId);

  const form = useForm<EditChangelogDto>({
    resolver: zodResolver(editChangelogSchema),
    mode: "onChange",
    defaultValues: { content },
  });

  const previewContent = useWatch({ control: form.control, name: "content" });

  function onSubmit(values: EditChangelogDto) {
    update.mutate(values.content, {
      onSuccess: () => {
        toast.success("Changelog saved.");
        form.reset({ content: values.content });
      },
      onError: (error) =>
        toast.error(error instanceof ApiError ? error.detail : "Save failed."),
    });
  }

  const isDirty = form.formState.isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Tabs defaultValue="edit" className="gap-3">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <Button
              type="submit"
              size="sm"
              disabled={!isDirty || !form.formState.isValid || update.isPending}
            >
              <SaveIcon />
              {update.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>

          <TabsContent value="edit">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="min-h-[28rem] font-mono text-sm"
                      placeholder="# Changelog…"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="preview">
            <div className="min-h-[28rem] rounded-md border border-border p-4">
              {previewContent?.trim() ? (
                <MarkdownPreview content={previewContent} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nothing to preview.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
