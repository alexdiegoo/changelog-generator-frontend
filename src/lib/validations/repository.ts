import { z } from "zod";

/** Validates an available GitHub repo before importing it. */
export const importRepositorySchema = z.object({
  github_id: z.number().int().positive(),
  full_name: z.string().min(1, "Repository name is required."),
});

export type ImportRepositoryDto = z.infer<typeof importRepositorySchema>;

/** Standalone search-box validation for filtering available repos. */
export const repoSearchSchema = z.string().max(200);
