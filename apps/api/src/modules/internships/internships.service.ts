import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { applyInternshipSchema } from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

@Injectable()
export class InternshipsService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  async list() {
    return this.repos.internships.listPublished();
  }

  async detail(id: string) {
    const internship = await this.repos.internships.findById(id);
    if (!internship || !internship.published) {
      throw new NotFoundException('Internship not found');
    }
    return internship;
  }

  async apply(userId: string, internshipId: string, body: unknown) {
    const parsed = applyInternshipSchema.safeParse(body ?? {});
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const internship = await this.repos.internships.findById(internshipId);
    if (!internship || !internship.published) {
      throw new NotFoundException('Internship not found');
    }

    const existing = await this.repos.internships.findApplication(userId, internshipId);
    if (existing) {
      throw new BadRequestException(`Already applied (application ${existing.id})`);
    }

    const application = await this.repos.internships.createApplication({
      userId,
      internshipId,
      notes: parsed.data.notes ?? null,
      documentKeys: parsed.data.documentKeys ?? [],
      status: 'applied',
      timeline: [{ at: new Date(), status: 'applied', note: 'Application submitted' }],
      parentDecision: 'pending',
      parentDecidedAt: null,
      parentNote: null,
      mentorCompletionDecision: 'pending',
      mentorCompletionNote: null,
      mentorCompletionDocKeys: [],
      mentorCompletedAt: null,
    });

    await this.repos.notifications.create({
      userId,
      channel: 'in_app',
      title: 'Internship application submitted',
      body: `You applied to ${internship.title} at ${internship.company}.`,
    });

    await this.repos.audit.append({
      actorId: userId,
      action: 'internships.apply',
      resourceType: 'internship_application',
      resourceId: application.id,
      metadata: { internshipId, title: internship.title },
    });

    return {
      application,
      internship: {
        id: internship.id,
        title: internship.title,
        company: internship.company,
      },
    };
  }

  async withdraw(userId: string, applicationId: string) {
    const app = await this.repos.internships.findApplicationById(applicationId);
    if (!app) throw new NotFoundException('Application not found');
    if (app.userId !== userId) throw new ForbiddenException();
    if (app.status === 'withdrawn') return app;
    if (app.status === 'offered' || app.status === 'rejected') {
      throw new BadRequestException('Cannot withdraw after a final decision');
    }

    const updated = await this.repos.internships.updateApplicationStatus(
      applicationId,
      'withdrawn',
      'Withdrawn by student',
    );
    if (!updated) throw new NotFoundException('Application not found');

    await this.repos.audit.append({
      actorId: userId,
      action: 'internships.withdraw',
      resourceType: 'internship_application',
      resourceId: applicationId,
      metadata: {},
    });

    return updated;
  }

  async myApplications(userId: string) {
    const apps = await this.repos.internships.listApplicationsByUser(userId);
    const enriched = [];
    for (const app of apps) {
      const internship = await this.repos.internships.findById(app.internshipId);
      enriched.push({
        ...app,
        internship: internship
          ? {
              id: internship.id,
              title: internship.title,
              company: internship.company,
              location: internship.location,
              slug: internship.slug,
            }
          : null,
      });
    }
    return enriched;
  }
}
