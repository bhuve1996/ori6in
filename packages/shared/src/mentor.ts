import { z } from 'zod';

export const MENTOR_REVIEW_TEMPLATES = [
  { key: 'weekly_checkin', label: 'Weekly check-in' },
  { key: 'project_review', label: 'Project review' },
  { key: 'midpoint', label: 'Midpoint evaluation' },
  { key: 'final', label: 'Final evaluation' },
] as const;

export const mentorReviewSchema = z.object({
  studentId: z.string().min(1),
  title: z.string().min(2).max(120),
  grade: z.string().min(1).max(40),
  feedback: z.string().min(2).max(4000),
  programId: z.string().min(1).optional(),
  status: z.enum(['draft', 'published']).optional().default('published'),
  templateKey: z.string().trim().max(60).optional(),
  documentKeys: z.array(z.string().min(1)).max(10).optional(),
});

export const updateMentorReviewSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  grade: z.string().min(1).max(40).optional(),
  feedback: z.string().min(2).max(4000).optional(),
  status: z.enum(['draft', 'published']).optional(),
  templateKey: z.string().trim().max(60).nullable().optional(),
  documentKeys: z.array(z.string().min(1)).max(10).optional(),
});

export const mentorSessionNoteSchema = z.object({
  studentId: z.string().min(1),
  note: z.string().min(2).max(4000),
});

export const bookMentorSessionSchema = z.object({
  studentId: z.string().min(1),
  topic: z.string().trim().min(3).max(160),
  startsAt: z.string().datetime({ offset: true }).or(z.string().min(8)),
  endsAt: z.string().datetime({ offset: true }).or(z.string().min(8)).optional(),
  meetingUrl: z.string().url().max(500).optional().or(z.literal('')),
  programId: z.string().min(1).optional(),
});

export const updateMentorSessionSchema = z.object({
  topic: z.string().trim().min(3).max(160).optional(),
  startsAt: z.string().datetime({ offset: true }).or(z.string().min(8)).optional(),
  endsAt: z.string().datetime({ offset: true }).or(z.string().min(8)).optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  meetingUrl: z.string().url().max(500).nullable().optional().or(z.literal('')),
});

export const mentorCompletionDecisionSchema = z.object({
  decision: z.enum(['approved', 'rejected']),
  note: z.string().trim().max(2000).optional(),
  documentKeys: z.array(z.string().min(1)).max(10).optional(),
});

export type MentorReviewDto = z.infer<typeof mentorReviewSchema>;
export type UpdateMentorReviewDto = z.infer<typeof updateMentorReviewSchema>;
export type MentorSessionNoteDto = z.infer<typeof mentorSessionNoteSchema>;
export type BookMentorSessionDto = z.infer<typeof bookMentorSessionSchema>;
export type UpdateMentorSessionDto = z.infer<typeof updateMentorSessionSchema>;
export type MentorCompletionDecisionDto = z.infer<typeof mentorCompletionDecisionSchema>;
