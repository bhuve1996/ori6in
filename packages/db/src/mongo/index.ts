import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';
import type { AppConfig } from '@ori6in/config';
import type { CreateUserInput, Role, User } from '@ori6in/shared';
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

export async function createMongoRepositories(config: AppConfig): Promise<Repositories> {
  const client = new MongoClient(config.MONGO_URL);
  await client.connect();
  const db = client.db();

  const usersCol = db.collection<User>('users');
  const authTokensCol = db.collection<AuthToken>('auth_tokens');
  const auditCol = db.collection<AuditEvent>('audit_events');
  const notifCol = db.collection<NotificationRecord>('notifications');
  const profilesCol = db.collection<StudentProfile>('student_profiles');
  const programsCol = db.collection<Program>('programs');
  const pagesCol = db.collection<CmsPage>('cms_pages');
  const blogsCol = db.collection<BlogPost>('blog_posts');
  const ordersCol = db.collection<Order>('orders');
  const paymentsCol = db.collection<Payment>('payments');
  const coursesCol = db.collection<Course>('courses');
  const lessonsCol = db.collection<Lesson>('lessons');
  const progressCol = db.collection<LessonProgress>('lesson_progress');
  const internshipsCol = db.collection<Internship>('internships');
  const internshipAppsCol = db.collection<InternshipApplication>('internship_applications');
  const mentorAssignmentsCol = db.collection<MentorAssignment>('mentor_assignments');
  const mentorReviewsCol = db.collection<MentorReview>('mentor_reviews');
  const mentorNotesCol = db.collection<MentorSessionNote>('mentor_session_notes');
  const mentorSessionsCol = db.collection<MentorSession>('mentor_sessions');
  const parentLinksCol = db.collection<ParentStudentLink>('parent_student_links');
  const parentThreadsCol = db.collection<ParentMessageThread>('parent_message_threads');
  const parentMessagesCol = db.collection<ParentMessage>('parent_messages');
  const certificatesCol = db.collection<Certificate>('certificates');

  await usersCol.createIndex({ email: 1 }, { unique: true });
  await authTokensCol.createIndex({ tokenHash: 1, purpose: 1 });
  await programsCol.createIndex({ slug: 1 }, { unique: true });
  await pagesCol.createIndex({ slug: 1 }, { unique: true });
  await blogsCol.createIndex({ slug: 1 }, { unique: true });
  await ordersCol.createIndex({ userId: 1, createdAt: -1 });
  await paymentsCol.createIndex({ orderId: 1 });
  await coursesCol.createIndex({ programId: 1, slug: 1 }, { unique: true });
  await lessonsCol.createIndex({ courseId: 1, slug: 1 }, { unique: true });
  await progressCol.createIndex({ userId: 1, lessonId: 1 }, { unique: true });
  await internshipsCol.createIndex({ slug: 1 }, { unique: true });
  await internshipAppsCol.createIndex({ userId: 1, internshipId: 1 }, { unique: true });
  await mentorAssignmentsCol.createIndex({ mentorId: 1, studentId: 1 });
  await mentorSessionsCol.createIndex({ mentorId: 1, startsAt: 1 });
  await mentorSessionsCol.createIndex({ studentId: 1, startsAt: 1 });
  await profilesCol.createIndex({ userId: 1 }, { unique: true });
  await parentLinksCol.createIndex({ parentUserId: 1, createdAt: -1 });
  await parentLinksCol.createIndex({ studentUserId: 1, createdAt: -1 });
  await parentLinksCol.createIndex({ parentUserId: 1, studentUserId: 1, status: 1 });
  await parentThreadsCol.createIndex({ parentUserId: 1, updatedAt: -1 });
  await parentMessagesCol.createIndex({ threadId: 1, createdAt: 1 });
  await certificatesCol.createIndex({ code: 1 }, { unique: true });
  await certificatesCol.createIndex({ userId: 1, programId: 1 }, { unique: true });

  const users: UserRepository = {
    async findById(id) {
      return (await usersCol.findOne({ id })) ?? null;
    },
    async findByEmail(email) {
      return (await usersCol.findOne({ email: email.toLowerCase() })) ?? null;
    },
    async create(input: CreateUserInput) {
      const t = new Date();
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
      await usersCol.insertOne(user);
      return user;
    },
    async update(id, patch) {
      const existing = await users.findById(id);
      if (!existing) throw new Error('User not found');
      // One person, one role — role is immutable after create.
      const { role: _role, id: _id, createdAt: _createdAt, ...safe } = patch;
      const updated = {
        ...existing,
        ...safe,
        id,
        role: existing.role,
        updatedAt: new Date(),
      };
      await usersCol.replaceOne({ id }, updated);
      return updated;
    },
    async count() {
      return usersCol.countDocuments();
    },
    async list({ role, page = 1, pageSize = 20 } = {}) {
      const filter: { role?: Role } = role ? { role: role as Role } : {};
      const total = await usersCol.countDocuments(filter);
      const items = await usersCol
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();
      return { items, total };
    },
  };

  const authTokens: AuthTokenRepository = {
    async create(input) {
      const row: AuthToken = {
        id: randomUUID(),
        userId: input.userId,
        tokenHash: input.tokenHash,
        purpose: input.purpose,
        expiresAt: input.expiresAt,
        usedAt: null,
        createdAt: new Date(),
      };
      await authTokensCol.insertOne(row);
      return row;
    },
    async findValidByHash(purpose, tokenHash) {
      return (
        (await authTokensCol.findOne({
          purpose,
          tokenHash,
          usedAt: null,
          expiresAt: { $gt: new Date() },
        })) ?? null
      );
    },
    async markUsed(id) {
      await authTokensCol.updateOne({ id }, { $set: { usedAt: new Date() } });
    },
    async invalidateUserPurpose(userId, purpose) {
      await authTokensCol.updateMany(
        { userId, purpose, usedAt: null },
        { $set: { usedAt: new Date() } },
      );
    },
  };

  const audit: AuditRepository = {
    async append(event) {
      const row: AuditEvent = { id: randomUUID(), createdAt: new Date(), ...event };
      await auditCol.insertOne(row);
      return row;
    },
    async listByActor(actorId, limit = 50) {
      return auditCol.find({ actorId }).sort({ createdAt: -1 }).limit(limit).toArray();
    },
  };

  const notifications: NotificationRepository = {
    async create(input) {
      const row: NotificationRecord = {
        id: randomUUID(),
        read: false,
        createdAt: new Date(),
        ...input,
      };
      await notifCol.insertOne(row);
      return row;
    },
    async findById(id) {
      return (await notifCol.findOne({ id })) ?? null;
    },
    async listForUser(userId) {
      return notifCol.find({ userId }).sort({ createdAt: -1 }).toArray();
    },
    async countUnread(userId) {
      return notifCol.countDocuments({ userId, read: false });
    },
    async markRead(id) {
      await notifCol.updateOne({ id }, { $set: { read: true } });
    },
    async markAllReadForUser(userId) {
      const result = await notifCol.updateMany(
        { userId, read: false },
        { $set: { read: true } },
      );
      return result.modifiedCount;
    },
  };

  const profiles: ProfileRepository = {
    async getByUserId(userId) {
      return (await profilesCol.findOne({ userId })) ?? null;
    },
    async upsert(input) {
      const row: StudentProfile = { ...input, updatedAt: new Date() };
      await profilesCol.updateOne({ userId: input.userId }, { $set: row }, { upsert: true });
      return row;
    },
  };

  const programs: ProgramRepository = {
    async findById(id) {
      return (await programsCol.findOne({ id })) ?? null;
    },
    async findBySlug(slug) {
      return (await programsCol.findOne({ slug })) ?? null;
    },
    async listPublished(ownOnly = true) {
      const filter: Record<string, unknown> = { published: true };
      if (ownOnly) filter.isOwnProduct = true;
      return programsCol.find(filter).sort({ createdAt: -1 }).toArray();
    },
    async listAll(ownOnly = true) {
      const filter: Record<string, unknown> = {};
      if (ownOnly) filter.isOwnProduct = true;
      return programsCol.find(filter).sort({ createdAt: -1 }).toArray();
    },
    async create(input) {
      const t = new Date();
      const program: Program = { id: randomUUID(), createdAt: t, updatedAt: t, ...input };
      await programsCol.insertOne(program);
      return program;
    },
    async update(id, patch) {
      const existing = await programs.findById(id);
      if (!existing) throw new Error('Program not found');
      const updated = { ...existing, ...patch, id, updatedAt: new Date() };
      await programsCol.replaceOne({ id }, updated);
      return updated;
    },
  };

  const cms: CmsRepository = {
    async getPageBySlug(slug) {
      return (await pagesCol.findOne({ slug })) ?? null;
    },
    async listPages(publishedOnly = true) {
      const filter = publishedOnly ? { published: true } : {};
      return pagesCol.find(filter).sort({ updatedAt: -1 }).toArray();
    },
    async upsertPage(page) {
      const existing = await pagesCol.findOne({ slug: page.slug });
      const row: CmsPage = {
        id: existing?.id ?? page.id ?? randomUUID(),
        slug: page.slug,
        title: page.title,
        body: page.body,
        published: page.published,
        updatedAt: new Date(),
      };
      await pagesCol.replaceOne({ slug: page.slug }, row, { upsert: true });
      return row;
    },
    async listBlogPosts(publishedOnly = true) {
      const filter = publishedOnly ? { published: true } : {};
      return blogsCol.find(filter).sort({ createdAt: -1 }).toArray();
    },
    async getBlogBySlug(slug) {
      return (await blogsCol.findOne({ slug })) ?? null;
    },
    async upsertBlogPost(post) {
      const existing = await blogsCol.findOne({ slug: post.slug });
      const t = new Date();
      const row: BlogPost = {
        id: existing?.id ?? post.id ?? randomUUID(),
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        published: post.published,
        createdAt: existing?.createdAt ?? t,
        updatedAt: t,
      };
      await blogsCol.replaceOne({ slug: post.slug }, row, { upsert: true });
      return row;
    },
  };

  const orders: OrderRepository = {
    async create(input) {
      const t = new Date();
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
      await ordersCol.insertOne(row);
      return row;
    },
    async findById(id) {
      return (await ordersCol.findOne({ id })) ?? null;
    },
    async listByUser(userId) {
      return ordersCol.find({ userId }).sort({ createdAt: -1 }).toArray();
    },
    async findPaidByUserProgram(userId, programId) {
      return (
        (await ordersCol.findOne({ userId, programId, status: 'paid' })) ?? null
      );
    },
    async listPaid(limit = 50) {
      return ordersCol.find({ status: 'paid' }).sort({ createdAt: -1 }).limit(limit).toArray();
    },
    async countPaid() {
      return ordersCol.countDocuments({ status: 'paid' });
    },
    async sumPaidAmountCents() {
      const rows = await ordersCol
        .aggregate<{ total: number }>([
          { $match: { status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$amountCents' } } },
        ])
        .toArray();
      return rows[0]?.total ?? 0;
    },
    async update(id, patch) {
      const existing = await orders.findById(id);
      if (!existing) throw new Error('Order not found');
      const { id: _id, createdAt: _c, ...safe } = patch;
      const updated = { ...existing, ...safe, id, updatedAt: new Date() };
      await ordersCol.replaceOne({ id }, updated);
      return updated;
    },
  };

  const payments: PaymentRepository = {
    async create(input) {
      const t = new Date();
      const row: Payment = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      await paymentsCol.insertOne(row);
      return row;
    },
    async findById(id) {
      return (await paymentsCol.findOne({ id })) ?? null;
    },
    async findByOrderId(orderId) {
      return (await paymentsCol.findOne({ orderId }, { sort: { createdAt: -1 } })) ?? null;
    },
    async update(id, patch) {
      const existing = await payments.findById(id);
      if (!existing) throw new Error('Payment not found');
      const { id: _id, createdAt: _c, ...safe } = patch;
      const updated = { ...existing, ...safe, id, updatedAt: new Date() };
      await paymentsCol.replaceOne({ id }, updated);
      return updated;
    },
  };

  const learning: LearningRepository = {
    async createCourse(input) {
      const t = new Date();
      const row: Course = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      await coursesCol.insertOne(row);
      return row;
    },
    async findCourseById(id) {
      return (await coursesCol.findOne({ id })) ?? null;
    },
    async findCourseByProgramSlug(programId, slug) {
      return (await coursesCol.findOne({ programId, slug })) ?? null;
    },
    async listCoursesByProgramIds(programIds) {
      if (!programIds.length) return [];
      return coursesCol
        .find({ published: true, programId: { $in: programIds } })
        .sort({ sortOrder: 1, title: 1 })
        .toArray();
    },
    async createLesson(input) {
      const t = new Date();
      const row: Lesson = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      await lessonsCol.insertOne(row);
      return row;
    },
    async findLessonById(id) {
      return (await lessonsCol.findOne({ id })) ?? null;
    },
    async findLessonByCourseSlug(courseId, slug) {
      return (await lessonsCol.findOne({ courseId, slug })) ?? null;
    },
    async listLessonsByCourse(courseId) {
      return lessonsCol
        .find({ courseId, published: true })
        .sort({ sortOrder: 1 })
        .toArray();
    },
    async getProgress(userId, lessonId) {
      return (await progressCol.findOne({ userId, lessonId })) ?? null;
    },
    async listProgressForUser(userId) {
      return progressCol.find({ userId }).toArray();
    },
    async markLessonComplete(userId, lessonId) {
      const existing = await learning.getProgress(userId, lessonId);
      if (existing) return existing;
      const row: LessonProgress = {
        id: randomUUID(),
        userId,
        lessonId,
        completedAt: new Date(),
      };
      await progressCol.insertOne(row);
      return row;
    },
  };

  const internships: InternshipRepository = {
    async create(input) {
      const t = new Date();
      const row: Internship = { id: randomUUID(), ...input, createdAt: t, updatedAt: t };
      await internshipsCol.insertOne(row);
      return row;
    },
    async update(id, input) {
      const existing = await internshipsCol.findOne({ id });
      if (!existing) return null;
      const row: Internship = { ...existing, ...input, updatedAt: new Date() };
      await internshipsCol.replaceOne({ id }, row);
      return row;
    },
    async findById(id) {
      return (await internshipsCol.findOne({ id })) ?? null;
    },
    async findBySlug(slug) {
      return (await internshipsCol.findOne({ slug })) ?? null;
    },
    async listPublished() {
      return internshipsCol
        .find({ published: true, approvalStatus: 'approved' })
        .sort({ createdAt: -1 })
        .toArray();
    },
    async listByCompanyUser(companyUserId) {
      return internshipsCol.find({ companyUserId }).sort({ createdAt: -1 }).toArray();
    },
    async listPendingApproval() {
      return internshipsCol
        .find({ approvalStatus: 'pending_approval' })
        .sort({ createdAt: -1 })
        .toArray();
    },
    async createApplication(input) {
      const t = new Date();
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
      await internshipAppsCol.insertOne(row);
      return row;
    },
    async findApplication(userId, internshipId) {
      return (await internshipAppsCol.findOne({ userId, internshipId })) ?? null;
    },
    async findApplicationById(id) {
      return (await internshipAppsCol.findOne({ id })) ?? null;
    },
    async listApplicationsByUser(userId) {
      return internshipAppsCol.find({ userId }).sort({ createdAt: -1 }).toArray();
    },
    async listApplicationsByInternship(internshipId) {
      return internshipAppsCol.find({ internshipId }).sort({ createdAt: -1 }).toArray();
    },
    async updateApplicationStatus(id, status, note) {
      const existing = await internshipAppsCol.findOne({ id });
      if (!existing) return null;
      const t = new Date();
      const row: InternshipApplication = {
        ...existing,
        status,
        timeline: [...existing.timeline, { at: t, status, note }],
        updatedAt: t,
      };
      await internshipAppsCol.replaceOne({ id }, row);
      return row;
    },
    async updateParentDecision(id, decision, note) {
      const existing = await internshipAppsCol.findOne({ id });
      if (!existing) return null;
      const t = new Date();
      const row: InternshipApplication = {
        ...existing,
        parentDecision: decision,
        parentDecidedAt: t,
        parentNote: note ?? null,
        updatedAt: t,
      };
      await internshipAppsCol.replaceOne({ id }, row);
      return row;
    },
    async updateMentorCompletion(id, decision, note, documentKeys) {
      const existing = await internshipAppsCol.findOne({ id });
      if (!existing) return null;
      const t = new Date();
      const row: InternshipApplication = {
        ...existing,
        mentorCompletionDecision: decision,
        mentorCompletionNote: note ?? null,
        mentorCompletionDocKeys: documentKeys ?? existing.mentorCompletionDocKeys,
        mentorCompletedAt: t,
        updatedAt: t,
      };
      await internshipAppsCol.replaceOne({ id }, row);
      return row;
    },
  };

  const parent: ParentRepository = {
    async createLink(input) {
      const t = new Date();
      const row: ParentStudentLink = {
        id: randomUUID(),
        ...input,
        createdAt: t,
        updatedAt: t,
      };
      await parentLinksCol.insertOne(row);
      return row;
    },
    async updateLinkStatus(id, status) {
      const existing = await parentLinksCol.findOne({ id });
      if (!existing) return null;
      const row: ParentStudentLink = { ...existing, status, updatedAt: new Date() };
      await parentLinksCol.replaceOne({ id }, row);
      return row;
    },
    async findLinkById(id) {
      return (await parentLinksCol.findOne({ id })) ?? null;
    },
    async findActiveLink(parentUserId, studentUserId) {
      return (
        (await parentLinksCol.findOne({
          parentUserId,
          studentUserId,
          status: 'active',
        })) ?? null
      );
    },
    async listLinksByParent(parentUserId) {
      return parentLinksCol.find({ parentUserId }).sort({ createdAt: -1 }).toArray();
    },
    async listLinksByStudent(studentUserId) {
      return parentLinksCol.find({ studentUserId }).sort({ createdAt: -1 }).toArray();
    },
    async findPrimaryActiveStudent(parentUserId) {
      return (
        (await parentLinksCol.findOne(
          { parentUserId, status: 'active' },
          { sort: { createdAt: 1 } },
        )) ?? null
      );
    },
    async createThread(input) {
      const t = new Date();
      const row: ParentMessageThread = {
        id: randomUUID(),
        ...input,
        createdAt: t,
        updatedAt: t,
      };
      await parentThreadsCol.insertOne(row);
      return row;
    },
    async findThreadById(id) {
      return (await parentThreadsCol.findOne({ id })) ?? null;
    },
    async listThreadsByParent(parentUserId) {
      return parentThreadsCol.find({ parentUserId }).sort({ updatedAt: -1 }).toArray();
    },
    async touchThread(id) {
      await parentThreadsCol.updateOne({ id }, { $set: { updatedAt: new Date() } });
    },
    async createMessage(input) {
      const row: ParentMessage = {
        id: randomUUID(),
        ...input,
        createdAt: new Date(),
      };
      await parentMessagesCol.insertOne(row);
      await parent.touchThread(input.threadId);
      return row;
    },
    async listMessages(threadId) {
      return parentMessagesCol.find({ threadId }).sort({ createdAt: 1 }).toArray();
    },
  };

  const mentors: MentorRepository = {
    async createAssignment(input) {
      const t = new Date();
      const row: MentorAssignment = {
        id: randomUUID(),
        ...input,
        createdAt: t,
        updatedAt: t,
      };
      await mentorAssignmentsCol.insertOne(row);
      return row;
    },
    async findAssignment(mentorId, studentId) {
      return (
        (await mentorAssignmentsCol.findOne({
          mentorId,
          studentId,
          status: 'active',
        })) ?? null
      );
    },
    async listAssignmentsByMentor(mentorId) {
      return mentorAssignmentsCol
        .find({ mentorId, status: 'active' })
        .sort({ createdAt: -1 })
        .toArray();
    },
    async listAssignmentsByStudent(studentId) {
      return mentorAssignmentsCol
        .find({ studentId, status: 'active' })
        .sort({ createdAt: -1 })
        .toArray();
    },
    async createReview(input) {
      const t = new Date();
      const row: MentorReview = {
        id: randomUUID(),
        ...input,
        status: input.status ?? 'published',
        templateKey: input.templateKey ?? null,
        documentKeys: input.documentKeys ?? [],
        createdAt: t,
        updatedAt: t,
      };
      await mentorReviewsCol.insertOne(row);
      return row;
    },
    async updateReview(id, patch) {
      const existing = await mentorReviewsCol.findOne({ id });
      if (!existing) return null;
      const row: MentorReview = { ...existing, ...patch, updatedAt: new Date() };
      await mentorReviewsCol.replaceOne({ id }, row);
      return row;
    },
    async findReviewById(id) {
      return (await mentorReviewsCol.findOne({ id })) ?? null;
    },
    async listReviewsByMentor(mentorId) {
      return mentorReviewsCol.find({ mentorId }).sort({ createdAt: -1 }).toArray();
    },
    async createSessionNote(input) {
      const row: MentorSessionNote = {
        id: randomUUID(),
        ...input,
        createdAt: new Date(),
      };
      await mentorNotesCol.insertOne(row);
      return row;
    },
    async listSessionNotes(mentorId, studentId) {
      const filter: { mentorId: string; studentId?: string } = { mentorId };
      if (studentId) filter.studentId = studentId;
      return mentorNotesCol.find(filter).sort({ createdAt: -1 }).toArray();
    },
    async createSession(input) {
      const t = new Date();
      const row: MentorSession = {
        id: randomUUID(),
        ...input,
        createdAt: t,
        updatedAt: t,
      };
      await mentorSessionsCol.insertOne(row);
      return row;
    },
    async findSessionById(id) {
      return (await mentorSessionsCol.findOne({ id })) ?? null;
    },
    async listSessionsByMentor(mentorId) {
      return mentorSessionsCol.find({ mentorId }).sort({ startsAt: 1 }).toArray();
    },
    async listSessionsByStudent(studentId) {
      return mentorSessionsCol.find({ studentId }).sort({ startsAt: 1 }).toArray();
    },
    async updateSession(id, patch) {
      const existing = await mentorSessionsCol.findOne({ id });
      if (!existing) return null;
      const row: MentorSession = { ...existing, ...patch, updatedAt: new Date() };
      await mentorSessionsCol.replaceOne({ id }, row);
      return row;
    },
  };

  const certificates: CertificateRepository = {
    async create(input) {
      const row: Certificate = {
        id: randomUUID(),
        ...input,
        createdAt: new Date(),
      };
      await certificatesCol.insertOne(row);
      return row;
    },
    async findById(id) {
      return (await certificatesCol.findOne({ id })) ?? null;
    },
    async findByCode(code) {
      return (await certificatesCol.findOne({ code })) ?? null;
    },
    async findByUserProgram(userId, programId) {
      return (await certificatesCol.findOne({ userId, programId })) ?? null;
    },
    async listByUser(userId) {
      return certificatesCol.find({ userId }).sort({ issuedAt: -1 }).toArray();
    },
    async listAll(limit = 50) {
      return certificatesCol.find({}).sort({ issuedAt: -1 }).limit(limit).toArray();
    },
  };

  return {
    users,
    authTokens,
    audit,
    notifications,
    programs,
    cms,
    orders,
    payments,
    learning,
    internships,
    mentors,
    profiles,
    parent,
    certificates,
    async disconnect() {
      await client.close();
    },
  };
}
