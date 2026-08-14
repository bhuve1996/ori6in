export type AuthTokenPurpose = 'email_verify' | 'password_reset';

export interface AuthToken {
  id: string;
  userId: string;
  tokenHash: string;
  purpose: AuthTokenPurpose;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export interface AuthTokenRepository {
  create(input: {
    userId: string;
    tokenHash: string;
    purpose: AuthTokenPurpose;
    expiresAt: Date;
  }): Promise<AuthToken>;
  findValidByHash(
    purpose: AuthTokenPurpose,
    tokenHash: string,
  ): Promise<AuthToken | null>;
  markUsed(id: string): Promise<void>;
  invalidateUserPurpose(userId: string, purpose: AuthTokenPurpose): Promise<void>;
}
