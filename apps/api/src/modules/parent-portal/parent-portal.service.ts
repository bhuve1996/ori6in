import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AppConfig } from '@ori6in/config';
import type { Repositories } from '@ori6in/db';
import type { User } from '@ori6in/shared';
import {
  createParentThreadSchema,
  DEMO_COUPON_CODE,
  DEMO_COUPON_PERCENT,
  inviteParentLinkSchema,
  parentCheckoutSchema,
  parentInternshipDecisionSchema,
  Role,
  sendParentMessageSchema,
} from '@ori6in/shared';
import { APP_CONFIG, REPOSITORIES } from '../../common/database.service';

@Injectable()
export class ParentPortalService {
  constructor(
    @Inject(REPOSITORIES) private readonly repos: Repositories,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  private async requireLinkedStudent(parentId: string): Promise<User> {
    const link = await this.repos.parent.findPrimaryActiveStudent(parentId);
    if (!link) {
      throw new NotFoundException(
        'No linked student yet — invite a student by email from Links.',
      );
    }
    const student = await this.repos.users.findById(link.studentUserId);
    if (!student) throw new NotFoundException('Linked student not found');
    return student;
  }

  private async progressFor(studentId: string, programId: string) {
    const courses = await this.repos.learning.listCoursesByProgramIds([programId]);
    const progress = await this.repos.learning.listProgressForUser(studentId);
    const completedSet = new Set(progress.map((p) => p.lessonId));
    let total = 0;
    let completed = 0;
    for (const course of courses) {
      const lessons = await this.repos.learning.listLessonsByCourse(course.id);
      total += lessons.length;
      completed += lessons.filter((l) => completedSet.has(l.id)).length;
    }
    return {
      completedLessons: completed,
      totalLessons: total,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  }

  private serializeLink(
    link: Awaited<ReturnType<Repositories['parent']['findLinkById']>>,
    student?: User | null,
  ) {
    if (!link) return null;
    return {
      id: link.id,
      status: link.status,
      inviteEmail: link.inviteEmail,
      studentId: link.studentUserId,
      studentName: student?.fullName ?? null,
      studentEmail: student?.email ?? link.inviteEmail,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }

  async dashboard(parentId: string) {
    const links = await this.repos.parent.listLinksByParent(parentId);
    const active = links.filter((l) => l.status === 'active');
    const notes = await this.repos.notifications.listForUser(parentId);

    let child: { id: string; fullName: string; email: string } | null = null;
    let program: { id: string; title: string; slug: string } | null = null;
    let progress = { completedLessons: 0, totalLessons: 0, percent: 0 };
    let paidOrders = 0;
    let activeApplications = 0;
    let pendingApprovals = 0;

    try {
      const student = await this.requireLinkedStudent(parentId);
      child = { id: student.id, fullName: student.fullName, email: student.email };
      const launchpad = await this.repos.programs.findBySlug('career-launchpad');
      if (launchpad) {
        program = { id: launchpad.id, title: launchpad.title, slug: launchpad.slug };
        progress = await this.progressFor(student.id, launchpad.id);
      }
      const orders = await this.repos.orders.listByUser(student.id);
      paidOrders = orders.filter((o) => o.status === 'paid').length;
      const apps = await this.repos.internships.listApplicationsByUser(student.id);
      activeApplications = apps.filter((a) => a.status !== 'withdrawn').length;
      pendingApprovals = apps.filter((a) => a.parentDecision === 'pending').length;
    } catch {
      /* no active link yet */
    }

    return {
      parentId,
      linkedCount: active.length,
      pendingLinkCount: links.filter((l) => l.status === 'pending').length,
      child,
      program,
      progress,
      paidOrders,
      activeApplications,
      pendingApprovals,
      alerts: notes.slice(0, 5).map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt,
      })),
    };
  }

  async listLinks(parentId: string) {
    const links = await this.repos.parent.listLinksByParent(parentId);
    const items = [];
    for (const link of links) {
      const student = await this.repos.users.findById(link.studentUserId);
      items.push(this.serializeLink(link, student));
    }
    return { items };
  }

