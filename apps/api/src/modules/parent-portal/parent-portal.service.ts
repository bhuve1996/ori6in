import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { DEMO_STUDENT_PROFILE } from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

@Injectable()
export class ParentPortalService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  private async linkedStudent() {
    const student = await this.repos.users.findByEmail(DEMO_STUDENT_PROFILE.email);
    if (!student) throw new NotFoundException('Linked student not found — run demo seed');
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

  async dashboard(parentId: string) {
    const student = await this.linkedStudent();
    const program = await this.repos.programs.findBySlug('career-launchpad');
    const progress = program
      ? await this.progressFor(student.id, program.id)
      : { completedLessons: 0, totalLessons: 0, percent: 0 };
    const orders = await this.repos.orders.listByUser(student.id);
    const apps = await this.repos.internships.listApplicationsByUser(student.id);
    const notes = await this.repos.notifications.listForUser(parentId);

    return {
      parentId,
      child: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
      },
      program: program
        ? { id: program.id, title: program.title, slug: program.slug }
        : null,
      progress,
      paidOrders: orders.filter((o) => o.status === 'paid').length,
      activeApplications: apps.filter((a) => a.status !== 'withdrawn').length,
      alerts: notes.slice(0, 5).map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt,
      })),
    };
  }

  async progress() {
    const student = await this.linkedStudent();
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

  async payments() {
    const student = await this.linkedStudent();
    const orders = await this.repos.orders.listByUser(student.id);
    return {
      student: { id: student.id, fullName: student.fullName },
      orders: orders.map((o) => ({
        id: o.id,
        programTitle: o.programTitle,
        amountCents: o.amountCents,
        currency: o.currency,
        status: o.status,
        createdAt: o.createdAt,
      })),
    };
  }

  async messaging() {
    const student = await this.linkedStudent();
    return {
      threads: [
        {
          id: 'thread-mentor',
          withName: 'Demo Mentor',
          topic: 'Career Launchpad check-in',
          preview: 'Weekly review is scheduled for Friday.',
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'thread-support',
          withName: 'ORI6IN Support',
          topic: 'Account help',
          preview: 'Your child is enrolled in Career Launchpad.',
          updatedAt: new Date().toISOString(),
        },
      ],
      student: { id: student.id, fullName: student.fullName },
    };
  }

  async approvals() {
    const student = await this.linkedStudent();
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
        needsParentAck: app.status === 'applied' || app.status === 'under_review',
        createdAt: app.createdAt,
      });
    }
    if (items.length === 0) {
      items.push({
        id: 'demo-ack',
        type: 'program_notice',
        title: 'Career Launchpad enrollment',
        company: 'ORI6IN',
        status: 'acknowledged',
        needsParentAck: false,
        createdAt: new Date().toISOString(),
      });
    }
    return {
      student: { id: student.id, fullName: student.fullName },
      items,
    };
  }

  async acknowledge(approvalId: string) {
    return {
      id: approvalId,
      status: 'acknowledged',
      message: 'Marked as reviewed by parent',
    };
  }
}
