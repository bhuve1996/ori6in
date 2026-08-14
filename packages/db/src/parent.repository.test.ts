import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('ParentRepository (memory adapter)', () => {
  it('links parent to student and supports messaging', async () => {
    const repos = createMemoryRepositories();
    const parent = await repos.users.create({
      email: 'parent@test.ori6in',
      fullName: 'Parent',
      role: Role.Parent,
      passwordHash: 'hash',
    });
    const student = await repos.users.create({
      email: 'kid@test.ori6in',
      fullName: 'Kid',
      role: Role.Student,
      passwordHash: 'hash',
    });

    const link = await repos.parent.createLink({
      parentUserId: parent.id,
      studentUserId: student.id,
      status: 'pending',
      inviteEmail: student.email,
    });
    const active = await repos.parent.updateLinkStatus(link.id, 'active');
    assert.equal(active?.status, 'active');

    const primary = await repos.parent.findPrimaryActiveStudent(parent.id);
    assert.equal(primary?.studentUserId, student.id);

    const thread = await repos.parent.createThread({
      parentUserId: parent.id,
      studentUserId: student.id,
      participantUserId: student.id,
      participantRole: 'student',
      topic: 'Check-in',
    });
    await repos.parent.createMessage({
      threadId: thread.id,
      senderUserId: parent.id,
      body: 'How is school?',
    });
    const messages = await repos.parent.listMessages(thread.id);
    assert.equal(messages.length, 1);
  });
});
