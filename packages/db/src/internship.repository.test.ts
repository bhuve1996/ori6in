import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('InternshipRepository (memory adapter)', () => {
  it('creates listing and student application', async () => {
    const repos = createMemoryRepositories();
    const user = await repos.users.create({
      email: 'applicant@ori6in.test',
      fullName: 'Applicant',
      role: Role.Student,
      passwordHash: 'hash',
    });
    const internship = await repos.internships.create({
      slug: 'frontend-intern',
      title: 'Frontend Intern',
      company: 'ORI6IN Labs',
      location: 'Remote',
      description: 'Build portals',
      published: true,
    });
    const app = await repos.internships.createApplication({
      userId: user.id,
      internshipId: internship.id,
      notes: 'Excited to join',
      documentKeys: [],
      status: 'applied',
      timeline: [{ at: new Date(), status: 'applied' }],
    });
    const found = await repos.internships.findApplication(user.id, internship.id);
    assert.equal(found?.id, app.id);
  });
});
