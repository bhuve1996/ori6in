export interface Certificate {
  id: string;
  userId: string;
  programId: string;
  /** Public verification code (unique). */
  code: string;
  title: string;
  recipientName: string;
  programTitle: string;
  issuedAt: Date;
  createdAt: Date;
}

export interface CertificateRepository {
  create(input: Omit<Certificate, 'id' | 'createdAt'>): Promise<Certificate>;
  findById(id: string): Promise<Certificate | null>;
  findByCode(code: string): Promise<Certificate | null>;
  findByUserProgram(userId: string, programId: string): Promise<Certificate | null>;
  listByUser(userId: string): Promise<Certificate[]>;
  listAll(limit?: number): Promise<Certificate[]>;
}
