import { z } from 'zod';

export const inviteParentLinkSchema = z.object({
  studentEmail: z.string().trim().email().max(254),
});

export type InviteParentLinkDto = z.infer<typeof inviteParentLinkSchema>;

export const parentInternshipDecisionSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  note: z.string().trim().max(1000).optional(),
});

export type ParentInternshipDecisionDto = z.infer<typeof parentInternshipDecisionSchema>;

export const createParentThreadSchema = z.object({
  topic: z.string().trim().min(3).max(160),
  participantRole: z.enum(['student', 'mentor', 'support']).default('student'),
});

export type CreateParentThreadDto = z.infer<typeof createParentThreadSchema>;

export const sendParentMessageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

export type SendParentMessageDto = z.infer<typeof sendParentMessageSchema>;

export const parentCheckoutSchema = z.object({
  programId: z.string().min(1),
  couponCode: z.string().trim().max(40).optional(),
});

export type ParentCheckoutDto = z.infer<typeof parentCheckoutSchema>;
