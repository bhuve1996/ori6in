import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('InternshipRepository (memory adapter)', () => {
  it('creates listing, scopes to company, and updates application status', async () => {
    const repos = createMemoryRepositories();
    const company = await repos.users.create({
      email: 'co@ori6in.test',
      fullName: 'Co',
      role: Role.Company,
      passwordHash: 'hash',
    });
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
      companyUserId: company.id,
      approvalStatus: 'approved',
      paymentStatus: 'waived',
      published: true,
    });
    const owned = await repos.internships.listByCompanyUser(company.id);
    assert.equal(owned.length, 1);

    const app = await repos.internships.createApplication({
      userId: user.id,
      internshipId: internship.id,
      notes: 'Excited to join',
      documentKeys: [],
      status: 'applied',
      timeline: [{ at: new Date(), status: 'applied' }],
      parentDecision: 'pending',
      parentDecidedAt: null,
      parentNote: null,
    });
    assert.equal(app.parentDecision, 'pending');
    const updated = await repos.internships.updateApplicationStatus(
      app.id,
      'under_review',
      'Screening',
    );
    assert.equal(updated?.status, 'under_review');
    assert.equal(updated?.timeline.length, 2);

    const decided = await repos.internships.updateParentDecision(
      app.id,
      'approved',
      'Looks good',
    );
    assert.equal(decided?.parentDecision, 'approved');
    assert.equal(decided?.parentNote, 'Looks good');
    assert.ok(decided?.parentDecidedAt);
  });
});
