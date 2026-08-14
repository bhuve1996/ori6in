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
      status: 'published',
      templateKey: null,
      documentKeys: [],
    });
    assert.equal(review.grade, 'A');
    assert.equal(review.status, 'published');
    assert.ok(review.updatedAt);

    const draft = await repos.mentors.createReview({
      mentorId: mentor.id,
      studentId: student.id,
      programId: program.id,
      title: 'Week 2 draft',
      grade: 'B',
      feedback: 'WIP',
      status: 'draft',
      templateKey: 'weekly',
      documentKeys: ['key-1'],
    });
    const updated = await repos.mentors.updateReview(draft.id, {
      feedback: 'Updated',
      status: 'published',
    });
    assert.equal(updated?.feedback, 'Updated');
    assert.equal(updated?.status, 'published');
    assert.equal((await repos.mentors.findReviewById(draft.id))?.title, 'Week 2 draft');

    const startsAt = new Date('2026-08-20T10:00:00.000Z');
    const endsAt = new Date('2026-08-20T11:00:00.000Z');
    const session = await repos.mentors.createSession({
      mentorId: mentor.id,
      studentId: student.id,
      programId: program.id,
      topic: 'Kickoff',
      startsAt,
      endsAt,
      status: 'scheduled',
      meetingUrl: 'https://meet.example/kickoff',
    });
    assert.equal(session.topic, 'Kickoff');
    const byMentor = await repos.mentors.listSessionsByMentor(mentor.id);
    assert.equal(byMentor.length, 1);
    const byStudent = await repos.mentors.listSessionsByStudent(student.id);
    assert.equal(byStudent.length, 1);
    const cancelled = await repos.mentors.updateSession(session.id, { status: 'cancelled' });
    assert.equal(cancelled?.status, 'cancelled');
    assert.equal((await repos.mentors.findSessionById(session.id))?.status, 'cancelled');
  });
});
