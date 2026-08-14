export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export interface Internship {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  description: string;
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

export interface InternshipRepository {
  create(
    input: Omit<Internship, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Internship>;
  findById(id: string): Promise<Internship | null>;
  findBySlug(slug: string): Promise<Internship | null>;
  listPublished(): Promise<Internship[]>;
  createApplication(
    input: Omit<InternshipApplication, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<InternshipApplication>;
  findApplication(userId: string, internshipId: string): Promise<InternshipApplication | null>;
  listApplicationsByUser(userId: string): Promise<InternshipApplication[]>;
}