  async inviteLink(parentId: string, body: unknown) {
    const parsed = inviteParentLinkSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const email = parsed.data.studentEmail.toLowerCase();
    const student = await this.repos.users.findByEmail(email);
    if (!student || student.role !== Role.Student) {
      throw new NotFoundException('No student account found for that email');
    }

    const existingActive = await this.repos.parent.findActiveLink(parentId, student.id);
    if (existingActive) {
      return this.serializeLink(existingActive, student);
    }

    const prior = (await this.repos.parent.listLinksByParent(parentId)).find(
      (l) => l.studentUserId === student.id && l.status !== 'revoked',
    );
    if (prior?.status === 'pending') {
      return this.serializeLink(prior, student);
    }

    const link = await this.repos.parent.createLink({
      parentUserId: parentId,
      studentUserId: student.id,
      status: 'pending',
      inviteEmail: email,
    });

    await this.repos.notifications.create({
      userId: student.id,
      channel: 'in_app',
      title: 'Parent link request',
      body: 'A parent asked to link to your ORI6IN account. Accept it from Student → Parent links.',
    });

    return this.serializeLink(link, student);
  }

  async revokeLink(parentId: string, linkId: string) {
    const link = await this.repos.parent.findLinkById(linkId);
    if (!link || link.parentUserId !== parentId) {
      throw new NotFoundException('Link not found');
    }
    const updated = await this.repos.parent.updateLinkStatus(linkId, 'revoked');
    const student = await this.repos.users.findById(link.studentUserId);
    return this.serializeLink(updated, student);
  }

  /** Student: list inbound parent link requests. */
  async listLinksForStudent(studentId: string) {
    const links = await this.repos.parent.listLinksByStudent(studentId);
    const items = [];
    for (const link of links) {
      const parent = await this.repos.users.findById(link.parentUserId);
      items.push({
        id: link.id,
        status: link.status,
        parentName: parent?.fullName ?? 'Parent',
        parentEmail: parent?.email ?? '',
        createdAt: link.createdAt,
      });
    }
    return { items };
  }

  async studentRespondToLink(studentId: string, linkId: string, accept: boolean) {
    const link = await this.repos.parent.findLinkById(linkId);
    if (!link || link.studentUserId !== studentId) {
      throw new NotFoundException('Link not found');
    }
    if (link.status !== 'pending') {
      throw new BadRequestException('Link is not pending');
    }
    const updated = await this.repos.parent.updateLinkStatus(
      linkId,
      accept ? 'active' : 'revoked',
    );
    await this.repos.notifications.create({
      userId: link.parentUserId,
      channel: 'in_app',
      title: accept ? 'Student accepted your link' : 'Student declined your link',
      body: accept
        ? 'You can now follow progress, payments, and internship approvals.'
        : 'You can invite again later if needed.',
    });
    return { id: updated?.id, status: updated?.status };
  }

  async progress(parentId: string) {
    const student = await this.requireLinkedStudent(parentId);
    const programs = await this.repos.programs.listPublished();
    const rows = [];
    for (const program of programs) {
      const paid = await this.repos.orders.findPaidByUserProgram(student.id, program.id);
      if (!paid) continue;
      const progress = await this.progressFor(student.id, program.id);
      rows.push({
        programId: program.id,
        title: program.title,
        slug: program.slug,
        progress,
      });
    }
    return {
      student: { id: student.id, fullName: student.fullName },
      programs: rows,
    };
  }

  async payments(parentId: string) {
    const student = await this.requireLinkedStudent(parentId);
    const orders = await this.repos.orders.listByUser(student.id);
    const programs = await this.repos.programs.listPublished(true);
    const available = [];
    for (const program of programs) {
      if (!program.isOwnProduct) continue;
      const paid = await this.repos.orders.findPaidByUserProgram(student.id, program.id);
      if (paid) continue;
      available.push({
        programId: program.id,
        title: program.title,
        slug: program.slug,
        priceCents: program.priceCents,
        currency: program.currency,
      });
    }
    return {
      student: { id: student.id, fullName: student.fullName },
      orders: orders.map((o) => ({
        id: o.id,
        programTitle: o.programTitle,
        amountCents: o.amountCents,
        currency: o.currency,
        status: o.status,
        paidByUserId: o.paidByUserId,
        createdAt: o.createdAt,
      })),
      availablePrograms: available,
    };
  }

