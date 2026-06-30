import { z } from "zod";
import { CHANGELOG_TONES } from "@/types/api";

/** Tone/language/version selection form, fired before AI generation. */
export const generateChangelogSchema = z
  .object({
    pullRequestIds: z
      .array(z.string())
      .min(1, "Select at least one pull request."),
    tone: z.enum(CHANGELOG_TONES),
    language: z.string().min(2, "Choose a language."),
    publishAsRelease: z.boolean(),
    version: z.string().optional(),
  })
  .refine(
    (data) => !data.publishAsRelease || !!data.version?.trim(),
    {
      // Version is required only when the user intends to publish a Release.
      path: ["version"],
      message: "Version is required to publish as a GitHub Release.",
    },
  );

export type GenerateChangelogDto = z.infer<typeof generateChangelogSchema>;

/** Inline editor for the generated changelog content. */
export const editChangelogSchema = z.object({
  content: z.string().min(1, "Changelog content cannot be empty."),
});

export type EditChangelogDto = z.infer<typeof editChangelogSchema>;
