import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { AppConfig } from '@ori6in/config';
import type { Repositories } from '@ori6in/db';
import {
  DEMO_CURRICULUM,
  DEMO_EMAIL_DOMAIN,
  DEMO_INTERNSHIPS,
  DEMO_MENTORS,
  DEMO_PAGES,
  DEMO_PASSWORD,
  DEMO_POSTS,
  DEMO_PROGRAMS,
  DEMO_STUDENT_PROFILE,
  Role,
  demoMentorEmail,
} from '@ori6in/shared';
import { APP_CONFIG, REPOSITORIES } from '../../common/database.service';
import { DemoAccountsService } from './demo-accounts.service';

@Injectable()
export class DemoContentService implements OnModuleInit {
  private readonly log = new Logger(DemoContentService.name);

  constructor(
    @Inject(REPOSITORIES) private readonly repos: Repositories,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
    /** Ensures demo login users exist before content that references them. */
    private readonly _demoAccounts: DemoAccountsService,
  ) {}

  async onModuleInit() {
    if (!this.config.ENABLE_DEMO_LOGINS) return;

    for (const program of DEMO_PROGRAMS) {
      const existing = await this.repos.programs.findBySlug(program.slug);
      if (existing) {
        await this.repos.programs.update(existing.id, { ...program });
      } else {
        await this.repos.programs.create({ ...program });
        this.log.log(`Seeded demo program ${program.slug}`);
      }
    }

    for (const page of DEMO_PAGES) {
      await this.repos.cms.upsertPage({ ...page });
    }

    for (const post of DEMO_POSTS) {
      await this.repos.cms.upsertBlogPost({ ...post });
    }

    await this.seedCurriculum();
    await this.seedDemoStudentEnrollment();
    await this.seedInternships();
    await this.seedMentorsDirectory();
    await this.seedMentorAssignment();
    await this.seedMentorSessions();
    await this.seedDemoStudentProfile();
    await this.seedDemoParentAlerts();
    await this.seedParentLinkingAndMessages();
    await this.seedDemoCertificate();

    this.log.log('Demo catalog synced from @ori6in/shared demo-content');
  }

  private async seedCurriculum() {
    for (const [programSlug, courses] of Object.entries(DEMO_CURRICULUM)) {
      const program = await this.repos.programs.findBySlug(programSlug);
      if (!program) continue;

      for (const courseDef of courses) {
        let course = await this.repos.learning.findCourseByProgramSlug(
          program.id,
          courseDef.slug,
        );
        if (!course) {
          course = await this.repos.learning.createCourse({
            programId: program.id,
            title: courseDef.title,
            slug: courseDef.slug,
            summary: courseDef.summary,
            sortOrder: courseDef.sortOrder,
            published: true,
          });
          this.log.log(`Seeded course ${programSlug}/${courseDef.slug}`);
        }

        for (const lessonDef of courseDef.lessons) {
          const existing = await this.repos.learning.findLessonByCourseSlug(
            course.id,
            lessonDef.slug,
          );
          if (existing) continue;
          await this.repos.learning.createLesson({
            courseId: course.id,
            title: lessonDef.title,
            slug: lessonDef.slug,
            content: lessonDef.content,
            sortOrder: lessonDef.sortOrder,
            published: true,
          });
        }
      }
    }
  }

  private async seedDemoStudentEnrollment() {
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);
    const program = await this.repos.programs.findBySlug('career-launchpad');
    if (!student || !program) return;

    const paid = await this.repos.orders.findPaidByUserProgram(student.id, program.id);
    if (paid) return;