  /** Parent checkout for linked student + sandbox mark-paid in one step. */
  async checkoutAndPay(parentId: string, body: unknown) {
    const parsed = parentCheckoutSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const student = await this.requireLinkedStudent(parentId);
    const program = await this.repos.programs.findById(parsed.data.programId);
    if (!program || !program.published || !program.isOwnProduct) {
      throw new NotFoundException('Program not available for purchase');
    }

    const already = await this.repos.orders.findPaidByUserProgram(student.id, program.id);
    if (already) throw new BadRequestException(`Already purchased (order ${already.id})`);

    let amountCents = program.priceCents;
    let couponCode: string | null = null;
    const rawCoupon = parsed.data.couponCode?.toUpperCase();
    if (rawCoupon) {
      if (rawCoupon !== DEMO_COUPON_CODE) {
        throw new BadRequestException('Invalid coupon code');
      }
      couponCode = DEMO_COUPON_CODE;
      amountCents = Math.round(amountCents * (1 - DEMO_COUPON_PERCENT / 100));
    }

    const order = await this.repos.orders.create({
      userId: student.id,
      programId: program.id,
      programTitle: program.title,
      amountCents,
      currency: program.currency,
      couponCode,
      status: 'pending_payment',
    });

    const payment = await this.repos.payments.create({
      orderId: order.id,
      userId: parentId,
      amountCents: order.amountCents,
      currency: order.currency,
      provider: this.config.PAYMENT_PROVIDER,
      providerRef: `parent_mock_${Date.now()}`,
      status: 'paid',
    });

    const paid = await this.repos.orders.update(order.id, {
      paymentId: payment.id,
      status: 'paid',
      paidByUserId: parentId,
    });

    await this.repos.audit.append({
      actorId: parentId,
      action: 'parent.payment_sandbox',
      resourceType: 'order',
      resourceId: order.id,
      metadata: { studentId: student.id, programId: program.id },
    });

    await this.repos.notifications.create({
      userId: student.id,
      channel: 'in_app',
      title: 'Enrollment paid by parent',
      body: `Your parent paid for “${program.title}” (sandbox).`,
    });

    return {
      order: paid,
      payment,
      note: 'Sandbox payment completed for your linked student.',
    };
  }

  async payPendingOrder(parentId: string, orderId: string) {
    const student = await this.requireLinkedStudent(parentId);
    const order = await this.repos.orders.findById(orderId);
    if (!order || order.userId !== student.id) {
      throw new NotFoundException('Order not found');
    }
    if (order.status === 'paid') return { order, note: 'Already paid' };

    const payment = await this.repos.payments.create({
      orderId: order.id,
      userId: parentId,
      amountCents: order.amountCents,
      currency: order.currency,
      provider: this.config.PAYMENT_PROVIDER,
      providerRef: `parent_mock_${Date.now()}`,
      status: 'paid',
    });

    const paid = await this.repos.orders.update(order.id, {
      paymentId: payment.id,
      status: 'paid',
      paidByUserId: parentId,
    });

    await this.repos.audit.append({
      actorId: parentId,
      action: 'parent.payment_sandbox',
      resourceType: 'order',
      resourceId: order.id,
      metadata: { studentId: student.id },
    });

    return { order: paid, payment, note: 'Sandbox payment completed.' };
  }

  async messaging(parentId: string) {
    const student = await this.requireLinkedStudent(parentId);
    const threads = await this.repos.parent.listThreadsByParent(parentId);
    const items = [];
    for (const thread of threads) {
      const messages = await this.repos.parent.listMessages(thread.id);
      const last = messages[messages.length - 1];
      const participant = await this.repos.users.findById(thread.participantUserId);
      items.push({
        id: thread.id,
        topic: thread.topic,
        participantRole: thread.participantRole,
        withName: participant?.fullName ?? thread.participantRole,
        preview: last?.body ?? 'No messages yet',
        updatedAt: thread.updatedAt,
      });
    }
    return {
      student: { id: student.id, fullName: student.fullName },
      threads: items,
    };
  }

  async getThread(parentId: string, threadId: string) {
    const thread = await this.repos.parent.findThreadById(threadId);
    if (!thread || thread.parentUserId !== parentId) {
      throw new NotFoundException('Thread not found');
    }
    const messages = await this.repos.parent.listMessages(threadId);
    const participant = await this.repos.users.findById(thread.participantUserId);
    return {
      thread: {
        id: thread.id,
        topic: thread.topic,
        participantRole: thread.participantRole,
        withName: participant?.fullName ?? thread.participantRole,
      },
      messages: await Promise.all(
        messages.map(async (m) => {
          const sender = await this.repos.users.findById(m.senderUserId);
          return {
            id: m.id,
            body: m.body,
            senderUserId: m.senderUserId,
            senderName: sender?.fullName ?? 'User',
            mine: m.senderUserId === parentId,
            createdAt: m.createdAt,
          };
        }),
      ),
    };
  }

