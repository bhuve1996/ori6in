import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import type { Certificate, Repositories } from '@ori6in/db';
import { formatCertificateCode } from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

function serialize(cert: Certificate) {
  return {
    id: cert.id,
    userId: cert.userId,
    programId: cert.programId,
    code: cert.code,
    title: cert.title,
    recipientName: cert.recipientName,
    programTitle: cert.programTitle,
    issuedAt: cert.issuedAt,
    createdAt: cert.createdAt,
  };
}

@Injectable()
export class CertificatesService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  private newCode() {
    return formatCertificateCode(`ORI6IN-${randomBytes(4).toString('hex')}`);
  }

  async listForStudent(userId: string) {
    const items = await this.repos.certificates.listByUser(userId);
    return { items: items.map(serialize) };
  }

  async getForStudent(userId: string, id: string) {
    const cert = await this.repos.certificates.findById(id);
    if (!cert || cert.userId !== userId) throw new NotFoundException('Certificate not found');
    return serialize(cert);
  }

  async listForAdmin() {
    const items = await this.repos.certificates.listAll(100);
    const enriched = [];
    for (const cert of items) {
      const user = await this.repos.users.findById(cert.userId);
      enriched.push({
        ...serialize(cert),
        recipientEmail: user?.email ?? '',
      });
    }
    return { items: enriched };
  }

  async verifyByCode(code: string) {
    const cert = await this.repos.certificates.findByCode(formatCertificateCode(code));
    if (!cert) throw new NotFoundException('Certificate not found');
    return {
      valid: true,
      code: cert.code,
      recipientName: cert.recipientName,
      programTitle: cert.programTitle,
      title: cert.title,
      issuedAt: cert.issuedAt,
    };
  }

  /** Issue a certificate when the student has completed all published lessons in a paid program. */
  async issueIfEligible(userId: string, programId: string) {
    const existing = await this.repos.certificates.findByUserProgram(userId, programId);
    if (existing) return existing;

    const paid = await this.repos.orders.findPaidByUserProgram(userId, programId);
    if (!paid) return null;

    const program = await this.repos.programs.findById(programId);
    if (!program) return null;

    const courses = await this.repos.learning.listCoursesByProgramIds([programId]);
    const publishedCourses = courses.filter((c) => c.published);
    if (publishedCourses.length === 0) return null;

    const progress = await this.repos.learning.listProgressForUser(userId);
    const completed = new Set(progress.map((p) => p.lessonId));

    let total = 0;
    let done = 0;
    for (const course of publishedCourses) {
      const lessons = (await this.repos.learning.listLessonsByCourse(course.id)).filter(
        (l) => l.published,
      );
      total += lessons.length;
      done += lessons.filter((l) => completed.has(l.id)).length;
    }
    if (total === 0 || done < total) return null;

    const user = await this.repos.users.findById(userId);
    if (!user) return null;

    let code = this.newCode();
    while (await this.repos.certificates.findByCode(code)) {
      code = this.newCode();
    }

    const cert = await this.repos.certificates.create({
      userId,
      programId,
      code,
      title: `Certificate of Completion — ${program.title}`,
      recipientName: user.fullName,
      programTitle: program.title,
      issuedAt: new Date(),
    });

    await this.repos.notifications.create({
      userId,
      channel: 'in_app',
      title: 'Certificate issued',
      body: `You earned a certificate for “${program.title}”. View it in Certificates.`,
    });

    await this.repos.audit.append({
      actorId: userId,
      action: 'certificates.issue',
      resourceType: 'certificate',
      resourceId: cert.id,
      metadata: { programId, code: cert.code },
    });

    return cert;
  }
}
