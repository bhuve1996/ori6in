import type { UserRepository } from './user.repository.js';
import type { AuditRepository } from './audit.repository.js';
import type { NotificationRepository } from './notification.repository.js';
import type { ProgramRepository } from './program.repository.js';
import type { CmsRepository } from './cms.repository.js';
import type { AuthTokenRepository } from './auth-token.repository.js';
import type { OrderRepository } from './order.repository.js';
import type { PaymentRepository } from './payment.repository.js';
import type { LearningRepository } from './learning.repository.js';
import type { InternshipRepository } from './internship.repository.js';
import type { MentorRepository } from './mentor.repository.js';
import type { ProfileRepository } from './profile.repository.js';

export interface Repositories {
  users: UserRepository;
  authTokens: AuthTokenRepository;
  audit: AuditRepository;
  notifications: NotificationRepository;
  programs: ProgramRepository;
  cms: CmsRepository;
  orders: OrderRepository;
  payments: PaymentRepository;
  learning: LearningRepository;
  internships: InternshipRepository;
  mentors: MentorRepository;
  profiles: ProfileRepository;
  disconnect(): Promise<void>;
}

export type { UserRepository } from './user.repository.js';
export type { AuditRepository, AuditEvent } from './audit.repository.js';
export type {
  NotificationRepository,
  NotificationRecord,
} from './notification.repository.js';
export type { ProgramRepository, Program } from './program.repository.js';
export type { CmsRepository, CmsPage, BlogPost } from './cms.repository.js';
export type {
  AuthTokenRepository,
  AuthToken,
  AuthTokenPurpose,
} from './auth-token.repository.js';
export type { OrderRepository, Order, OrderStatus } from './order.repository.js';
export type {
  PaymentRepository,
  Payment,
  PaymentStatus,
} from './payment.repository.js';
export type {
  LearningRepository,
  Course,
  Lesson,
  LessonProgress,
} from './learning.repository.js';
export type {
  InternshipRepository,
  Internship,
  InternshipApplication,
  ApplicationStatus,
  ApplicationTimelineEvent,
} from './internship.repository.js';
export type {
  MentorRepository,
  MentorAssignment,
  MentorReview,
  MentorSessionNote,
  MentorAssignmentStatus,
} from './mentor.repository.js';
export type {
  ProfileRepository,
  StudentProfile,
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from './profile.repository.js';
