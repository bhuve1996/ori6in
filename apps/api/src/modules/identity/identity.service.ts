import {
  BadRequestException,
  Inject,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import type { AppConfig } from '@ori6in/config';
import type { AuthTokenPurpose, Repositories } from '@ori6in/db';
import {
  forgotPasswordSchema,
  isDemoEmail,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  type User,
  verifyEmailSchema,
} from '@ori6in/shared';
import { APP_CONFIG, REPOSITORIES } from '../../common/database.service';

function publicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    emailVerified: user.emailVerified,
  };
}

function hashToken(raw: string) {
  return createHash('sha256').update(raw).digest('hex');
}

function issueRawToken() {
  return randomBytes(32).toString('hex');
}

@Injectable()
export class IdentityService {
  constructor(
    @Inject(REPOSITORIES) private readonly repos: Repositories,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  private sign(user: User) {
    return this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  private async issueToken(
    userId: string,
    purpose: AuthTokenPurpose,
    ttlMs: number,
  ) {
    await this.repos.authTokens.invalidateUserPurpose(userId, purpose);
    const raw = issueRawToken();
    await this.repos.authTokens.create({
      userId,
      tokenHash: hashToken(raw),
      purpose,
      expiresAt: new Date(Date.now() + ttlMs),
    });
    return raw;
  }

  private async notify(
    userId: string,
    title: string,
    body: string,
  ) {
    await this.repos.notifications.create({
      userId,
      channel: 'email',
      title,
      body,
    });
  }

  async register(body: unknown) {
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    // One person, one role — single role field; Company/Admin never self-register.
    const { email, password, fullName, role } = parsed.data;

    const existing = await this.repos.users.findByEmail(email);
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.repos.users.create({
      email,
      passwordHash,
      fullName,
      role,
      emailVerified: false,
    });

    await this.repos.audit.append({
      actorId: user.id,
      action: 'auth.register',
      resourceType: 'user',
      resourceId: user.id,
      metadata: { role: user.role },
    });

    const verifyRaw = await this.issueToken(user.id, 'email_verify', 1000 * 60 * 60 * 24);
    const verifyUrl = `${this.config.WEB_URL}/verify-email?token=${verifyRaw}`;
    await this.notify(
      user.id,
      'Verify your ORI6IN email',
      `Open this link to verify your email: ${verifyUrl}`,
    );

    return {
      token: this.sign(user),
      user: publicUser(user),
      ...(this.config.NODE_ENV !== 'production' ? { devVerifyToken: verifyRaw } : {}),
    };
  }

  async login(body: unknown) {
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    if (isDemoEmail(parsed.data.email) && !this.config.ENABLE_DEMO_LOGINS) {
      throw new UnauthorizedException('Demo logins are disabled');
    }

    const user = await this.repos.users.findByEmail(parsed.data.email);
    if (!user?.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    await this.repos.audit.append({
      actorId: user.id,
      action: 'auth.login',
      resourceType: 'user',
      resourceId: user.id,
    });

    return { token: this.sign(user), user: publicUser(user) };
  }

  async forgotPassword(body: unknown) {
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const generic = {
      ok: true as const,
      message: 'If the email exists, a reset link will be sent',
    };

    const user = await this.repos.users.findByEmail(parsed.data.email);
    if (!user) return generic;

    const raw = await this.issueToken(user.id, 'password_reset', 1000 * 60 * 60);
    const resetUrl = `${this.config.WEB_URL}/reset-password?token=${raw}`;
    await this.notify(
      user.id,
      'Reset your ORI6IN password',
      `Open this link to reset your password: ${resetUrl}`,
    );

    await this.repos.audit.append({
      actorId: user.id,
      action: 'auth.forgot_password',
      resourceType: 'user',
      resourceId: user.id,
    });

    return {
      ...generic,
      ...(this.config.NODE_ENV !== 'production' ? { devResetToken: raw } : {}),
    };
  }

  async resetPassword(body: unknown) {
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const record = await this.repos.authTokens.findValidByHash(
      'password_reset',
      hashToken(parsed.data.token),
    );
    if (!record) throw new BadRequestException('Invalid or expired reset token');

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await this.repos.users.update(record.userId, { passwordHash });
    await this.repos.authTokens.markUsed(record.id);
    await this.repos.authTokens.invalidateUserPurpose(record.userId, 'password_reset');

    await this.repos.audit.append({
      actorId: record.userId,
      action: 'auth.reset_password',
      resourceType: 'user',
      resourceId: record.userId,
    });

    return { ok: true };
  }

  async requestEmailVerification(userId: string) {
    const user = await this.repos.users.findById(userId);
    if (!user) throw new UnauthorizedException();
    if (user.emailVerified) return { ok: true, emailVerified: true };

    const raw = await this.issueToken(user.id, 'email_verify', 1000 * 60 * 60 * 24);
    const verifyUrl = `${this.config.WEB_URL}/verify-email?token=${raw}`;
    await this.notify(
      user.id,
      'Verify your ORI6IN email',
      `Open this link to verify your email: ${verifyUrl}`,
    );

    return {
      ok: true,
      emailVerified: false,
      ...(this.config.NODE_ENV !== 'production' ? { devVerifyToken: raw } : {}),
    };
  }

  async verifyEmail(body: unknown) {
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const record = await this.repos.authTokens.findValidByHash(
      'email_verify',
      hashToken(parsed.data.token),
    );
    if (!record) throw new BadRequestException('Invalid or expired verification token');

    const user = await this.repos.users.update(record.userId, { emailVerified: true });
    await this.repos.authTokens.markUsed(record.id);
    await this.repos.authTokens.invalidateUserPurpose(record.userId, 'email_verify');

    await this.repos.audit.append({
      actorId: user.id,
      action: 'auth.verify_email',
      resourceType: 'user',
      resourceId: user.id,
    });

    return { ok: true, emailVerified: user.emailVerified };
  }

  async me(userId: string) {
    const user = await this.repos.users.findById(userId);
    if (!user) throw new UnauthorizedException();
    return publicUser(user);
  }

  /** Google OAuth stays disabled until ID-token verification is wired. */
  async google() {
    throw new NotImplementedException(
      'Google sign-in is not enabled yet. Configure GOOGLE_CLIENT_ID and token verification first.',
    );
  }
}
