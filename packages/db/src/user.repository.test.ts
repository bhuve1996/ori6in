import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('UserRepository (memory adapter)', () => {
  it('creates and finds a user by email', async () => {
    const repos = createMemoryRepositories();
    const created = await repos.users.create({
      email: 'student@ori6in.test',
      fullName: 'Test Student',
      role: Role.Student,
      passwordHash: 'hash',
    });
    const found = await repos.users.findByEmail('student@ori6in.test');
    assert.equal(found?.id, created.id);
    assert.equal(found?.role, Role.Student);
  });
});
