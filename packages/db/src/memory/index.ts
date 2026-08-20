import { randomUUID } from 'node:crypto';
import type { CreateUserInput, User } from '@ori6in/shared';
import type { Repositories } from '../ports/index.js';
import type { UserRepository } from '../ports/user.repository.js';
import type { AuditEvent, AuditRepository } from '../ports/audit.repository.js';
import type {
  NotificationRecord,
  NotificationRepository,
} from '../ports/notification.repository.js';
import type { Program, ProgramRepository } from '../ports/program.repository.js';
import type { BlogPost, CmsPage, CmsRepository } from '../ports/cms.repository.js';
import type {
  AuthToken,
  AuthTokenRepository,
} from '../ports/auth-token.repository.js';
import type { Order, OrderRepository } from '../ports/order.repository.js';
import type { Payment, PaymentRepository } from '../ports/payment.repository.js';
import type {
  Course,
  LearningRepository,
  Lesson,
  LessonProgress,
} from '../ports/learning.repository.js';
import type {
  Internship,
  InternshipApplication,
  InternshipRepository,
} from '../ports/internship.repository.js';
import type {
  MentorAssignment,
  MentorRepository,
  MentorReview,
  MentorSession,
  MentorSessionNote,
} from '../ports/mentor.repository.js';
import type {
  ProfileRepository,
  StudentProfile,
} from '../ports/profile.repository.js';
import type {
  ParentMessage,
  ParentMessageThread,
  ParentRepository,
  ParentStudentLink,
} from '../ports/parent.repository.js';
import type {
  Certificate,
  CertificateRepository,
} from '../ports/certificate.repository.js';
import type {
  ComingSoonSignup,
  ComingSoonSignupRepository,
} from '../ports/coming-soon-signup.repository.js';

function now() {
  return new Date();
}

