export type MentorAssignmentStatus = 'active' | 'ended';

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
  createdAt: Date;
}

export interface MentorSessionNote {
  id: string;
  mentorId: string;
  studentId: string;
  note: string;
  createdAt: Date;
}

export interface MentorRepository {
  createAssignment(
    input: Omit<MentorAssignment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MentorAssignment>;
  findAssignment(mentorId: string, studentId: string): Promise<MentorAssignment | null>;
  listAssignmentsByMentor(mentorId: string): Promise<MentorAssignment[]>;
  listAssignmentsByStudent(studentId: string): Promise<MentorAssignment[]>;
  createReview(
    input: Omit<MentorReview, 'id' | 'createdAt'>,
  ): Promise<MentorReview>;
  listReviewsByMentor(mentorId: string): Promise<MentorReview[]>;
  createSessionNote(
    input: Omit<MentorSessionNote, 'id' | 'createdAt'>,
  ): Promise<MentorSessionNote>;
  listSessionNotes(mentorId: string, studentId?: string): Promise<MentorSessionNote[]>;
}
