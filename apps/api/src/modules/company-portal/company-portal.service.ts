import { Inject, Injectable } from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { REPOSITORIES } from '../../common/database.service';

@Injectable()
export class CompanyPortalService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  async dashboard(companyUserId: string) {
    const listings = await this.repos.internships.listPublished();
    const applicants = await this.collectApplicants(listings.map((l) => l.id));
    const interviews = applicants.filter((a) => a.status === 'interview').length;

    return {
      companyUserId,
      openRoles: listings.length,
      applicants: applicants.length,
      interviews,
      recentListings: listings.slice(0, 5).map((l) => ({
        id: l.id,
        title: l.title,
        location: l.location,
        published: l.published,
      })),
    };
  }

  async internships() {
    const listings = await this.repos.internships.listPublished();
    return {
      items: listings.map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        company: l.company,
        location: l.location,
        description: l.description,
        published: l.published,
        createdAt: l.createdAt,
      })),
    };
  }

  async applicants() {
    const listings = await this.repos.internships.listPublished();
    const items = await this.collectApplicants(listings.map((l) => l.id));
    return { items };
  }

  async interviews() {
    const listings = await this.repos.internships.listPublished();
    const applicants = await this.collectApplicants(listings.map((l) => l.id));
    const interviewApps = applicants.filter(
      (a) => a.status === 'interview' || a.status === 'under_review',
    );

    if (interviewApps.length === 0 && listings[0]) {
      return {
        items: [
          {
            id: 'demo-interview-1',
            applicantName: 'Demo Student',
            roleTitle: listings[0].title,
            scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            mode: 'Video',
            status: 'scheduled',
          },
        ],
      };
    }

    return {
      items: interviewApps.map((a, i) => ({
        id: `interview-${a.id}`,
        applicantName: a.applicantName,
        roleTitle: a.roleTitle,
        scheduledAt: new Date(Date.now() + (i + 2) * 24 * 60 * 60 * 1000).toISOString(),
        mode: i % 2 === 0 ? 'Video' : 'On-site',
        status: a.status === 'interview' ? 'scheduled' : 'to_schedule',
      })),
    };
  }

  private async collectApplicants(internshipIds: string[]) {
    const { items: students } = await this.repos.users.list({
      role: 'student',
      pageSize: 100,
    });
    const rows = [];
    for (const student of students) {
      const apps = await this.repos.internships.listApplicationsByUser(student.id);
      for (const app of apps) {
        if (!internshipIds.includes(app.internshipId)) continue;
        const role = await this.repos.internships.findById(app.internshipId);
        rows.push({
          id: app.id,
          internshipId: app.internshipId,
          roleTitle: role?.title ?? 'Role',
          company: role?.company ?? '',
          applicantId: student.id,
          applicantName: student.fullName,
          applicantEmail: student.email,
          status: app.status,
          notes: app.notes,
          createdAt: app.createdAt,
        });
      }
    }
    return rows;
  }
}
