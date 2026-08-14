import { z } from 'zod';

export const applyInternshipSchema = z.object({
  notes: z.string().trim().max(2000).optional(),
  documentKeys: z.array(z.string().min(1)).max(10).optional(),
});

export type ApplyInternshipDto = z.infer<typeof applyInternshipSchema>;

export const createCompanyInternshipSchema = z.object({
  title: z.string().trim().min(3).max(120),
  company: z.string().trim().min(2).max(120).optional(),
  location: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(5000),
  /** Save as draft (default) or submit for approval immediately after mock pay. */
  submit: z.boolean().optional(),
});

export type CreateCompanyInternshipDto = z.infer<typeof createCompanyInternshipSchema>;

export const updateCompanyInternshipSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  location: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  company: z.string().trim().min(2).max(120).optional(),
});

export type UpdateCompanyInternshipDto = z.infer<typeof updateCompanyInternshipSchema>;

export const applicationStatuses = [
  'applied',
  'under_review',
  'interview',
  'offered',
  'rejected',
  'withdrawn',
] as const;

export const updateApplicationStatusSchema = z.object({
  status: z.enum(applicationStatuses),
  note: z.string().trim().max(1000).optional(),
});

export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;

export const reviewInternshipApprovalSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  note: z.string().trim().max(1000).optional(),
});

export type ReviewInternshipApprovalDto = z.infer<typeof reviewInternshipApprovalSchema>;
