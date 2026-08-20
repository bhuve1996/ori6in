export interface ComingSoonSignup {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  /** When the “we're live” announcement email was sent. */
  announcedAt: Date | null;
}

export interface ComingSoonSignupRepository {
  upsert(input: {
    email: string;
    name?: string | null;
  }): Promise<{ signup: ComingSoonSignup; created: boolean }>;
  findByEmail(email: string): Promise<ComingSoonSignup | null>;
  listAll(limit?: number): Promise<ComingSoonSignup[]>;
  listPendingAnnounce(limit?: number): Promise<ComingSoonSignup[]>;
  markAnnounced(ids: string[], at: Date): Promise<number>;
  count(): Promise<number>;
}
