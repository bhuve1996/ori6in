import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('CertificateRepository (memory adapter)', () => {
  it('creates certificates and finds by code and user/program uniqueness', async () => {
    const repos = createMemoryRepositories();
    const user = await repos.users.create({
      email: 'grad@ori6in.test',
      fullName: 'Graduate',
      role: Role.Student,
      passwordHash: 'hash',
    });
    const program = await repos.programs.create({
      title: 'Leadership Track',
      slug: 'leadership-track',
      summary: 'Summary',
      description: 'Description',
      priceCents: 0,
      currency: 'INR',
      isOwnProduct: true,
      published: true,
    });

    const issuedAt = new Date('2026-06-01T00:00:00.000Z');
    const cert = await repos.certificates.create({
      userId: user.id,
      programId: program.id,
      code: 'ORI6IN-LEAD-001',
      title: 'Certificate of Completion',
      recipientName: user.fullName,
      programTitle: program.title,
      issuedAt,
    });

    assert.ok(cert.id);
    assert.equal(cert.code, 'ORI6IN-LEAD-001');

    const byCode = await repos.certificates.findByCode('ORI6IN-LEAD-001');
    assert.equal(byCode?.id, cert.id);

    const byUserProgram = await repos.certificates.findByUserProgram(
      user.id,
      program.id,
    );
    assert.equal(byUserProgram?.id, cert.id);

    const again = await repos.certificates.findByUserProgram(user.id, program.id);
    assert.equal(again?.id, cert.id);
    assert.equal(again?.code, cert.code);

    const listed = await repos.certificates.listByUser(user.id);
    assert.equal(listed.length, 1);
    assert.equal(listed[0]?.id, cert.id);
  });
});
