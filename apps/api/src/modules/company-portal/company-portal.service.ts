import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ApplicationStatus, Internship, Repositories } from '@ori6in/db';
import {
  createCompanyInternshipSchema,
  reviewInternshipApprovalSchema,
  updateApplicationStatusSchema,
  updateCompanyInternshipSchema,
} from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return `${base || 'role'}-${Date.now().toString(36)}`;
}

function serializeListing(l: Internship) {
  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    company: l.company,
    location: l.location,
    description: l.description,
    companyUserId: l.companyUserId,
    approvalStatus: l.approvalStatus,
    paymentStatus: l.paymentStatus,
    published: l.published,
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  };
}

@Injectable()
export class CompanyPortalService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  async dashboard(companyUserId: string) {
    const listings = await this.repos.internships.listByCompanyUser(companyUserId);
    const applicants = await this.collectApplicants(listings.map((l) => l.id));
    const interviews = applicants.filter((a) => a.status === 'interview').length;
    const pending = listings.filter((l) => l.approvalStatus === 'pending_approval').length;

    return {
      companyUserId,
      openRoles: listings.filter((l) => l.published).length,
      totalRoles: listings.length,
      pendingApproval: pending,
      applicants: applicants.length,
      interviews,
      recentListings: listings.slice(0, 5).map(serializeListing),
    };
  }

  async internships(companyUserId: string) {
    const listings = await this.repos.internships.listByCompanyUser(companyUserId);
    return { items: listings.map(serializeListing) };
  }

  async createInternship(companyUserId: string, body: unknown) {
    const parsed = createCompanyInternshipSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const companyUser = await this.repos.users.findById(companyUserId);
    const companyName = parsed.data.company?.trim() || companyUser?.fullName || 'Company';

    let slug = slugify(parsed.data.title);
    while (await this.repos.internships.findBySlug(slug)) {
      slug = slugify(parsed.data.title);
    }

    const submit = Boolean(parsed.data.submit);
    const listing = await this.repos.internships.create({
      slug,
      title: parsed.data.title,
      company: companyName,
      location: parsed.data.location,
      description: parsed.data.description,
      companyUserId,
      paymentStatus: submit ? 'paid' : 'unpaid',
      approvalStatus: submit ? 'pending_approval' : 'draft',
      published: false,
    });

    return serializeListing(listing);
  }

  async updateInternship(companyUserId: string, id: string, body: unknown) {
    const listing = await this.requireOwnedListing(companyUserId, id);
    const parsed = updateCompanyInternshipSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const updated = await this.repos.internships.update(listing.id, parsed.data);
    if (!updated) throw new NotFoundException('Role not found');
    return serializeListing(updated);
  }

  /** Mock pay-to-post — marks listing paid so it can be submitted. */
  async payForInternship(companyUserId: string, id: string) {
    const listing = await this.requireOwnedListing(companyUserId, id);
    if (listing.paymentStatus === 'paid' || listing.paymentStatus === 'waived') {
      return serializeListing(listing);
    }
    const updated = await this.repos.internships.update(listing.id, {
      paymentStatus: 'paid',
    });
    if (!updated) throw new NotFoundException('Role not found');
    return {
      ...serializeListing(updated),
      note: 'Sandbox payment recorded. Submit the role for admin approval next.',
    };
  }

  async submitInternship(companyUserId: string, id: string) {
    const listing = await this.requireOwnedListing(companyUserId, id);
    if (listing.paymentStatus === 'unpaid') {
      throw new BadRequestException('Pay to post before submitting for approval');
    }
    if (listing.approvalStatus === 'approved' && listing.published) {
      return serializeListing(listing);
    }
    const updated = await this.repos.internships.update(listing.id, {
      approvalStatus: 'pending_approval',
      published: false,
    });
    if (!updated) throw new NotFoundException('Role not found');
    return serializeListing(updated);
  }

  async applicants(companyUserId: string) {
    const listings = await this.repos.internships.listByCompanyUser(companyUserId);
    const items = await this.collectApplicants(listings.map((l) => l.id));
    return { items };
  }

  async updateApplicantStatus(companyUserId: string, applicationId: string, body: unknown) {
    const parsed = updateApplicationStatusSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const app = await this.repos.internships.findApplicationById(applicationId);
    if (!app) throw new NotFoundException('Application not found');

    await this.requireOwnedListing(companyUserId, app.internshipId);

    const updated = await this.repos.internships.updateApplicationStatus(
      applicationId,
      parsed.data.status as ApplicationStatus,
      parsed.data.note,
    );
    if (!updated) throw new NotFoundException('Application not found');

    const student = await this.repos.users.findById(updated.userId);
    const role = await this.repos.internships.findById(updated.internshipId);

    await this.repos.notifications.create({
      userId: updated.userId,
      channel: 'in_app',
      title: `Application update: ${role?.title ?? 'Internship'}`,
      body: `Status is now “${updated.status}”.${parsed.data.note ? ` ${parsed.data.note}` : ''}`,
    });

    return {
      id: updated.id,
      internshipId: updated.internshipId,
      roleTitle: role?.title ?? 'Role',
      applicantId: updated.userId,
      applicantName: student?.fullName ?? 'Student',
      applicantEmail: student?.email ?? '',
      status: updated.status,
      notes: updated.notes,
      timeline: updated.timeline,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async interviews(companyUserId: string) {
    const listings = await this.repos.internships.listByCompanyUser(companyUserId);
    const applicants = await this.collectApplicants(listings.map((l) => l.id));
    const interviewApps = applicants.filter((a) => a.status === 'interview');

    return {
      items: interviewApps.map((a, i) => ({
        id: `interview-${a.id}`,
        applicationId: a.id,
        applicantName: a.applicantName,
        roleTitle: a.roleTitle,
        scheduledAt: new Date(Date.now() + (i + 2) * 24 * 60 * 60 * 1000).toISOString(),
        mode: i % 2 === 0 ? 'Video' : 'On-site',
        status: 'scheduled',
      })),
    };
  }

  /** Admin: list roles waiting for approval. */
  async listPendingApprovals() {
    const items = await this.repos.internships.listPendingApproval();
    return { items: items.map(serializeListing) };
  }

  /** Admin: approve or reject a company posting. */
  async reviewApproval(adminUserId: string, internshipId: string, body: unknown) {
    const parsed = reviewInternshipApprovalSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const listing = await this.repos.internships.findById(internshipId);
    if (!listing) throw new NotFoundException('Role not found');
    if (listing.approvalStatus !== 'pending_approval') {
      throw new BadRequestException('Role is not pending approval');
    }

    const approved = parsed.data.decision === 'approved';
    const updated = await this.repos.internships.update(listing.id, {
      approvalStatus: approved ? 'approved' : 'rejected',
      published: approved,
    });
    if (!updated) throw new NotFoundException('Role not found');

    if (listing.companyUserId) {
      await this.repos.notifications.create({
        userId: listing.companyUserId,
        channel: 'in_app',
        title: approved ? 'Internship role approved' : 'Internship role rejected',
        body: approved
          ? `“${listing.title}” is live for students.`
          : `“${listing.title}” was rejected.${parsed.data.note ? ` ${parsed.data.note}` : ''}`,
      });
    }

    await this.repos.audit.append({
      actorId: adminUserId,
      action: approved ? 'internship.approved' : 'internship.rejected',
      resourceType: 'internship',
      resourceId: listing.id,
      metadata: { note: parsed.data.note ?? null },
    });

    return serializeListing(updated);
  }

  private async requireOwnedListing(companyUserId: string, id: string) {
    const listing = await this.repos.internships.findById(id);
    if (!listing) throw new NotFoundException('Role not found');
    if (listing.companyUserId !== companyUserId) {
      throw new ForbiddenException('Not your role');
    }
    return listing;
  }

  private async collectApplicants(internshipIds: string[]) {
    const rows = [];
    for (const internshipId of internshipIds) {
      const apps = await this.repos.internships.listApplicationsByInternship(internshipId);
      const role = await this.repos.internships.findById(internshipId);
      for (const app of apps) {
        const student = await this.repos.users.findById(app.userId);
        rows.push({
          id: app.id,
          internshipId: app.internshipId,
          roleTitle: role?.title ?? 'Role',
          company: role?.company ?? '',
          applicantId: app.userId,
          applicantName: student?.fullName ?? 'Student',
          applicantEmail: student?.email ?? '',
          status: app.status,
          notes: app.notes,
          parentDecision: app.parentDecision,
          mentorCompletionDecision: app.mentorCompletionDecision,
          timeline: app.timeline,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        });
      }
    }
    return rows.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }
}