    await this.repos.orders.create({
      userId: student.id,
      programId: program.id,
      programTitle: program.title,
      amountCents: 0,
      currency: program.currency,
      couponCode: 'DEMO',
      status: 'paid',
    });
    this.log.log('Seeded demo student enrollment for career-launchpad');
  }

  private async seedInternships() {
    const company = await this.repos.users.findByEmail(`company@${DEMO_EMAIL_DOMAIN}`);
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);

    for (const listing of DEMO_INTERNSHIPS) {
      let existing = await this.repos.internships.findBySlug(listing.slug);
      if (!existing) {
        existing = await this.repos.internships.create({
          ...listing,
          companyUserId: company?.id ?? null,
        });
        this.log.log(`Seeded internship ${listing.slug}`);
      } else if (company && !existing.companyUserId) {
        await this.repos.internships.update(existing.id, {
          companyUserId: company.id,
          approvalStatus: listing.approvalStatus,
          paymentStatus: listing.paymentStatus,
          published: listing.published,
        });
      }
    }

    // Seed one demo application so company applicants + mentor completion queues are non-empty
    if (student) {
      const role = await this.repos.internships.findBySlug('frontend-intern');
      if (role) {
        let existingApp = await this.repos.internships.findApplication(student.id, role.id);
        if (!existingApp) {
          existingApp = await this.repos.internships.createApplication({
            userId: student.id,
            internshipId: role.id,
            notes: 'Demo application for company pipeline walkthrough.',
            documentKeys: [],
            status: 'offered',
            timeline: [
              { at: new Date(), status: 'applied', note: 'Applied via demo seed' },
              { at: new Date(), status: 'offered', note: 'Offer extended for mentor completion demo' },
            ],
            parentDecision: 'approved',
            parentDecidedAt: new Date(),
            parentNote: 'Parent approved for demo',
            mentorCompletionDecision: 'pending',
            mentorCompletionNote: null,
            mentorCompletionDocKeys: [],
            mentorCompletedAt: null,
          });
          this.log.log('Seeded demo internship application');
        } else if (existingApp.status === 'applied') {
          await this.repos.internships.updateApplicationStatus(
            existingApp.id,
            'offered',
            'Offer extended for mentor completion demo',
          );
          this.log.log('Updated demo internship application to offered');
        }
      }
    }
  }

  /** Create / sync all public mentor personas + profile fields from the shared catalog. */
  private async seedMentorsDirectory() {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    for (const persona of DEMO_MENTORS) {
      const email = demoMentorEmail(persona.emailLocalPart);
      let user = await this.repos.users.findByEmail(email);

      if (!user) {
        user = await this.repos.users.create({
          email,
          passwordHash,
          fullName: persona.fullName,
          role: Role.Mentor,
          emailVerified: true,
        });
        this.log.log(`Seeded mentor ${email}`);
      } else {
        await this.repos.users.update(user.id, {
          fullName: persona.fullName,
          role: Role.Mentor,
          emailVerified: true,
        });
      }

      await this.repos.profiles.upsert({
        userId: user.id,
        headline: persona.title,
        bio: persona.bio,
        phone: '',
        location: persona.location,
        skills: [...persona.skills],
        education: [],
        experience: [],
        projects: [],
      });
    }
  }

  private async seedMentorAssignment() {
    const primary = DEMO_MENTORS.find((m) => m.primaryLogin) ?? DEMO_MENTORS[0];
    const mentor = await this.repos.users.findByEmail(
      demoMentorEmail(primary.emailLocalPart),
    );
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);
    const program = await this.repos.programs.findBySlug('career-launchpad');
    if (!mentor || !student || !program) return;

    const existing = await this.repos.mentors.findAssignment(mentor.id, student.id);
    if (existing) return;

    await this.repos.mentors.createAssignment({
      mentorId: mentor.id,
      studentId: student.id,
      programId: program.id,
      status: 'active',
    });
    this.log.log('Seeded mentor assignment (primary mentor ↔ student / career-launchpad)');
  }

  private async seedMentorSessions() {
    const primary = DEMO_MENTORS.find((m) => m.primaryLogin) ?? DEMO_MENTORS[0];
    const mentor = await this.repos.users.findByEmail(
      demoMentorEmail(primary.emailLocalPart),
    );
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);
    const program = await this.repos.programs.findBySlug('career-launchpad');
    if (!mentor || !student) return;

    const existing = await this.repos.mentors.listSessionsByMentor(mentor.id);
    if (existing.length > 0) return;

    const startsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    startsAt.setMinutes(0, 0, 0);
    await this.repos.mentors.createSession({
      mentorId: mentor.id,
      studentId: student.id,
      programId: program?.id ?? null,
      topic: 'Career Launchpad weekly check-in',
      startsAt,
      endsAt: new Date(startsAt.getTime() + 45 * 60 * 1000),
      status: 'scheduled',
      meetingUrl: null,
    });
    this.log.log('Seeded demo mentor session');
  }

  private async seedDemoStudentProfile() {
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);
    if (!student) return;

    await this.repos.profiles.upsert({
      userId: student.id,
      headline: DEMO_STUDENT_PROFILE.headline,
      bio: DEMO_STUDENT_PROFILE.bio,
      phone: DEMO_STUDENT_PROFILE.phone,
      location: DEMO_STUDENT_PROFILE.location,
      skills: [...DEMO_STUDENT_PROFILE.skills],
      education: DEMO_STUDENT_PROFILE.education.map((e) => ({ ...e })),
      experience: [...DEMO_STUDENT_PROFILE.experience],
      projects: DEMO_STUDENT_PROFILE.projects.map((p) => ({ ...p })),
    });

    const notes = await this.repos.notifications.listForUser(student.id);
    if (notes.length === 0) {
      await this.repos.notifications.create({
        userId: student.id,
        channel: 'in_app',
        title: 'Welcome to ORI6IN',
        body: 'Your student portal is ready. Complete your profile and explore Career Launchpad.',
      });
      await this.repos.notifications.create({
        userId: student.id,
        channel: 'in_app',
        title: 'Mentor assigned',
        body: 'You have been paired with a mentor on Career Launchpad. Check your courses to get started.',
      });
      this.log.log('Seeded demo student notifications');
    }
  }

  private async seedDemoParentAlerts() {
    const parentUser = await this.repos.users.findByEmail('parent@demo.ori6in.test');
    if (!parentUser) return;
    const notes = await this.repos.notifications.listForUser(parentUser.id);
    if (notes.length > 0) return;
    await this.repos.notifications.create({
      userId: parentUser.id,
      channel: 'in_app',
      title: 'Linked student update',
      body: 'Demo Student enrolled in Career Launchpad. Track progress from the Parent portal.',
    });
    await this.repos.notifications.create({
      userId: parentUser.id,
      channel: 'in_app',
      title: 'Internship application',
      body: 'Your linked student may apply to internships — review Approvals when needed.',
    });
    this.log.log('Seeded demo parent alerts');
  }

  private async seedParentLinkingAndMessages() {
    const parent = await this.repos.users.findByEmail(`parent@${DEMO_EMAIL_DOMAIN}`);
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);
    if (!parent || !student) return;

    let link = await this.repos.parent.findActiveLink(parent.id, student.id);
    if (!link) {
      const existing = (await this.repos.parent.listLinksByParent(parent.id)).find(
        (l) => l.studentUserId === student.id,
      );
      if (existing?.status === 'pending') {
        link = await this.repos.parent.updateLinkStatus(existing.id, 'active');
      } else if (!existing || existing.status === 'revoked') {
        link = await this.repos.parent.createLink({
          parentUserId: parent.id,
          studentUserId: student.id,
          status: 'active',
          inviteEmail: student.email,
        });
        this.log.log('Seeded demo parent ↔ student link');
      }
    }

    const threads = await this.repos.parent.listThreadsByParent(parent.id);
    if (threads.length === 0 && link) {
      const thread = await this.repos.parent.createThread({
        parentUserId: parent.id,
        studentUserId: student.id,
        participantUserId: student.id,
        participantRole: 'student',
        topic: 'Weekly check-in',
      });
      await this.repos.parent.createMessage({
        threadId: thread.id,
        senderUserId: student.id,
        body: 'Hi — I finished the first Career Launchpad lessons this week.',
      });
      await this.repos.parent.createMessage({
        threadId: thread.id,
        senderUserId: parent.id,
        body: 'Proud of you! Keep going — I’ll review your internship applications here.',
      });
      this.log.log('Seeded demo parent messaging thread');
    }
  }

  private async seedDemoCertificate() {
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);
    const program = await this.repos.programs.findBySlug('career-launchpad');
    if (!student || !program) return;

    const existing = await this.repos.certificates.findByUserProgram(student.id, program.id);
    if (existing) return;

    // Mark all published lessons complete so eligibility matches a finished program
    const courses = await this.repos.learning.listCoursesByProgramIds([program.id]);
    for (const course of courses.filter((c) => c.published)) {
      const lessons = await this.repos.learning.listLessonsByCourse(course.id);
      for (const lesson of lessons.filter((l) => l.published)) {
        await this.repos.learning.markLessonComplete(student.id, lesson.id);
      }
    }

    await this.repos.certificates.create({
      userId: student.id,
      programId: program.id,
      code: 'ORI6IN-DEMO01',
      title: `Certificate of Completion — ${program.title}`,
      recipientName: student.fullName,
      programTitle: program.title,
      issuedAt: new Date(),
    });
    this.log.log('Seeded demo certificate for Career Launchpad');
  }
}
