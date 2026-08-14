import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('AuthTokenRepository (memory adapter)', () => {
  it('issues, finds, and consumes a password reset token', async () => {
    const repos = createMemoryRepositories();
    const user = await repos.users.create({
      email: 'reset@ori6in.test',
      fullName: 'Reset User',
      role: Role.Student,
      passwordHash: 'hash',
    });

    const created = await repos.authTokens.create({
      userId: user.id,
      tokenHash: 'abc123',
      purpose: 'password_reset',
      expiresAt: new Date(Date.now() + 60_000),
    });

    const found = await repos.authTokens.findValidByHash('password_reset', 'abc123');
    assert.equal(found?.id, created.id);

    await repos.authTokens.markUsed(created.id);
    const after = await repos.authTokens.findValidByHash('password_reset', 'abc123');
    assert.equal(after, null);
  });
});
