import { randomUUID } from 'node:crypto';
import pg from 'pg';
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
  EducationItem,
  ExperienceItem,
  ProfileRepository,
  ProjectItem,
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

const { Pool } = pg;

function mapUser(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    email: String(row.email),
    passwordHash: (row.password_hash as string | null) ?? null,
    fullName: String(row.full_name),
    role: row.role as Role,
    emailVerified: Boolean(row.email_verified),
    googleId: (row.google_id as string | null) ?? null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

async function migrate(pool: pg.Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      google_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS audit_events (
      id UUID PRIMARY KEY,
      actor_id TEXT NOT NULL,
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id TEXT,
      metadata JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      channel TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS programs (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      summary TEXT NOT NULL,
      description TEXT NOT NULL,
      price_cents INT NOT NULL,
      currency TEXT NOT NULL,
      is_own_product BOOLEAN NOT NULL DEFAULT TRUE,
      published BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS cms_pages (
      id UUID PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      published BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS blog_posts (
      id UUID PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      published BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS auth_tokens (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      purpose TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS auth_tokens_hash_purpose_idx
      ON auth_tokens (token_hash, purpose);
    CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      program_title TEXT NOT NULL,
      amount_cents INT NOT NULL,
      currency TEXT NOT NULL,
      coupon_code TEXT,
      status TEXT NOT NULL,
      payment_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id);
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      amount_cents INT NOT NULL,
      currency TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_ref TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS payments_order_idx ON payments (order_id);
    CREATE TABLE IF NOT EXISTS courses (
      id UUID PRIMARY KEY,
      program_id TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      summary TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (program_id, slug)
    );
    CREATE TABLE IF NOT EXISTS lessons (
      id UUID PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (course_id, slug)
    );
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, lesson_id)
    );
    CREATE TABLE IF NOT EXISTS internships (
      id UUID PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      company_user_id TEXT,
      approval_status TEXT NOT NULL DEFAULT 'approved',
      payment_status TEXT NOT NULL DEFAULT 'waived',
      published BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE internships ADD COLUMN IF NOT EXISTS company_user_id TEXT;
    ALTER TABLE internships ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'approved';
    ALTER TABLE internships ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'waived';
    CREATE TABLE IF NOT EXISTS internship_applications (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      internship_id TEXT NOT NULL,
      notes TEXT,
      document_keys JSONB NOT NULL DEFAULT '[]',
      status TEXT NOT NULL,
      timeline JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, internship_id)
    );
    CREATE TABLE IF NOT EXISTS mentor_assignments (
      id UUID PRIMARY KEY,
      mentor_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS mentor_assignments_mentor_idx
      ON mentor_assignments (mentor_id);
    CREATE TABLE IF NOT EXISTS mentor_reviews (
      id UUID PRIMARY KEY,
      mentor_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      program_id TEXT,
      title TEXT NOT NULL,
      grade TEXT NOT NULL,
      feedback TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      template_key TEXT,
      document_keys JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS mentor_session_notes (
      id UUID PRIMARY KEY,
      mentor_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS mentor_sessions (
      id UUID PRIMARY KEY,
      mentor_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      program_id TEXT,
      topic TEXT NOT NULL,
      starts_at TIMESTAMPTZ NOT NULL,
      ends_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL,
      meeting_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS mentor_sessions_mentor_idx
      ON mentor_sessions (mentor_id);
    CREATE INDEX IF NOT EXISTS mentor_sessions_student_idx
      ON mentor_sessions (student_id);
    CREATE TABLE IF NOT EXISTS student_profiles (
      user_id TEXT PRIMARY KEY,
      headline TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      skills JSONB NOT NULL DEFAULT '[]',
      education JSONB NOT NULL DEFAULT '[]',
      experience JSONB NOT NULL DEFAULT '[]',
      projects JSONB NOT NULL DEFAULT '[]',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS parent_decision TEXT NOT NULL DEFAULT 'pending';
    ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS parent_decided_at TIMESTAMPTZ;
    ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS parent_note TEXT;
    ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS mentor_completion_decision TEXT NOT NULL DEFAULT 'pending';
    ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS mentor_completion_note TEXT;
    ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS mentor_completion_doc_keys JSONB NOT NULL DEFAULT '[]';
    ALTER TABLE internship_applications
      ADD COLUMN IF NOT EXISTS mentor_completed_at TIMESTAMPTZ;
    ALTER TABLE mentor_reviews
      ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
    ALTER TABLE mentor_reviews
      ADD COLUMN IF NOT EXISTS template_key TEXT;
    ALTER TABLE mentor_reviews
      ADD COLUMN IF NOT EXISTS document_keys JSONB NOT NULL DEFAULT '[]';
    ALTER TABLE mentor_reviews
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_by_user_id TEXT;
    CREATE TABLE IF NOT EXISTS parent_student_links (
      id UUID PRIMARY KEY,
      parent_user_id TEXT NOT NULL,
      student_user_id TEXT NOT NULL,
      status TEXT NOT NULL,
      invite_email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS parent_student_links_parent_idx
      ON parent_student_links (parent_user_id);
    CREATE INDEX IF NOT EXISTS parent_student_links_student_idx
      ON parent_student_links (student_user_id);
    CREATE TABLE IF NOT EXISTS parent_message_threads (
      id UUID PRIMARY KEY,
      parent_user_id TEXT NOT NULL,
      student_user_id TEXT NOT NULL,
      participant_user_id TEXT NOT NULL,
      participant_role TEXT NOT NULL,
      topic TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS parent_message_threads_parent_idx
      ON parent_message_threads (parent_user_id);
    CREATE TABLE IF NOT EXISTS parent_messages (
      id UUID PRIMARY KEY,
      thread_id TEXT NOT NULL,
      sender_user_id TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS parent_messages_thread_idx
      ON parent_messages (thread_id);
    CREATE TABLE IF NOT EXISTS certificates (
      id UUID PRIMARY KEY,
      user_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      recipient_name TEXT NOT NULL,
      program_title TEXT NOT NULL,
      issued_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS certificates_user_idx ON certificates (user_id);
    CREATE INDEX IF NOT EXISTS certificates_user_program_idx
      ON certificates (user_id, program_id);
  `);
}

function mapStudentProfile(row: Record<string, unknown>): StudentProfile {
  return {
    userId: String(row.user_id),
    headline: String(row.headline ?? ''),
    bio: String(row.bio ?? ''),
    phone: String(row.phone ?? ''),
    location: String(row.location ?? ''),
    skills: (row.skills as string[]) ?? [],
    education: (row.education as EducationItem[]) ?? [],
    experience: (row.experience as ExperienceItem[]) ?? [],
    projects: (row.projects as ProjectItem[]) ?? [],
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapMentorAssignment(row: Record<string, unknown>): MentorAssignment {
  return {
    id: String(row.id),
    mentorId: String(row.mentor_id),
    studentId: String(row.student_id),
    programId: String(row.program_id),
    status: row.status as MentorAssignment['status'],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapMentorReview(row: Record<string, unknown>): MentorReview {
  return {
    id: String(row.id),
    mentorId: String(row.mentor_id),
    studentId: String(row.student_id),
    programId: (row.program_id as string | null) ?? null,
    title: String(row.title),
    grade: String(row.grade),
    feedback: String(row.feedback),
    status: (row.status as MentorReview['status']) ?? 'published',
    templateKey: (row.template_key as string | null) ?? null,
    documentKeys: (row.document_keys as string[]) ?? [],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date((row.updated_at as string) ?? (row.created_at as string)),
  };
}

function mapMentorNote(row: Record<string, unknown>): MentorSessionNote {
  return {
    id: String(row.id),
    mentorId: String(row.mentor_id),
    studentId: String(row.student_id),
    note: String(row.note),
    createdAt: new Date(row.created_at as string),
  };
}

function mapMentorSession(row: Record<string, unknown>): MentorSession {
  return {
    id: String(row.id),
    mentorId: String(row.mentor_id),
    studentId: String(row.student_id),
    programId: (row.program_id as string | null) ?? null,
    topic: String(row.topic),
    startsAt: new Date(row.starts_at as string),
    endsAt: new Date(row.ends_at as string),
    status: row.status as MentorSession['status'],
    meetingUrl: (row.meeting_url as string | null) ?? null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapInternship(row: Record<string, unknown>): Internship {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    company: String(row.company),
    location: String(row.location),
    description: String(row.description),
    companyUserId: row.company_user_id ? String(row.company_user_id) : null,
    approvalStatus: (row.approval_status as Internship['approvalStatus']) ?? 'approved',
    paymentStatus: (row.payment_status as Internship['paymentStatus']) ?? 'waived',
    published: Boolean(row.published),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapApplication(row: Record<string, unknown>): InternshipApplication {
  const timeline = (row.timeline as Array<{ at: string; status: string; note?: string }>) ?? [];
  return {
    id: String(row.id),
    userId: String(row.user_id),
    internshipId: String(row.internship_id),
    notes: (row.notes as string | null) ?? null,
    documentKeys: (row.document_keys as string[]) ?? [],
    status: row.status as InternshipApplication['status'],
    timeline: timeline.map((t) => ({
      at: new Date(t.at),
      status: t.status as InternshipApplication['status'],
      note: t.note,
    })),
    parentDecision: (row.parent_decision as InternshipApplication['parentDecision']) ?? 'pending',
    parentDecidedAt: row.parent_decided_at
      ? new Date(row.parent_decided_at as string)
      : null,
    parentNote: (row.parent_note as string | null) ?? null,
    mentorCompletionDecision:
      (row.mentor_completion_decision as InternshipApplication['mentorCompletionDecision']) ??
      'pending',
    mentorCompletionNote: (row.mentor_completion_note as string | null) ?? null,
    mentorCompletionDocKeys: (row.mentor_completion_doc_keys as string[]) ?? [],
    mentorCompletedAt: row.mentor_completed_at
      ? new Date(row.mentor_completed_at as string)
      : null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapCourse(row: Record<string, unknown>): Course {
  return {
    id: String(row.id),
    programId: String(row.program_id),
    title: String(row.title),
    slug: String(row.slug),
    summary: String(row.summary),
    sortOrder: Number(row.sort_order),
    published: Boolean(row.published),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapLesson(row: Record<string, unknown>): Lesson {
  return {
    id: String(row.id),
    courseId: String(row.course_id),
    title: String(row.title),
    slug: String(row.slug),
    content: String(row.content),
    sortOrder: Number(row.sort_order),
    published: Boolean(row.published),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapProgress(row: Record<string, unknown>): LessonProgress {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    lessonId: String(row.lesson_id),
    completedAt: new Date(row.completed_at as string),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    programId: String(row.program_id),
    programTitle: String(row.program_title),
    amountCents: Number(row.amount_cents),
    currency: String(row.currency),
    couponCode: (row.coupon_code as string | null) ?? null,
    status: row.status as Order['status'],
    paymentId: (row.payment_id as string | null) ?? null,
    paidByUserId: (row.paid_by_user_id as string | null) ?? null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapParentLink(row: Record<string, unknown>): ParentStudentLink {
  return {
    id: String(row.id),
    parentUserId: String(row.parent_user_id),
    studentUserId: String(row.student_user_id),
    status: row.status as ParentStudentLink['status'],
    inviteEmail: String(row.invite_email),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapParentThread(row: Record<string, unknown>): ParentMessageThread {
  return {
    id: String(row.id),
    parentUserId: String(row.parent_user_id),
    studentUserId: String(row.student_user_id),
    participantUserId: String(row.participant_user_id),
    participantRole: row.participant_role as ParentMessageThread['participantRole'],
    topic: String(row.topic),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapParentMessage(row: Record<string, unknown>): ParentMessage {
  return {
    id: String(row.id),
    threadId: String(row.thread_id),
    senderUserId: String(row.sender_user_id),
    body: String(row.body),
    createdAt: new Date(row.created_at as string),
  };
}

function mapPayment(row: Record<string, unknown>): Payment {
  return {
    id: String(row.id),
    orderId: String(row.order_id),
    userId: String(row.user_id),
    amountCents: Number(row.amount_cents),
    currency: String(row.currency),
    provider: String(row.provider),
    providerRef: String(row.provider_ref),
    status: row.status as Payment['status'],
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

function mapCertificate(row: Record<string, unknown>): Certificate {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    programId: String(row.program_id),
    code: String(row.code),
    title: String(row.title),
    recipientName: String(row.recipient_name),
    programTitle: String(row.program_title),
    issuedAt: new Date(row.issued_at as string),
    createdAt: new Date(row.created_at as string),
  };
}

function mapAuthToken(row: Record<string, unknown>): AuthToken {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    tokenHash: String(row.token_hash),
    purpose: row.purpose as AuthToken['purpose'],
    expiresAt: new Date(row.expires_at as string),
    usedAt: row.used_at ? new Date(row.used_at as string) : null,
    createdAt: new Date(row.created_at as string),
  };
}

export async function createPostgresRepositories(config: AppConfig): Promise<Repositories> {
  const pool = new Pool({ connectionString: config.DATABASE_URL });
  await migrate(pool);

  const users: UserRepository = {
    async findById(id) {
      const r = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return r.rows[0] ? mapUser(r.rows[0]) : null;
    },
    async findByEmail(email) {
      const r = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      return r.rows[0] ? mapUser(r.rows[0]) : null;
    },
    async create(input: CreateUserInput) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO users (id, email, password_hash, full_name, role, email_verified, google_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [
          id,
          input.email.toLowerCase(),
          input.passwordHash ?? null,
          input.fullName,
          input.role,
          input.emailVerified ?? false,
          input.googleId ?? null,
        ],
      );
      return mapUser(r.rows[0]);
    },
    async update(id, patch) {
      const existing = await users.findById(id);
      if (!existing) throw new Error('User not found');
      // One person, one role — role is immutable after create.
      const { role: _role, id: _id, createdAt: _createdAt, ...safe } = patch;
      const next = { ...existing, ...safe, id, role: existing.role };
      const r = await pool.query(
        `UPDATE users SET email=$2, password_hash=$3, full_name=$4, role=$5,
         email_verified=$6, google_id=$7, updated_at=NOW() WHERE id=$1 RETURNING *`,
        [
          id,
          next.email,
          next.passwordHash ?? null,
          next.fullName,
          next.role,
          next.emailVerified,
          next.googleId ?? null,
        ],
      );
      return mapUser(r.rows[0]);
    },
    async count() {
      const r = await pool.query('SELECT COUNT(*)::int AS c FROM users');
      return r.rows[0].c as number;
    },
    async list({ role, page = 1, pageSize = 20 } = {}) {
      const offset = (page - 1) * pageSize;
      if (role) {
        const total = await pool.query(
          'SELECT COUNT(*)::int AS c FROM users WHERE role = $1',
          [role],
        );
        const r = await pool.query(
          'SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
          [role, pageSize, offset],
        );
        return { items: r.rows.map(mapUser), total: total.rows[0].c as number };
      }
      const total = await pool.query('SELECT COUNT(*)::int AS c FROM users');
      const r = await pool.query(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [pageSize, offset],
      );
      return { items: r.rows.map(mapUser), total: total.rows[0].c as number };
    },
  };

  const authTokens: AuthTokenRepository = {
    async create(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO auth_tokens (id, user_id, token_hash, purpose, expires_at)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [id, input.userId, input.tokenHash, input.purpose, input.expiresAt],
      );
      return mapAuthToken(r.rows[0]);
    },
    async findValidByHash(purpose, tokenHash) {
      const r = await pool.query(
        `SELECT * FROM auth_tokens
         WHERE purpose = $1 AND token_hash = $2 AND used_at IS NULL AND expires_at > NOW()
         LIMIT 1`,
        [purpose, tokenHash],
      );
      return r.rows[0] ? mapAuthToken(r.rows[0]) : null;
    },
    async markUsed(id) {
      await pool.query(`UPDATE auth_tokens SET used_at = NOW() WHERE id = $1`, [id]);
    },
    async invalidateUserPurpose(userId, purpose) {
      await pool.query(
        `UPDATE auth_tokens SET used_at = NOW()
         WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL`,
        [userId, purpose],
      );
    },
  };

  const audit: AuditRepository = {
    async append(event) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO audit_events (id, actor_id, action, resource_type, resource_id, metadata)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [
          id,
          event.actorId,
          event.action,
          event.resourceType,
          event.resourceId ?? null,
          event.metadata ? JSON.stringify(event.metadata) : null,
        ],
      );
      const row = r.rows[0];
      return {
        id: row.id,
        actorId: row.actor_id,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id ?? undefined,
        metadata: row.metadata ?? undefined,
        createdAt: new Date(row.created_at),
      } satisfies AuditEvent;
    },
    async listByActor(actorId, limit = 50) {
      const r = await pool.query(
        `SELECT * FROM audit_events WHERE actor_id = $1 ORDER BY created_at DESC LIMIT $2`,
        [actorId, limit],
      );
      return r.rows.map((row) => ({
        id: row.id,
        actorId: row.actor_id,
        action: row.action,
        resourceType: row.resource_type,
        resourceId: row.resource_id ?? undefined,
        metadata: row.metadata ?? undefined,
        createdAt: new Date(row.created_at),
      }));
    },
  };

  const mapNotification = (row: Record<string, unknown>): NotificationRecord => ({
    id: String(row.id),
    userId: String(row.user_id),
    channel: row.channel as NotificationRecord['channel'],
    title: String(row.title),
    body: String(row.body),
    read: Boolean(row.read),
    createdAt: new Date(row.created_at as string),
  });

  const notifications: NotificationRepository = {
    async create(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO notifications (id, user_id, channel, title, body)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [id, input.userId, input.channel, input.title, input.body],
      );
      return mapNotification(r.rows[0]);
    },
    async findById(id) {
      const r = await pool.query(`SELECT * FROM notifications WHERE id = $1`, [id]);
      return r.rows[0] ? mapNotification(r.rows[0]) : null;
    },
    async listForUser(userId) {
      const r = await pool.query(
        `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId],
      );
      return r.rows.map(mapNotification);
    },
    async countUnread(userId) {
      const r = await pool.query(
        `SELECT COUNT(*)::int AS c FROM notifications WHERE user_id = $1 AND read = FALSE`,
        [userId],
      );
      return Number(r.rows[0]?.c ?? 0);
    },
    async markRead(id) {
      await pool.query(`UPDATE notifications SET read = TRUE WHERE id = $1`, [id]);
    },
    async markAllReadForUser(userId) {
      const r = await pool.query(
        `UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE`,
        [userId],
      );
      return r.rowCount ?? 0;
    },
  };

  const profiles: ProfileRepository = {
    async getByUserId(userId) {
      const r = await pool.query(`SELECT * FROM student_profiles WHERE user_id = $1`, [
        userId,
      ]);
      return r.rows[0] ? mapStudentProfile(r.rows[0]) : null;
    },
    async upsert(input) {
      const r = await pool.query(
        `INSERT INTO student_profiles
           (user_id, headline, bio, phone, location, skills, education, experience, projects, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8::jsonb,$9::jsonb, NOW())
         ON CONFLICT (user_id) DO UPDATE SET
           headline = EXCLUDED.headline,
           bio = EXCLUDED.bio,
           phone = EXCLUDED.phone,
           location = EXCLUDED.location,
           skills = EXCLUDED.skills,
           education = EXCLUDED.education,
           experience = EXCLUDED.experience,
           projects = EXCLUDED.projects,
           updated_at = NOW()
         RETURNING *`,
        [
          input.userId,
          input.headline,
          input.bio,
          input.phone,
          input.location,
          JSON.stringify(input.skills),
          JSON.stringify(input.education),
          JSON.stringify(input.experience),
          JSON.stringify(input.projects),
        ],
      );
      return mapStudentProfile(r.rows[0]);
    },
  };

  const mapProgram = (row: Record<string, unknown>): Program => ({
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    summary: String(row.summary),
    description: String(row.description),
    priceCents: Number(row.price_cents),
    currency: String(row.currency),
    isOwnProduct: Boolean(row.is_own_product),
    published: Boolean(row.published),
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  });

  const programs: ProgramRepository = {
    async findById(id) {
      const r = await pool.query('SELECT * FROM programs WHERE id = $1', [id]);
      return r.rows[0] ? mapProgram(r.rows[0]) : null;
    },
    async findBySlug(slug) {
      const r = await pool.query('SELECT * FROM programs WHERE slug = $1', [slug]);
      return r.rows[0] ? mapProgram(r.rows[0]) : null;
    },
    async listPublished(ownOnly = true) {
      const r = ownOnly
        ? await pool.query(
            `SELECT * FROM programs WHERE published = TRUE AND is_own_product = TRUE ORDER BY created_at DESC`,
          )
        : await pool.query(
            `SELECT * FROM programs WHERE published = TRUE ORDER BY created_at DESC`,
          );
      return r.rows.map(mapProgram);
    },
    async listAll(ownOnly = true) {
      const r = ownOnly
        ? await pool.query(
            `SELECT * FROM programs WHERE is_own_product = TRUE ORDER BY created_at DESC`,
          )
        : await pool.query(`SELECT * FROM programs ORDER BY created_at DESC`);
      return r.rows.map(mapProgram);
    },
    async create(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO programs (id, title, slug, summary, description, price_cents, currency, is_own_product, published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          id,
          input.title,
          input.slug,
          input.summary,
          input.description,
          input.priceCents,
          input.currency,
          input.isOwnProduct,
          input.published,
        ],
      );
      return mapProgram(r.rows[0]);
    },
    async update(id, patch) {
      const existing = await programs.findById(id);
      if (!existing) throw new Error('Program not found');
      const next = { ...existing, ...patch, id };
      const r = await pool.query(
        `UPDATE programs SET title=$2, slug=$3, summary=$4, description=$5, price_cents=$6,
         currency=$7, is_own_product=$8, published=$9, updated_at=NOW() WHERE id=$1 RETURNING *`,
        [
          id,
          next.title,
          next.slug,
          next.summary,
          next.description,
          next.priceCents,
          next.currency,
          next.isOwnProduct,
          next.published,
        ],
      );
      return mapProgram(r.rows[0]);
    },
  };

  const cms: CmsRepository = {
    async getPageBySlug(slug) {
      const r = await pool.query('SELECT * FROM cms_pages WHERE slug = $1', [slug]);
      if (!r.rows[0]) return null;
      const row = r.rows[0];
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        body: row.body,
        published: row.published,
        updatedAt: new Date(row.updated_at),
      } satisfies CmsPage;
    },
    async listPages(publishedOnly = true) {
      const r = publishedOnly
        ? await pool.query(
            `SELECT * FROM cms_pages WHERE published = TRUE ORDER BY updated_at DESC`,
          )
        : await pool.query(`SELECT * FROM cms_pages ORDER BY updated_at DESC`);
      return r.rows.map(
        (row): CmsPage => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          body: row.body,
          published: row.published,
          updatedAt: new Date(row.updated_at),
        }),
      );
    },
    async upsertPage(page) {
      const id = page.id ?? randomUUID();
      const r = await pool.query(
        `INSERT INTO cms_pages (id, slug, title, body, published)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, body=EXCLUDED.body,
           published=EXCLUDED.published, updated_at=NOW()
         RETURNING *`,
        [id, page.slug, page.title, page.body, page.published],
      );
      const row = r.rows[0];
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        body: row.body,
        published: row.published,
        updatedAt: new Date(row.updated_at),
      };
    },
    async listBlogPosts(publishedOnly = true) {
      const r = publishedOnly
        ? await pool.query(
            `SELECT * FROM blog_posts WHERE published = TRUE ORDER BY created_at DESC`,
          )
        : await pool.query(`SELECT * FROM blog_posts ORDER BY created_at DESC`);
      return r.rows.map(
        (row): BlogPost => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          body: row.body,
          published: row.published,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }),
      );
    },
    async getBlogBySlug(slug) {
      const r = await pool.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      if (!r.rows[0]) return null;
      const row = r.rows[0];
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        published: row.published,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    },
    async upsertBlogPost(post) {
      const id = post.id ?? randomUUID();
      const r = await pool.query(
        `INSERT INTO blog_posts (id, slug, title, excerpt, body, published)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, excerpt=EXCLUDED.excerpt,
           body=EXCLUDED.body, published=EXCLUDED.published, updated_at=NOW()
         RETURNING *`,
        [id, post.slug, post.title, post.excerpt, post.body, post.published],
      );
      const row = r.rows[0];
      return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        published: row.published,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
    },
  };

  const orders: OrderRepository = {
    async create(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO orders
          (id, user_id, program_id, program_title, amount_cents, currency, coupon_code, status, payment_id, paid_by_user_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
          id,
          input.userId,
          input.programId,
          input.programTitle,
          input.amountCents,
          input.currency,
          input.couponCode ?? null,
          input.status,
          input.paymentId ?? null,
          input.paidByUserId ?? null,
        ],
      );
      return mapOrder(r.rows[0]);
    },
    async findById(id) {
      const r = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      return r.rows[0] ? mapOrder(r.rows[0]) : null;
    },
    async listByUser(userId) {
      const r = await pool.query(
        `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId],
      );
      return r.rows.map(mapOrder);
    },
    async findPaidByUserProgram(userId, programId) {
      const r = await pool.query(
        `SELECT * FROM orders WHERE user_id = $1 AND program_id = $2 AND status = 'paid' LIMIT 1`,
        [userId, programId],
      );
      return r.rows[0] ? mapOrder(r.rows[0]) : null;
    },
    async listPaid(limit = 50) {
      const r = await pool.query(
        `SELECT * FROM orders WHERE status = 'paid' ORDER BY created_at DESC LIMIT $1`,
        [limit],
      );
      return r.rows.map(mapOrder);
    },
    async countPaid() {
      const r = await pool.query(
        `SELECT COUNT(*)::int AS c FROM orders WHERE status = 'paid'`,
      );
      return r.rows[0].c as number;
    },
    async sumPaidAmountCents() {
      const r = await pool.query(
        `SELECT COALESCE(SUM(amount_cents), 0)::int AS s FROM orders WHERE status = 'paid'`,
      );
      return r.rows[0].s as number;
    },
    async update(id, patch) {
      const existing = await orders.findById(id);
      if (!existing) throw new Error('Order not found');
      const next = { ...existing, ...patch, id };
      const r = await pool.query(
        `UPDATE orders SET user_id=$2, program_id=$3, program_title=$4, amount_cents=$5,
         currency=$6, coupon_code=$7, status=$8, payment_id=$9, paid_by_user_id=$10, updated_at=NOW()
         WHERE id=$1 RETURNING *`,
        [
          id,
          next.userId,
          next.programId,
          next.programTitle,
          next.amountCents,
          next.currency,
          next.couponCode,
          next.status,
          next.paymentId,
          next.paidByUserId,
        ],
      );
      return mapOrder(r.rows[0]);
    },
  };

  const payments: PaymentRepository = {
    async create(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO payments
          (id, order_id, user_id, amount_cents, currency, provider, provider_ref, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          id,
          input.orderId,
          input.userId,
          input.amountCents,
          input.currency,
          input.provider,
          input.providerRef,
          input.status,
        ],
      );
      return mapPayment(r.rows[0]);
    },
    async findById(id) {
      const r = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
      return r.rows[0] ? mapPayment(r.rows[0]) : null;
    },
    async findByOrderId(orderId) {
      const r = await pool.query(
        `SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [orderId],
      );
      return r.rows[0] ? mapPayment(r.rows[0]) : null;
    },
    async update(id, patch) {
      const existing = await payments.findById(id);
      if (!existing) throw new Error('Payment not found');
      const next = { ...existing, ...patch, id };
      const r = await pool.query(
        `UPDATE payments SET order_id=$2, user_id=$3, amount_cents=$4, currency=$5,
         provider=$6, provider_ref=$7, status=$8, updated_at=NOW()
         WHERE id=$1 RETURNING *`,
        [
          id,
          next.orderId,
          next.userId,
          next.amountCents,
          next.currency,
          next.provider,
          next.providerRef,
          next.status,
        ],
      );
      return mapPayment(r.rows[0]);
    },
  };

  const learning: LearningRepository = {
    async createCourse(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO courses (id, program_id, title, slug, summary, sort_order, published)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [
          id,
          input.programId,
          input.title,
          input.slug,
          input.summary,
          input.sortOrder,
          input.published,
        ],
      );
      return mapCourse(r.rows[0]);
    },
    async findCourseById(id) {
      const r = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
      return r.rows[0] ? mapCourse(r.rows[0]) : null;
    },
    async findCourseByProgramSlug(programId, slug) {
      const r = await pool.query(
        'SELECT * FROM courses WHERE program_id = $1 AND slug = $2',
        [programId, slug],
      );
      return r.rows[0] ? mapCourse(r.rows[0]) : null;
    },
    async listCoursesByProgramIds(programIds) {
      if (!programIds.length) return [];
      const r = await pool.query(
        `SELECT * FROM courses
         WHERE published = TRUE AND program_id = ANY($1::text[])
         ORDER BY sort_order ASC, title ASC`,
        [programIds],
      );
      return r.rows.map(mapCourse);
    },
    async createLesson(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO lessons (id, course_id, title, slug, content, sort_order, published)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [
          id,
          input.courseId,
          input.title,
          input.slug,
          input.content,
          input.sortOrder,
          input.published,
        ],
      );
      return mapLesson(r.rows[0]);
    },
    async findLessonById(id) {
      const r = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);
      return r.rows[0] ? mapLesson(r.rows[0]) : null;
    },
    async findLessonByCourseSlug(courseId, slug) {
      const r = await pool.query(
        'SELECT * FROM lessons WHERE course_id = $1 AND slug = $2',
        [courseId, slug],
      );
      return r.rows[0] ? mapLesson(r.rows[0]) : null;
    },
    async listLessonsByCourse(courseId) {
      const r = await pool.query(
        `SELECT * FROM lessons WHERE course_id = $1 AND published = TRUE ORDER BY sort_order ASC`,
        [courseId],
      );
      return r.rows.map(mapLesson);
    },
    async getProgress(userId, lessonId) {
      const r = await pool.query(
        'SELECT * FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2',
        [userId, lessonId],
      );
      return r.rows[0] ? mapProgress(r.rows[0]) : null;
    },
    async listProgressForUser(userId) {
      const r = await pool.query('SELECT * FROM lesson_progress WHERE user_id = $1', [
        userId,
      ]);
      return r.rows.map(mapProgress);
    },
    async markLessonComplete(userId, lessonId) {
      const existing = await learning.getProgress(userId, lessonId);
      if (existing) return existing;
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO lesson_progress (id, user_id, lesson_id)
         VALUES ($1,$2,$3) RETURNING *`,
        [id, userId, lessonId],
      );
      return mapProgress(r.rows[0]);
    },
  };

  const internships: InternshipRepository = {
    async create(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO internships
          (id, slug, title, company, location, description, company_user_id, approval_status, payment_status, published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
          id,
          input.slug,
          input.title,
          input.company,
          input.location,
          input.description,
          input.companyUserId,
          input.approvalStatus,
          input.paymentStatus,
          input.published,
        ],
      );
      return mapInternship(r.rows[0]);
    },
    async update(id, input) {
      const existing = await internships.findById(id);
      if (!existing) return null;
      const next = { ...existing, ...input, updatedAt: new Date() };
      const r = await pool.query(
        `UPDATE internships SET
           slug = $2, title = $3, company = $4, location = $5, description = $6,
           company_user_id = $7, approval_status = $8, payment_status = $9, published = $10,
           updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [
          id,
          next.slug,
          next.title,
          next.company,
          next.location,
          next.description,
          next.companyUserId,
          next.approvalStatus,
          next.paymentStatus,
          next.published,
        ],
      );
      return r.rows[0] ? mapInternship(r.rows[0]) : null;
    },
    async findById(id) {
      const r = await pool.query('SELECT * FROM internships WHERE id = $1', [id]);
      return r.rows[0] ? mapInternship(r.rows[0]) : null;
    },
    async findBySlug(slug) {
      const r = await pool.query('SELECT * FROM internships WHERE slug = $1', [slug]);
      return r.rows[0] ? mapInternship(r.rows[0]) : null;
    },
    async listPublished() {
      const r = await pool.query(
        `SELECT * FROM internships
         WHERE published = TRUE AND approval_status = 'approved'
         ORDER BY created_at DESC`,
      );
      return r.rows.map(mapInternship);
    },
    async listByCompanyUser(companyUserId) {
      const r = await pool.query(
        `SELECT * FROM internships WHERE company_user_id = $1 ORDER BY created_at DESC`,
        [companyUserId],
      );
      return r.rows.map(mapInternship);
    },
    async listPendingApproval() {
      const r = await pool.query(
        `SELECT * FROM internships WHERE approval_status = 'pending_approval' ORDER BY created_at DESC`,
      );
      return r.rows.map(mapInternship);
    },
    async createApplication(input) {
      const id = randomUUID();
      const timeline = input.timeline.map((t) => ({
        at: t.at.toISOString(),
        status: t.status,
        note: t.note,
      }));
      const r = await pool.query(
        `INSERT INTO internship_applications
          (id, user_id, internship_id, notes, document_keys, status, timeline,
           parent_decision, parent_decided_at, parent_note,
           mentor_completion_decision, mentor_completion_note,
           mentor_completion_doc_keys, mentor_completed_at)
         VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7::jsonb,$8,$9,$10,$11,$12,$13::jsonb,$14)
         RETURNING *`,
        [
          id,
          input.userId,
          input.internshipId,
          input.notes,
          JSON.stringify(input.documentKeys),
          input.status,
          JSON.stringify(timeline),
          input.parentDecision ?? 'pending',
          input.parentDecidedAt ?? null,
          input.parentNote ?? null,
          input.mentorCompletionDecision ?? 'pending',
          input.mentorCompletionNote ?? null,
          JSON.stringify(input.mentorCompletionDocKeys ?? []),
          input.mentorCompletedAt ?? null,
        ],
      );
      return mapApplication(r.rows[0]);
    },
    async findApplication(userId, internshipId) {
      const r = await pool.query(
        `SELECT * FROM internship_applications WHERE user_id = $1 AND internship_id = $2`,
        [userId, internshipId],
      );
      return r.rows[0] ? mapApplication(r.rows[0]) : null;
    },
    async findApplicationById(id) {
      const r = await pool.query('SELECT * FROM internship_applications WHERE id = $1', [id]);
      return r.rows[0] ? mapApplication(r.rows[0]) : null;
    },
    async listApplicationsByUser(userId) {
      const r = await pool.query(
        `SELECT * FROM internship_applications WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId],
      );
      return r.rows.map(mapApplication);
    },
    async listApplicationsByInternship(internshipId) {
      const r = await pool.query(
        `SELECT * FROM internship_applications WHERE internship_id = $1 ORDER BY created_at DESC`,
        [internshipId],
      );
      return r.rows.map(mapApplication);
    },
    async updateApplicationStatus(id, status, note) {
      const existing = await internships.findApplicationById(id);
      if (!existing) return null;
      const t = new Date();
      const timeline = [
        ...existing.timeline,
        { at: t, status, note },
      ].map((ev) => ({
        at: ev.at.toISOString(),
        status: ev.status,
        note: ev.note,
      }));
      const r = await pool.query(
        `UPDATE internship_applications
         SET status = $2, timeline = $3::jsonb, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [id, status, JSON.stringify(timeline)],
      );
      return r.rows[0] ? mapApplication(r.rows[0]) : null;
    },
    async updateParentDecision(id, decision, note) {
      const existing = await internships.findApplicationById(id);
      if (!existing) return null;
      const r = await pool.query(
        `UPDATE internship_applications
         SET parent_decision = $2, parent_decided_at = NOW(), parent_note = $3, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [id, decision, note ?? null],
      );
      return r.rows[0] ? mapApplication(r.rows[0]) : null;
    },
    async updateMentorCompletion(id, decision, note, documentKeys) {
      const existing = await internships.findApplicationById(id);
      if (!existing) return null;
      const r = await pool.query(
        `UPDATE internship_applications
         SET mentor_completion_decision = $2,
             mentor_completion_note = $3,
             mentor_completion_doc_keys = $4::jsonb,
             mentor_completed_at = NOW(),
             updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [
          id,
          decision,
          note ?? null,
          JSON.stringify(documentKeys ?? existing.mentorCompletionDocKeys),
        ],
      );
      return r.rows[0] ? mapApplication(r.rows[0]) : null;
    },
  };

  const parent: ParentRepository = {
    async createLink(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO parent_student_links
          (id, parent_user_id, student_user_id, status, invite_email)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [id, input.parentUserId, input.studentUserId, input.status, input.inviteEmail],
      );
      return mapParentLink(r.rows[0]);
    },
    async updateLinkStatus(id, status) {
      const r = await pool.query(
        `UPDATE parent_student_links SET status = $2, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [id, status],
      );
      return r.rows[0] ? mapParentLink(r.rows[0]) : null;
    },
    async findLinkById(id) {
      const r = await pool.query('SELECT * FROM parent_student_links WHERE id = $1', [id]);
      return r.rows[0] ? mapParentLink(r.rows[0]) : null;
    },
    async findActiveLink(parentUserId, studentUserId) {
      const r = await pool.query(
        `SELECT * FROM parent_student_links
         WHERE parent_user_id = $1 AND student_user_id = $2 AND status = 'active'
         LIMIT 1`,
        [parentUserId, studentUserId],
      );
      return r.rows[0] ? mapParentLink(r.rows[0]) : null;
    },
    async listLinksByParent(parentUserId) {
      const r = await pool.query(
        `SELECT * FROM parent_student_links WHERE parent_user_id = $1 ORDER BY created_at DESC`,
        [parentUserId],
      );
      return r.rows.map(mapParentLink);
    },
    async listLinksByStudent(studentUserId) {
      const r = await pool.query(
        `SELECT * FROM parent_student_links WHERE student_user_id = $1 ORDER BY created_at DESC`,
        [studentUserId],
      );
      return r.rows.map(mapParentLink);
    },
    async findPrimaryActiveStudent(parentUserId) {
      const r = await pool.query(
        `SELECT * FROM parent_student_links
         WHERE parent_user_id = $1 AND status = 'active'
         ORDER BY created_at ASC
         LIMIT 1`,
        [parentUserId],
      );
      return r.rows[0] ? mapParentLink(r.rows[0]) : null;
    },
    async createThread(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO parent_message_threads
          (id, parent_user_id, student_user_id, participant_user_id, participant_role, topic)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
        [
          id,
          input.parentUserId,
          input.studentUserId,
          input.participantUserId,
          input.participantRole,
          input.topic,
        ],
      );
      return mapParentThread(r.rows[0]);
    },
    async findThreadById(id) {
      const r = await pool.query('SELECT * FROM parent_message_threads WHERE id = $1', [id]);
      return r.rows[0] ? mapParentThread(r.rows[0]) : null;
    },
    async listThreadsByParent(parentUserId) {
      const r = await pool.query(
        `SELECT * FROM parent_message_threads
         WHERE parent_user_id = $1
         ORDER BY updated_at DESC`,
        [parentUserId],
      );
      return r.rows.map(mapParentThread);
    },
    async touchThread(id) {
      await pool.query(
        `UPDATE parent_message_threads SET updated_at = NOW() WHERE id = $1`,
        [id],
      );
    },
    async createMessage(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO parent_messages (id, thread_id, sender_user_id, body)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [id, input.threadId, input.senderUserId, input.body],
      );
      await parent.touchThread(input.threadId);
      return mapParentMessage(r.rows[0]);
    },
    async listMessages(threadId) {
      const r = await pool.query(
        `SELECT * FROM parent_messages WHERE thread_id = $1 ORDER BY created_at ASC`,
        [threadId],
      );
      return r.rows.map(mapParentMessage);
    },
  };

  const mentors: MentorRepository = {
    async createAssignment(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO mentor_assignments (id, mentor_id, student_id, program_id, status)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [id, input.mentorId, input.studentId, input.programId, input.status],
      );
      return mapMentorAssignment(r.rows[0]);
    },
    async findAssignment(mentorId, studentId) {
      const r = await pool.query(
        `SELECT * FROM mentor_assignments
         WHERE mentor_id = $1 AND student_id = $2 AND status = 'active'
         LIMIT 1`,
        [mentorId, studentId],
      );
      return r.rows[0] ? mapMentorAssignment(r.rows[0]) : null;
    },
    async listAssignmentsByMentor(mentorId) {
      const r = await pool.query(
        `SELECT * FROM mentor_assignments
         WHERE mentor_id = $1 AND status = 'active'
         ORDER BY created_at DESC`,
        [mentorId],
      );
      return r.rows.map(mapMentorAssignment);
    },
    async listAssignmentsByStudent(studentId) {
      const r = await pool.query(
        `SELECT * FROM mentor_assignments
         WHERE student_id = $1 AND status = 'active'
         ORDER BY created_at DESC`,
        [studentId],
      );
      return r.rows.map(mapMentorAssignment);
    },
    async createReview(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO mentor_reviews
          (id, mentor_id, student_id, program_id, title, grade, feedback,
           status, template_key, document_keys)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb) RETURNING *`,
        [
          id,
          input.mentorId,
          input.studentId,
          input.programId,
          input.title,
          input.grade,
          input.feedback,
          input.status ?? 'published',
          input.templateKey ?? null,
          JSON.stringify(input.documentKeys ?? []),
        ],
      );
      return mapMentorReview(r.rows[0]);
    },
    async updateReview(id, patch) {
      const existing = await mentors.findReviewById(id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: new Date() };
      const r = await pool.query(
        `UPDATE mentor_reviews SET
           title = $2, grade = $3, feedback = $4, status = $5,
           template_key = $6, document_keys = $7::jsonb, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [
          id,
          next.title,
          next.grade,
          next.feedback,
          next.status,
          next.templateKey,
          JSON.stringify(next.documentKeys),
        ],
      );
      return r.rows[0] ? mapMentorReview(r.rows[0]) : null;
    },
    async findReviewById(id) {
      const r = await pool.query('SELECT * FROM mentor_reviews WHERE id = $1', [id]);
      return r.rows[0] ? mapMentorReview(r.rows[0]) : null;
    },
    async listReviewsByMentor(mentorId) {
      const r = await pool.query(
        `SELECT * FROM mentor_reviews WHERE mentor_id = $1 ORDER BY created_at DESC`,
        [mentorId],
      );
      return r.rows.map(mapMentorReview);
    },
    async createSessionNote(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO mentor_session_notes (id, mentor_id, student_id, note)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [id, input.mentorId, input.studentId, input.note],
      );
      return mapMentorNote(r.rows[0]);
    },
    async listSessionNotes(mentorId, studentId) {
      if (studentId) {
        const r = await pool.query(
          `SELECT * FROM mentor_session_notes
           WHERE mentor_id = $1 AND student_id = $2
           ORDER BY created_at DESC`,
          [mentorId, studentId],
        );
        return r.rows.map(mapMentorNote);
      }
      const r = await pool.query(
        `SELECT * FROM mentor_session_notes WHERE mentor_id = $1 ORDER BY created_at DESC`,
        [mentorId],
      );
      return r.rows.map(mapMentorNote);
    },
    async createSession(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO mentor_sessions
          (id, mentor_id, student_id, program_id, topic, starts_at, ends_at, status, meeting_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          id,
          input.mentorId,
          input.studentId,
          input.programId,
          input.topic,
          input.startsAt,
          input.endsAt,
          input.status,
          input.meetingUrl,
        ],
      );
      return mapMentorSession(r.rows[0]);
    },
    async findSessionById(id) {
      const r = await pool.query('SELECT * FROM mentor_sessions WHERE id = $1', [id]);
      return r.rows[0] ? mapMentorSession(r.rows[0]) : null;
    },
    async listSessionsByMentor(mentorId) {
      const r = await pool.query(
        `SELECT * FROM mentor_sessions WHERE mentor_id = $1 ORDER BY starts_at ASC`,
        [mentorId],
      );
      return r.rows.map(mapMentorSession);
    },
    async listSessionsByStudent(studentId) {
      const r = await pool.query(
        `SELECT * FROM mentor_sessions WHERE student_id = $1 ORDER BY starts_at ASC`,
        [studentId],
      );
      return r.rows.map(mapMentorSession);
    },
    async updateSession(id, patch) {
      const existing = await mentors.findSessionById(id);
      if (!existing) return null;
      const next = { ...existing, ...patch, updatedAt: new Date() };
      const r = await pool.query(
        `UPDATE mentor_sessions SET
           topic = $2, starts_at = $3, ends_at = $4, status = $5,
           meeting_url = $6, program_id = $7, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [
          id,
          next.topic,
          next.startsAt,
          next.endsAt,
          next.status,
          next.meetingUrl,
          next.programId,
        ],
      );
      return r.rows[0] ? mapMentorSession(r.rows[0]) : null;
    },
  };

  const certificates: CertificateRepository = {
    async create(input) {
      const id = randomUUID();
      const r = await pool.query(
        `INSERT INTO certificates
          (id, user_id, program_id, code, title, recipient_name, program_title, issued_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          id,
          input.userId,
          input.programId,
          input.code,
          input.title,
          input.recipientName,
          input.programTitle,
          input.issuedAt,
        ],
      );
      return mapCertificate(r.rows[0]);
    },
    async findById(id) {
      const r = await pool.query('SELECT * FROM certificates WHERE id = $1', [id]);
      return r.rows[0] ? mapCertificate(r.rows[0]) : null;
    },
    async findByCode(code) {
      const r = await pool.query('SELECT * FROM certificates WHERE code = $1', [code]);
      return r.rows[0] ? mapCertificate(r.rows[0]) : null;
    },
    async findByUserProgram(userId, programId) {
      const r = await pool.query(
        `SELECT * FROM certificates WHERE user_id = $1 AND program_id = $2 LIMIT 1`,
        [userId, programId],
      );
      return r.rows[0] ? mapCertificate(r.rows[0]) : null;
    },
    async listByUser(userId) {
      const r = await pool.query(
        `SELECT * FROM certificates WHERE user_id = $1 ORDER BY issued_at DESC`,
        [userId],
      );
      return r.rows.map(mapCertificate);
    },
    async listAll(limit = 50) {
      const r = await pool.query(
        `SELECT * FROM certificates ORDER BY issued_at DESC LIMIT $1`,
        [limit],
      );
      return r.rows.map(mapCertificate);
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
      await pool.end();
    },
  };
}
