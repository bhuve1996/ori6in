import { z } from 'zod';

export const programUpsertSchema = z.object({
  title: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase-kebab'),
  summary: z.string().min(2),
  description: z.string().min(2),
  priceCents: z.number().int().nonnegative(),
  currency: z.string().min(3).max(3).default('INR'),
  published: z.boolean().optional().default(false),
});

export const programUpdateSchema = programUpsertSchema.partial().extend({
  published: z.boolean().optional(),
});

export const cmsPageUpsertSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase-kebab'),
  title: z.string().min(2),
  body: z.string().min(1),
  published: z.boolean().optional().default(true),
});

export const blogPostUpsertSchema = z.object({
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase-kebab'),
  title: z.string().min(2),
  excerpt: z.string().min(2),
  body: z.string().min(1),
  published: z.boolean().optional().default(true),
});

export type ProgramUpsertDto = z.infer<typeof programUpsertSchema>;
export type ProgramUpdateDto = z.infer<typeof programUpdateSchema>;
export type CmsPageUpsertDto = z.infer<typeof cmsPageUpsertSchema>;
export type BlogPostUpsertDto = z.infer<typeof blogPostUpsertSchema>;
