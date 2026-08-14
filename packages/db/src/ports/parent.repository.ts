export type ParentLinkStatus = 'pending' | 'active' | 'revoked';

export interface ParentStudentLink {
  id: string;
  parentUserId: string;
  studentUserId: string;
  status: ParentLinkStatus;
  /** Email used when inviting (may match student). */
  inviteEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageParticipantRole = 'student' | 'mentor' | 'support';

export interface ParentMessageThread {
  id: string;
  parentUserId: string;
  studentUserId: string;
  /** Other party in the thread (student, mentor, or support bot user). */
  participantUserId: string;
  participantRole: MessageParticipantRole;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParentMessage {
  id: string;
  threadId: string;
  senderUserId: string;
  body: string;
  createdAt: Date;
}

export interface ParentRepository {
  createLink(
    input: Omit<ParentStudentLink, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ParentStudentLink>;
  updateLinkStatus(
    id: string,
    status: ParentLinkStatus,
  ): Promise<ParentStudentLink | null>;
  findLinkById(id: string): Promise<ParentStudentLink | null>;
  findActiveLink(parentUserId: string, studentUserId: string): Promise<ParentStudentLink | null>;
  listLinksByParent(parentUserId: string): Promise<ParentStudentLink[]>;
  listLinksByStudent(studentUserId: string): Promise<ParentStudentLink[]>;
  /** First active linked student for a parent (hub convenience). */
  findPrimaryActiveStudent(parentUserId: string): Promise<ParentStudentLink | null>;

  createThread(
    input: Omit<ParentMessageThread, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ParentMessageThread>;
  findThreadById(id: string): Promise<ParentMessageThread | null>;
  listThreadsByParent(parentUserId: string): Promise<ParentMessageThread[]>;
  touchThread(id: string): Promise<void>;

  createMessage(
    input: Omit<ParentMessage, 'id' | 'createdAt'>,
  ): Promise<ParentMessage>;
  listMessages(threadId: string): Promise<ParentMessage[]>;
}
