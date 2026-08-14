import { z } from 'zod';

export const applyInternshipSchema = z.object({
  notes: z.string().trim().max(2000).optional(),
  documentKeys: z.array(z.string().min(1)).max(10).optional(),
});

export type ApplyInternshipDto = z.infer<typeof applyInternshipSchema>;
