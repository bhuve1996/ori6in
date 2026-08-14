import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('MentorRepository (memory adapter)', () => {
  it('assigns mentor to student and stores a review', async () => {
    const repos = createMemoryRepositories();
    const mentor = await repos.users.create({
      email: 'm@ori6in.test',
      fullName: 'Mentor',
      role: Role.Mentor,
      passwordHash: 'hash',
    });
    const student = await repos.users.create({
      email: 's@ori6in.test',
      fullName: 'Student',
      role: Role.Student,
      passwordHash: 'hash',
    });
    const program = await repos.programs.create({
      title: 'P',
      slug: 'p',
      summary: 's',
      description: 'd',
      priceCents: 1,
      currency: 'INR',
      isOwnProduct: true,
      published: true,
    });
    await repos.mentors.createAssignment({
      mentorId: mentor.id,
      studentId: student.id,
      programId: program.id,
      status: 'active',
    });
    const found = await repos.mentors.findAssignment(mentor.id, student.id);
    assert.ok(found);
    const review = await repos.mentors.createReview({
      mentorId: mentor.id,
      studentId: student.id,
      programId: program.id,
      title: 'Week 1',
      grade: 'A',
      feedback: 'Great start',
    });
    assert.equal(review.grade, 'A');
  });
});
