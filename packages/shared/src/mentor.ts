import { z } from 'zod';

export const mentorReviewSchema = z.object({
  studentId: z.string().uuid(),
  title: z.string().min(2).max(120),
  grade: z.string().min(1).max(40),
  feedback: z.string().min(2).max(4000),
  programId: z.string().uuid().optional(),
});

export const mentorSessionNoteSchema = z.object({
  studentId: z.string().uuid(),
  note: z.string().min(2).max(4000),
});

export type MentorReviewDto = z.infer<typeof mentorReviewSchema>;
export type MentorSessionNoteDto = z.infer<typeof mentorSessionNoteSchema>;
