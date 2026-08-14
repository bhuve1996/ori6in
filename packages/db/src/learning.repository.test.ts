import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('LearningRepository (memory adapter)', () => {
  it('tracks lesson completion for a user', async () => {
    const repos = createMemoryRepositories();
    const user = await repos.users.create({
      email: 'learner@ori6in.test',
      fullName: 'Learner',
      role: Role.Student,
      passwordHash: 'hash',
    });
    const program = await repos.programs.create({
      title: 'Prog',
      slug: 'prog',
      summary: 's',
      description: 'd',
      priceCents: 100,
      currency: 'INR',
      isOwnProduct: true,
      published: true,
    });
    const course = await repos.learning.createCourse({
      programId: program.id,
      title: 'Course',
      slug: 'course',
      summary: 'summary',
      sortOrder: 1,
      published: true,
    });
    const lesson = await repos.learning.createLesson({
      courseId: course.id,
      title: 'Lesson 1',
      slug: 'lesson-1',
      content: 'Hello',
      sortOrder: 1,
      published: true,
    });

    const progress = await repos.learning.markLessonComplete(user.id, lesson.id);
    assert.equal(progress.lessonId, lesson.id);
    const again = await repos.learning.markLessonComplete(user.id, lesson.id);
    assert.equal(again.id, progress.id);
  });
});