  async createThread(parentId: string, body: unknown) {
    const parsed = createParentThreadSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const student = await this.requireLinkedStudent(parentId);
    let participantUserId = student.id;
    let participantRole = parsed.data.participantRole;

    if (participantRole === 'mentor') {
      const assignments = await this.repos.mentors.listAssignmentsByStudent(student.id);
      const active = assignments[0];
      if (!active) {
        throw new BadRequestException('No mentor assigned to this student yet');
      }
      participantUserId = active.mentorId;
    } else if (participantRole === 'support') {
      const admin = await this.repos.users.findByEmail(`admin@demo.ori6in.test`);
      if (!admin) throw new BadRequestException('Support channel unavailable');
      participantUserId = admin.id;
    }

    const thread = await this.repos.parent.createThread({
      parentUserId: parentId,
      studentUserId: student.id,
      participantUserId,
      participantRole,
      topic: parsed.data.topic,
    });

    return {
      id: thread.id,
      topic: thread.topic,
      participantRole: thread.participantRole,
    };
  }

  async sendMessage(parentId: string, threadId: string, body: unknown) {
    const parsed = sendParentMessageSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const thread = await this.repos.parent.findThreadById(threadId);
    if (!thread || thread.parentUserId !== parentId) {
      throw new NotFoundException('Thread not found');
    }

    const message = await this.repos.parent.createMessage({
      threadId,
      senderUserId: parentId,
      body: parsed.data.body,
    });

    await this.repos.notifications.create({
      userId: thread.participantUserId,
      channel: 'in_app',
      title: `New message: ${thread.topic}`,
      body: parsed.data.body.slice(0, 200),
    });

    return {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      mine: true,
    };
  }

  async approvals(parentId: string) {
    const student = await this.requireLinkedStudent(parentId);
    const apps = await this.repos.internships.listApplicationsByUser(student.id);
    const items = [];
    for (const app of apps) {
      const role = await this.repos.internships.findById(app.internshipId);
      items.push({
        id: app.id,
        type: 'internship_application',
        title: role?.title ?? 'Internship',
        company: role?.company ?? '',
        status: app.status,
        parentDecision: app.parentDecision,
        parentNote: app.parentNote,
        needsParentAck: app.parentDecision === 'pending',
        createdAt: app.createdAt,
      });
    }
    return {
      student: { id: student.id, fullName: student.fullName },
      items,
    };
  }

  async decideApproval(parentId: string, applicationId: string, body: unknown) {
    const parsed = parentInternshipDecisionSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const student = await this.requireLinkedStudent(parentId);
    const app = await this.repos.internships.findApplicationById(applicationId);
    if (!app || app.userId !== student.id) {
      throw new NotFoundException('Application not found');
    }
    if (app.parentDecision !== 'pending') {
      throw new BadRequestException('Already decided');
    }

    const updated = await this.repos.internships.updateParentDecision(
      applicationId,
      parsed.data.decision,
      parsed.data.note,
    );
    if (!updated) throw new NotFoundException('Application not found');

    const role = await this.repos.internships.findById(updated.internshipId);
    await this.repos.notifications.create({
      userId: student.id,
      channel: 'in_app',
      title:
        parsed.data.decision === 'approved'
          ? 'Parent approved internship application'
          : 'Parent rejected internship application',
      body: `“${role?.title ?? 'Internship'}”: ${parsed.data.decision}.${
        parsed.data.note ? ` ${parsed.data.note}` : ''
      }`,
    });

    await this.repos.audit.append({
      actorId: parentId,
      action:
        parsed.data.decision === 'approved'
          ? 'parent.internship_approved'
          : 'parent.internship_rejected',
      resourceType: 'internship_application',
      resourceId: applicationId,
      metadata: { note: parsed.data.note ?? null },
    });

    return {
      id: updated.id,
      parentDecision: updated.parentDecision,
      parentNote: updated.parentNote,
      parentDecidedAt: updated.parentDecidedAt,
    };
  }
}
