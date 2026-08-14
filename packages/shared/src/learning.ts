import { z } from 'zod';

export const markLessonCompleteSchema = z.object({
  lessonId: z.string().uuid(),
});

export type MarkLessonCompleteDto = z.infer<typeof markLessonCompleteSchema>;