export function createMemoryRepositories(): Repositories {
  const users = new Map<string, User>();
  const authTokens = new Map<string, AuthToken>();
  const audits: AuditEvent[] = [];
  const notifications: NotificationRecord[] = [];
  const profiles = new Map<string, StudentProfile>();
  const programs = new Map<string, Program>();
  const pages = new Map<string, CmsPage>();
  const blogs = new Map<string, BlogPost>();
  const orders = new Map<string, Order>();
  const payments = new Map<string, Payment>();
  const courses = new Map<string, Course>();
  const lessons = new Map<string, Lesson>();
  const progress = new Map<string, LessonProgress>();
  const internships = new Map<string, Internship>();
  const internshipApps = new Map<string, InternshipApplication>();
  const mentorAssignments = new Map<string, MentorAssignment>();
  const mentorReviews = new Map<string, MentorReview>();
  const mentorNotes = new Map<string, MentorSessionNote>();
  const mentorSessions = new Map<string, MentorSession>();
  const certificates = new Map<string, Certificate>();
  const comingSoonSignups = new Map<string, ComingSoonSignup>();

  const userRepo: UserRepository = {
    async findById(id) {
      return users.get(id) ?? null;
    },
    async findByEmail(email) {
      return [...users.values()].find((u) => u.email === email.toLowerCase()) ?? null;
    },
    async create(input: CreateUserInput) {
      const t = now();
      const user: User = {
        id: randomUUID(),
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash ?? null,
        fullName: input.fullName,
        role: input.role,
        emailVerified: input.emailVerified ?? false,
        googleId: input.googleId ?? null,
        createdAt: t,
        updatedAt: t,
      };
      users.set(user.id, user);
      return user;
    },
    async update(id, patch) {
      const existing = users.get(id);
      if (!existing) throw new Error('User not found');
      // One person, one role — role is immutable after create.
      const { role: _role, id: _id, createdAt: _createdAt, ...safe } = patch;
      const updated = { ...existing, ...safe, id, role: existing.role, updatedAt: now() };
      users.set(id, updated);
      return updated;
    },
    async count() {
      return users.size;
    },
    async list({ role, page = 1, pageSize = 20 } = {}) {
      let items = [...users.values()];
      if (role) items = items.filter((u) => u.role === role);
      const total = items.length;
      const start = (page - 1) * pageSize;
      return { items: items.slice(start, start + pageSize), total };
    },
  };

  const authTokenRepo: AuthTokenRepository = {
    async create(input) {
      const row: AuthToken = {
        id: randomUUID(),
        userId: input.userId,
        tokenHash: input.tokenHash,
        purpose: input.purpose,
        expiresAt: input.expiresAt,
        usedAt: null,
        createdAt: now(),
      };
      authTokens.set(row.id, row);
      return row;
    },
    async findValidByHash(purpose, tokenHash) {
      const t = now();
      return (
        [...authTokens.values()].find(
          (row) =>
            row.purpose === purpose &&
            row.tokenHash === tokenHash &&
            row.usedAt === null &&
            row.expiresAt > t,
        ) ?? null
      );
    },
    async markUsed(id) {
      const row = authTokens.get(id);
      if (!row) throw new Error('Auth token not found');
      authTokens.set(id, { ...row, usedAt: now() });
    },
    async invalidateUserPurpose(userId, purpose) {
      const t = now();
      for (const [id, row] of authTokens) {
        if (row.userId === userId && row.purpose === purpose && row.usedAt === null) {
          authTokens.set(id, { ...row, usedAt: t });
        }
      }
    },
  };

  const auditRepo: AuditRepository = {
    async append(event) {
      const row: AuditEvent = {
        id: randomUUID(),
        createdAt: now(),
        ...event,
      };
      audits.push(row);
      return row;
    },
    async listByActor(actorId, limit = 50) {
      return audits.filter((a) => a.actorId === actorId).slice(-limit);
    },
  };

  const notificationRepo: NotificationRepository = {
    async create(input) {
      const row: NotificationRecord = {
        id: randomUUID(),
        read: false,
        createdAt: now(),
        ...input,
      };
      notifications.push(row);
      return row;
    },
    async findById(id) {
      return notifications.find((x) => x.id === id) ?? null;
    },
    async listForUser(userId) {
      return notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async countUnread(userId) {
      return notifications.filter((n) => n.userId === userId && !n.read).length;
    },
    async markRead(id) {
      const n = notifications.find((x) => x.id === id);
      if (n) n.read = true;
    },
    async markAllReadForUser(userId) {
      let count = 0;
      for (const n of notifications) {
        if (n.userId === userId && !n.read) {
          n.read = true;
          count += 1;
        }
      }
      return count;
    },
  };

  const profileRepo: ProfileRepository = {
    async getByUserId(userId) {
      return profiles.get(userId) ?? null;
    },
    async upsert(input) {
      const row: StudentProfile = { ...input, updatedAt: now() };
      profiles.set(input.userId, row);
      return row;
    },
  };

  const programRepo: ProgramRepository = {
    async findById(id) {
      return programs.get(id) ?? null;
    },
    async findBySlug(slug) {
      return [...programs.values()].find((p) => p.slug === slug) ?? null;
    },
    async listPublished(ownOnly = true) {
      return [...programs.values()].filter(
        (p) => p.published && (!ownOnly || p.isOwnProduct),
      );
    },
    async listAll(ownOnly = true) {
      return [...programs.values()]
        .filter((p) => !ownOnly || p.isOwnProduct)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async create(input) {
      const t = now();
      const program: Program = { id: randomUUID(), createdAt: t, updatedAt: t, ...input };
      programs.set(program.id, program);
      return program;
    },
    async update(id, patch) {
      const existing = programs.get(id);
      if (!existing) throw new Error('Program not found');
      const updated = { ...existing, ...patch, id, updatedAt: now() };
      programs.set(id, updated);
      return updated;
    },
  };

  const cmsRepo: CmsRepository = {
    async getPageBySlug(slug) {
      return [...pages.values()].find((p) => p.slug === slug) ?? null;
    },
    async listPages(publishedOnly = true) {
      return [...pages.values()]
        .filter((p) => !publishedOnly || p.published)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    },
    async upsertPage(page) {
      const existing = page.id ? pages.get(page.id) : undefined;
      const id = existing?.id ?? page.id ?? randomUUID();
      const row: CmsPage = {
        id,
        slug: page.slug,
        title: page.title,
        body: page.body,
        published: page.published,
        updatedAt: now(),
      };
      pages.set(id, row);
      return row;
    },
    async listBlogPosts(publishedOnly = true) {
      return [...blogs.values()].filter((b) => !publishedOnly || b.published);
    },
    async getBlogBySlug(slug) {
      return [...blogs.values()].find((b) => b.slug === slug) ?? null;
    },
    async upsertBlogPost(post) {
      const existing = post.id ? blogs.get(post.id) : undefined;
      const t = now();
      const id = existing?.id ?? post.id ?? randomUUID();
      const row: BlogPost = {
        id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        published: post.published,
        createdAt: existing?.createdAt ?? t,
        updatedAt: t,
      };
      blogs.set(id, row);
      return row;
    },
  };

  const orderRepo: OrderRepository = {
    async create(input) {
      const t = now();
      const row: Order = {
        id: randomUUID(),
        userId: input.userId,
        programId: input.programId,
        programTitle: input.programTitle,
        amountCents: input.amountCents,
        currency: input.currency,
        couponCode: input.couponCode ?? null,
        status: input.status,
        paymentId: input.paymentId ?? null,
        paidByUserId: input.paidByUserId ?? null,
        createdAt: t,
        updatedAt: t,
      };
      orders.set(row.id, row);
      return row;
    },
    async findById(id) {
      return orders.get(id) ?? null;
    },
    async listByUser(userId) {
      return [...orders.values()]
        .filter((o) => o.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async findPaidByUserProgram(userId, programId) {
      return (
        [...orders.values()].find(
          (o) => o.userId === userId && o.programId === programId && o.status === 'paid',
        ) ?? null
      );
    },
    async listPaid(limit = 50) {
      return [...orders.values()]
        .filter((o) => o.status === 'paid')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    },
    async countPaid() {
      return [...orders.values()].filter((o) => o.status === 'paid').length;
    },
    async sumPaidAmountCents() {
      return [...orders.values()]
        .filter((o) => o.status === 'paid')
        .reduce((sum, o) => sum + o.amountCents, 0);
    },
    async update(id, patch) {
      const existing = orders.get(id);
      if (!existing) throw new Error('Order not found');
      const { id: _id, createdAt: _c, ...safe } = patch;
      const updated = { ...existing, ...safe, id, updatedAt: now() };
      orders.set(id, updated);
      return updated;
    },
  };

  const paymentRepo: PaymentRepository = {
    async create(input) {
      const t = now();
      const row: Payment = {
        id: randomUUID(),
        ...input,
        createdAt: t,
        updatedAt: t,
      };
      payments.set(row.id, row);
      return row;
    },
    async findById(id) {
      return payments.get(id) ?? null;
    },
    async findByOrderId(orderId) {
      return [...payments.values()].find((p) => p.orderId === orderId) ?? null;
    },
    async update(id, patch) {
      const existing = payments.get(id);
      if (!existing) throw new Error('Payment not found');
      const { id: _id, createdAt: _c, ...safe } = patch;
      const updated = { ...existing, ...safe, id, updatedAt: now() };
      payments.set(id, updated);
      return updated;
    },
  };

  const learningRepo: LearningRepository = {
    async createCourse(input) {
      const t = now();
      const row: Course = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      courses.set(row.id, row);
      return row;
    },
    async findCourseById(id) {
      return courses.get(id) ?? null;
    },
    async findCourseByProgramSlug(programId, slug) {
      return (
        [...courses.values()].find((c) => c.programId === programId && c.slug === slug) ??
        null
      );
    },
    async listCoursesByProgramIds(programIds) {
      const set = new Set(programIds);
      return [...courses.values()]
        .filter((c) => set.has(c.programId) && c.published)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
    },
    async createLesson(input) {
      const t = now();
      const row: Lesson = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      lessons.set(row.id, row);
      return row;
    },
    async findLessonById(id) {
      return lessons.get(id) ?? null;
    },
    async findLessonByCourseSlug(courseId, slug) {
      return (
        [...lessons.values()].find((l) => l.courseId === courseId && l.slug === slug) ?? null
      );
    },
    async listLessonsByCourse(courseId) {
      return [...lessons.values()]
        .filter((l) => l.courseId === courseId && l.published)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },
    async getProgress(userId, lessonId) {
      return (
        [...progress.values()].find((p) => p.userId === userId && p.lessonId === lessonId) ??
        null
      );
    },
    async listProgressForUser(userId) {
      return [...progress.values()].filter((p) => p.userId === userId);
    },
    async markLessonComplete(userId, lessonId) {
      const existing = await learningRepo.getProgress(userId, lessonId);
      if (existing) return existing;
      const row: LessonProgress = {
        id: randomUUID(),
        userId,
        lessonId,
        completedAt: now(),
      };
      progress.set(row.id, row);
      return row;
    },
  };

  const internshipRepo: InternshipRepository = {
    async create(input) {
      const t = now();
      const row: Internship = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      internships.set(row.id, row);
      return row;
    },
    async update(id, input) {
      const existing = internships.get(id);
      if (!existing) return null;
      const row: Internship = { ...existing, ...input, updatedAt: now() };
      internships.set(id, row);
      return row;
    },
    async findById(id) {
      return internships.get(id) ?? null;
    },
    async findBySlug(slug) {
      return [...internships.values()].find((i) => i.slug === slug) ?? null;
    },
    async listPublished() {
      return [...internships.values()]
        .filter((i) => i.published && i.approvalStatus === 'approved')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async listByCompanyUser(companyUserId) {
      return [...internships.values()]
        .filter((i) => i.companyUserId === companyUserId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async listPendingApproval() {
      return [...internships.values()]
        .filter((i) => i.approvalStatus === 'pending_approval')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async createApplication(input) {
      const t = now();
      const row: InternshipApplication = {
        id: randomUUID(),
        userId: input.userId,
        internshipId: input.internshipId,
        notes: input.notes,
        documentKeys: input.documentKeys,
        status: input.status,
        timeline: input.timeline,
        parentDecision: input.parentDecision ?? 'pending',
        parentDecidedAt: input.parentDecidedAt ?? null,
        parentNote: input.parentNote ?? null,
        mentorCompletionDecision: input.mentorCompletionDecision ?? 'pending',
        mentorCompletionNote: input.mentorCompletionNote ?? null,
        mentorCompletionDocKeys: input.mentorCompletionDocKeys ?? [],
        mentorCompletedAt: input.mentorCompletedAt ?? null,
        createdAt: t,
        updatedAt: t,
      };
      internshipApps.set(row.id, row);
      return row;
    },
    async findApplication(userId, internshipId) {
      return (
        [...internshipApps.values()].find(
          (a) => a.userId === userId && a.internshipId === internshipId,
        ) ?? null
      );
    },
    async findApplicationById(id) {
      return internshipApps.get(id) ?? null;
    },
    async listApplicationsByUser(userId) {
      return [...internshipApps.values()]
        .filter((a) => a.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async listApplicationsByInternship(internshipId) {
      return [...internshipApps.values()]
        .filter((a) => a.internshipId === internshipId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async updateApplicationStatus(id, status, note) {
      const existing = internshipApps.get(id);
      if (!existing) return null;
      const t = now();
      const row: InternshipApplication = {
        ...existing,
        status,
        timeline: [...existing.timeline, { at: t, status, note }],
        updatedAt: t,
      };
      internshipApps.set(id, row);
      return row;
    },
    async updateParentDecision(id, decision, note) {
      const existing = internshipApps.get(id);
      if (!existing) return null;
      const t = now();
      const row: InternshipApplication = {
        ...existing,
        parentDecision: decision,
        parentDecidedAt: t,
        parentNote: note ?? null,
        updatedAt: t,
      };
      internshipApps.set(id, row);
      return row;
    },
    async updateMentorCompletion(id, decision, note, documentKeys) {
      const existing = internshipApps.get(id);
      if (!existing) return null;
      const t = now();
      const row: InternshipApplication = {
        ...existing,
        mentorCompletionDecision: decision,
        mentorCompletionNote: note ?? null,
        mentorCompletionDocKeys: documentKeys ?? existing.mentorCompletionDocKeys,
        mentorCompletedAt: t,
        updatedAt: t,
      };
      internshipApps.set(id, row);
      return row;
    },
  };

  const parentLinks = new Map<string, ParentStudentLink>();
  const parentThreads = new Map<string, ParentMessageThread>();
  const parentMessages = new Map<string, ParentMessage>();

  const parentRepo: ParentRepository = {
    async createLink(input) {
      const t = now();
      const row = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      parentLinks.set(row.id, row);
      return row;
    },
    async updateLinkStatus(id, status) {
      const existing = parentLinks.get(id);
      if (!existing) return null;
      const row = { ...existing, status, updatedAt: now() };
      parentLinks.set(id, row);
      return row;
    },
    async findLinkById(id) {
      return parentLinks.get(id) ?? null;
    },
    async findActiveLink(parentUserId, studentUserId) {
      return (
        [...parentLinks.values()].find(
          (l) =>
            l.parentUserId === parentUserId &&
            l.studentUserId === studentUserId &&
            l.status === 'active',
        ) ?? null
      );
    },
    async listLinksByParent(parentUserId) {
      return [...parentLinks.values()]
        .filter((l) => l.parentUserId === parentUserId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async listLinksByStudent(studentUserId) {
      return [...parentLinks.values()]
        .filter((l) => l.studentUserId === studentUserId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async findPrimaryActiveStudent(parentUserId) {
      return (
        [...parentLinks.values()]
          .filter((l) => l.parentUserId === parentUserId && l.status === 'active')
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0] ?? null
      );
    },
    async createThread(input) {
      const t = now();
      const row = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      parentThreads.set(row.id, row);
      return row;
    },
    async findThreadById(id) {
      return parentThreads.get(id) ?? null;
    },
    async listThreadsByParent(parentUserId) {
      return [...parentThreads.values()]
        .filter((t) => t.parentUserId === parentUserId)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    },
    async touchThread(id) {
      const existing = parentThreads.get(id);
      if (!existing) return;
      parentThreads.set(id, { ...existing, updatedAt: now() });
    },
    async createMessage(input) {
      const row = { id: randomUUID(), ...input, createdAt: now() };
      parentMessages.set(row.id, row);
      await parentRepo.touchThread(input.threadId);
      return row;
    },
    async listMessages(threadId) {
      return [...parentMessages.values()]
        .filter((m) => m.threadId === threadId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    },
  };

  const certificateRepo: CertificateRepository = {
    async create(input) {
      const row: Certificate = {
        id: randomUUID(),
        ...input,
        createdAt: now(),
      };
      certificates.set(row.id, row);
      return row;
    },
    async findById(id) {
      return certificates.get(id) ?? null;
    },
    async findByCode(code) {
      return [...certificates.values()].find((c) => c.code === code) ?? null;
    },
    async findByUserProgram(userId, programId) {
      return (
        [...certificates.values()].find(
          (c) => c.userId === userId && c.programId === programId,
        ) ?? null
      );
    },
    async listByUser(userId) {
      return [...certificates.values()]
        .filter((c) => c.userId === userId)
        .sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime());
    },
    async listAll(limit = 50) {
      return [...certificates.values()]
        .sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime())
        .slice(0, limit);
    },
  };

  const comingSoonSignupRepo: ComingSoonSignupRepository = {
    async upsert(input) {
      const email = input.email.trim().toLowerCase();
      const name = input.name?.trim() || null;
      const existing = [...comingSoonSignups.values()].find((s) => s.email === email);
      if (existing) {
        const updated: ComingSoonSignup = {
          ...existing,
          name: name ?? existing.name,
          updatedAt: now(),
        };
        comingSoonSignups.set(updated.id, updated);
        return { signup: updated, created: false };
      }
      const signup: ComingSoonSignup = {
        id: randomUUID(),
        email,
        name,
        createdAt: now(),
        updatedAt: now(),
        announcedAt: null,
      };
      comingSoonSignups.set(signup.id, signup);
      return { signup, created: true };
    },
    async findByEmail(email) {
      const normalized = email.trim().toLowerCase();
      return [...comingSoonSignups.values()].find((s) => s.email === normalized) ?? null;
    },
    async listAll(limit = 500) {
      return [...comingSoonSignups.values()]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
    },
    async listPendingAnnounce(limit = 500) {
      return [...comingSoonSignups.values()]
        .filter((s) => s.announcedAt == null)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .slice(0, limit);
    },
    async markAnnounced(ids, at) {
      let n = 0;
      for (const id of ids) {
        const row = comingSoonSignups.get(id);
        if (!row || row.announcedAt) continue;
        comingSoonSignups.set(id, { ...row, announcedAt: at, updatedAt: now() });
        n += 1;
      }
      return n;
    },
    async count() {
      return comingSoonSignups.size;
    },
  };

  const mentorRepo: MentorRepository = {
    async createAssignment(input) {
      const t = now();
      const row: MentorAssignment = {
        id: randomUUID(),
        ...input,
        createdAt: t,
        updatedAt: t,
      };
      mentorAssignments.set(row.id, row);
      return row;
    },
    async findAssignment(mentorId, studentId) {
      return (
        [...mentorAssignments.values()].find(
          (a) =>
            a.mentorId === mentorId &&
            a.studentId === studentId &&
            a.status === 'active',
        ) ?? null
      );
    },
    async listAssignmentsByMentor(mentorId) {
      return [...mentorAssignments.values()]
        .filter((a) => a.mentorId === mentorId && a.status === 'active')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async listAssignmentsByStudent(studentId) {
      return [...mentorAssignments.values()]
        .filter((a) => a.studentId === studentId && a.status === 'active')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async createReview(input) {
      const t = now();
      const row: MentorReview = {
        id: randomUUID(),
        ...input,
        status: input.status ?? 'published',
        templateKey: input.templateKey ?? null,
        documentKeys: input.documentKeys ?? [],
        createdAt: t,
        updatedAt: t,
      };
      mentorReviews.set(row.id, row);
      return row;
    },
    async updateReview(id, patch) {
      const existing = mentorReviews.get(id);
      if (!existing) return null;
      const row: MentorReview = { ...existing, ...patch, updatedAt: now() };
      mentorReviews.set(id, row);
      return row;
    },
    async findReviewById(id) {
      return mentorReviews.get(id) ?? null;
    },
    async listReviewsByMentor(mentorId) {
      return [...mentorReviews.values()]
        .filter((r) => r.mentorId === mentorId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async createSessionNote(input) {
      const row: MentorSessionNote = {
        id: randomUUID(),
        ...input,
        createdAt: now(),
      };
      mentorNotes.set(row.id, row);
      return row;
    },
    async listSessionNotes(mentorId, studentId) {
      return [...mentorNotes.values()]
        .filter(
          (n) =>
            n.mentorId === mentorId && (!studentId || n.studentId === studentId),
        )
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
    async createSession(input) {
      const t = now();
      const row: MentorSession = {
        id: randomUUID(),
        ...input,
        createdAt: t,
        updatedAt: t,
      };
      mentorSessions.set(row.id, row);
      return row;
    },
    async findSessionById(id) {
      return mentorSessions.get(id) ?? null;
    },
    async listSessionsByMentor(mentorId) {
      return [...mentorSessions.values()]
        .filter((s) => s.mentorId === mentorId)
        .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    },
    async listSessionsByStudent(studentId) {
      return [...mentorSessions.values()]
        .filter((s) => s.studentId === studentId)
        .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    },
    async updateSession(id, patch) {
      const existing = mentorSessions.get(id);
      if (!existing) return null;
      const row: MentorSession = { ...existing, ...patch, updatedAt: now() };
      mentorSessions.set(id, row);
      return row;
    },
  };

  return {
    users: userRepo,
    authTokens: authTokenRepo,
    audit: auditRepo,
    notifications: notificationRepo,
    programs: programRepo,
    cms: cmsRepo,
    orders: orderRepo,
    payments: paymentRepo,
    learning: learningRepo,
    internships: internshipRepo,
    mentors: mentorRepo,
    profiles: profileRepo,
    parent: parentRepo,
    certificates: certificateRepo,
    comingSoonSignups: comingSoonSignupRepo,
    async disconnect() {},
  };
}
