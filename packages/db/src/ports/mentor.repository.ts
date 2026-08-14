export type MentorAssignmentStatus = 'active' | 'ended';

export type MentorReviewStatus = 'draft' | 'published';

export type MentorSessionStatus = 'scheduled' | 'completed' | 'cancelled';

export interface MentorAssignment {
  id: string;
  mentorId: string;
  studentId: string;
  programId: string;
  status: MentorAssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorReview {
  id: string;
  mentorId: string;
  studentId: string;
  programId: string | null;
  title: string;
  grade: string;
  feedback: string;
  status: MentorReviewStatus;
  templateKey: string | null;
  documentKeys: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorSessionNote {
  id: string;
  mentorId: string;
  studentId: string;
  note: string;
  createdAt: Date;
}

export interface MentorSession {
  id: string;
  mentorId: string;
  studentId: string;
  programId: string | null;
  topic: string;
  startsAt: Date;
  endsAt: Date;
  status: MentorSessionStatus;
  meetingUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorRepository {
  createAssignment(
    input: Omit<MentorAssignment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MentorAssignment>;
  findAssignment(mentorId: string, studentId: string): Promise<MentorAssignment | null>;
  listAssignmentsByMentor(mentorId: string): Promise<MentorAssignment[]>;
  listAssignmentsByStudent(studentId: string): Promise<MentorAssignment[]>;

  createReview(
    input: Omit<MentorReview, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MentorReview>;
  updateReview(
    id: string,
    patch: Partial<
      Pick<MentorReview, 'title' | 'grade' | 'feedback' | 'status' | 'templateKey' | 'documentKeys'>
    >,
  ): Promise<MentorReview | null>;
  findReviewById(id: string): Promise<MentorReview | null>;
  listReviewsByMentor(mentorId: string): Promise<MentorReview[]>;

  createSessionNote(
    input: Omit<MentorSessionNote, 'id' | 'createdAt'>,
  ): Promise<MentorSessionNote>;
  listSessionNotes(mentorId: string, studentId?: string): Promise<MentorSessionNote[]>;

  createSession(
    input: Omit<MentorSession, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MentorSession>;
  findSessionById(id: string): Promise<MentorSession | null>;
  listSessionsByMentor(mentorId: string): Promise<MentorSession[]>;
  listSessionsByStudent(studentId: string): Promise<MentorSession[]>;
  updateSession(
    id: string,
    patch: Partial<
      Pick<MentorSession, 'topic' | 'startsAt' | 'endsAt' | 'status' | 'meetingUrl' | 'programId'>
    >,
  ): Promise<MentorSession | null>;
}
