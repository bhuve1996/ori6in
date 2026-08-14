export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export type InternshipApprovalStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'rejected';

export type InternshipPaymentStatus = 'unpaid' | 'paid' | 'waived';

export interface Internship {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  description: string;
  /** Owning company user (null for legacy/unscoped seeds until linked). */
  companyUserId: string | null;
  approvalStatus: InternshipApprovalStatus;
  paymentStatus: InternshipPaymentStatus;
  /** Visible to students only when true (and typically approved). */
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationTimelineEvent {
  at: Date;
  status: ApplicationStatus;
  note?: string;
}

export interface InternshipApplication {
  id: string;
  userId: string;
  internshipId: string;
  notes: string | null;
  documentKeys: string[];
  status: ApplicationStatus;
  timeline: ApplicationTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export type InternshipCreateInput = Omit<Internship, 'id' | 'createdAt' | 'updatedAt'>;
export type InternshipUpdateInput = Partial<
  Omit<Internship, 'id' | 'slug' | 'createdAt' | 'updatedAt'>
> & { slug?: string };

export interface InternshipRepository {
  create(input: InternshipCreateInput): Promise<Internship>;
  update(id: string, input: InternshipUpdateInput): Promise<Internship | null>;
  findById(id: string): Promise<Internship | null>;
  findBySlug(slug: string): Promise<Internship | null>;
  /** Student-facing published + approved roles. */
  listPublished(): Promise<Internship[]>;
  /** All listings for a company owner. */
  listByCompanyUser(companyUserId: string): Promise<Internship[]>;
  /** Pending admin approval queue. */
  listPendingApproval(): Promise<Internship[]>;
  createApplication(
    input: Omit<InternshipApplication, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<InternshipApplication>;
  findApplication(userId: string, internshipId: string): Promise<InternshipApplication | null>;
  findApplicationById(id: string): Promise<InternshipApplication | null>;
  listApplicationsByUser(userId: string): Promise<InternshipApplication[]>;
  listApplicationsByInternship(internshipId: string): Promise<InternshipApplication[]>;
  updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    note?: string,
  ): Promise<InternshipApplication | null>;
}
