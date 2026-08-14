import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { Repositories } from '@ori6in/db';
import {
  assignMentorSchema,
  createCompanySchema,
  Role,
} from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

function publicUser(user: {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  emailVerified: boolean;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

@Injectable()
export class AdminService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  async dashboard() {
    const [
      users,
      students,
      mentors,
      companies,
      programs,
      paidOrders,
      revenueCents,
      pages,
      posts,
      internships,
      pendingInternshipApprovals,
    ] = await Promise.all([
      this.repos.users.count(),
      this.repos.users.list({ role: Role.Student, pageSize: 1 }),
      this.repos.users.list({ role: Role.Mentor, pageSize: 1 }),
      this.repos.users.list({ role: Role.Company, pageSize: 1 }),
      this.repos.programs.listAll(true),
      this.repos.orders.countPaid(),
      this.repos.orders.sumPaidAmountCents(),
      this.repos.cms.listPages(false),
      this.repos.cms.listBlogPosts(false),
      this.repos.internships.listPublished(),
      this.repos.internships.listPendingApproval(),
    ]);

    const recentPaid = await this.repos.orders.listPaid(5);

    return {
      statistics: {
        users,
        students: students.total,
        mentors: mentors.total,
        companies: companies.total,
        programs: programs.length,
        publishedPrograms: programs.filter((p) => p.published).length,
        paidOrders,
        cmsPages: pages.length,
        blogPosts: posts.length,
        internships: internships.length,
        pendingInternshipApprovals: pendingInternshipApprovals.length,
      },
      revenue: {
        amountCents: revenueCents,
        currency: 'INR',
      },
      recentPaidOrders: recentPaid.map((o) => ({
        id: o.id,
        programTitle: o.programTitle,
        amountCents: o.amountCents,
        currency: o.currency,
        createdAt: o.createdAt,
      })),
    };
  }

  async listUsers(role?: string) {
    const result = await this.repos.users.list({
      role: role || undefined,
      pageSize: 200,
    });
    return {
      total: result.total,
      items: result.items.map(publicUser),
    };
  }

  async createCompany(actorId: string, body: unknown) {
    const parsed = createCompanySchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const existing = await this.repos.users.findByEmail(parsed.data.email);
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await this.repos.users.create({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      role: Role.Company,
      passwordHash,
      emailVerified: true,
    });

    await this.repos.audit.append({
      actorId,
      action: 'admin.create_company',
      resourceType: 'user',
      resourceId: user.id,
    });

    return publicUser(user);
  }

  async assignMentor(actorId: string, body: unknown) {
    const parsed = assignMentorSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const mentor = await this.repos.users.findById(parsed.data.mentorId);
    if (!mentor || mentor.role !== Role.Mentor) {
      throw new BadRequestException('mentorId must be a mentor user');
    }
    const student = await this.repos.users.findById(parsed.data.studentId);
    if (!student || student.role !== Role.Student) {
      throw new BadRequestException('studentId must be a student user');
    }
    const program = await this.repos.programs.findById(parsed.data.programId);
    if (!program) throw new NotFoundException('Program not found');

    const existing = await this.repos.mentors.findAssignment(
      parsed.data.mentorId,
      parsed.data.studentId,
    );
    if (existing) {
      throw new BadRequestException(`Already assigned (assignment ${existing.id})`);
    }

    const assignment = await this.repos.mentors.createAssignment({
      mentorId: parsed.data.mentorId,
      studentId: parsed.data.studentId,
      programId: parsed.data.programId,
      status: 'active',
    });

    await this.repos.notifications.create({
      userId: student.id,
      channel: 'in_app',
      title: 'Mentor assigned',
      body: `${mentor.fullName} is now your mentor for ${program.title}.`,
    });

    await this.repos.audit.append({
      actorId,
      action: 'admin.assign_mentor',
      resourceType: 'mentor_assignment',
      resourceId: assignment.id,
      metadata: {
        mentorId: mentor.id,
        studentId: student.id,
        programId: program.id,
      },
    });

    return {
      assignment,
      mentor: publicUser(mentor),
      student: publicUser(student),
      program: { id: program.id, title: program.title, slug: program.slug },
    };
  }

  async listMentorsDirectory() {
    const { items } = await this.repos.users.list({
      role: Role.Mentor,
      pageSize: 100,
    });
    const directory = [];
    for (const mentor of items) {
      const [assignments, profile] = await Promise.all([
        this.repos.mentors.listAssignmentsByMentor(mentor.id),
        this.repos.profiles.getByUserId(mentor.id),
      ]);
      directory.push({
        id: mentor.id,
        fullName: mentor.fullName,
        title: profile?.headline || 'ORI6IN Mentor',
        bio:
          profile?.bio ||
          `Mentors ${assignments.length} active student${assignments.length === 1 ? '' : 's'} on ORI6IN.`,
        skills:
          profile?.skills?.length ? profile.skills : ['Mentorship', 'Career growth'],
        location: profile?.location || '',
        assignedStudents: assignments.length,
      });
    }
    return directory;
  }

  async getMentorDirectoryDetail(id: string) {
    const mentor = await this.repos.users.findById(id);
    if (!mentor || mentor.role !== Role.Mentor) {
      throw new NotFoundException('Mentor not found');
    }
    const [assignments, profile] = await Promise.all([
      this.repos.mentors.listAssignmentsByMentor(id),
      this.repos.profiles.getByUserId(id),
    ]);
    return {
      id: mentor.id,
      fullName: mentor.fullName,
      title: profile?.headline || 'ORI6IN Mentor',
      bio:
        profile?.bio ||
        'Guides learners through ORI6IN programs with reviews and session notes.',
      skills:
        profile?.skills?.length ? profile.skills : ['Mentorship', 'Career growth'],
      location: profile?.location || '',
      assignedStudents: assignments.length,
    };
  }
}
