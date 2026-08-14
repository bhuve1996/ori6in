import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import {
  bookMentorSessionSchema,
  MENTOR_REVIEW_TEMPLATES,
  mentorCompletionDecisionSchema,
  mentorReviewSchema,
  mentorSessionNoteSchema,
  updateMentorReviewSchema,
  updateMentorSessionSchema,
} from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

@Injectable()
export class MentorsService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  private async assertAssigned(mentorId: string, studentId: string) {
    const assignment = await this.repos.mentors.findAssignment(mentorId, studentId);
    if (!assignment) throw new ForbiddenException('Student is not assigned to you');
    return assignment;
  }

  async dashboard(mentorId: string) {
    const students = await this.listStudents(mentorId);
    const reviews = await this.repos.mentors.listReviewsByMentor(mentorId);
    const notes = await this.repos.mentors.listSessionNotes(mentorId);
    const sessions = await this.repos.mentors.listSessionsByMentor(mentorId);
    const now = Date.now();
    const upcoming = sessions
      .filter((s) => s.status === 'scheduled' && s.startsAt.getTime() >= now)
      .slice(0, 5);
    const pendingApprovals = (await this.listApprovals(mentorId)).items.filter(
      (i) => i.needsMentorDecision,
    ).length;

    return {
      mentorId,
      assignedStudents: students.length,
      students,
      recentReviews: reviews.slice(0, 5),
      recentNotes: notes.slice(0, 5),
      upcomingMeetings: upcoming.map((s) => ({
        id: s.id,
        studentId: s.studentId,
        topic: s.topic,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
        status: s.status,
        meetingUrl: s.meetingUrl,
      })),
      pendingApprovals,
      reviewTemplates: MENTOR_REVIEW_TEMPLATES,
    };
  }

  async listStudents(mentorId: string) {
    const assignments = await this.repos.mentors.listAssignmentsByMentor(mentorId);
    const rows = [];
    for (const a of assignments) {
      const student = await this.repos.users.findById(a.studentId);
      const program = await this.repos.programs.findById(a.programId);
      const progress = await this.studentProgressSummary(a.studentId, a.programId);
      rows.push({
        assignmentId: a.id,
        studentId: a.studentId,
        fullName: student?.fullName ?? 'Student',
        email: student?.email ?? '',
        programId: a.programId,
        programTitle: program?.title ?? 'Program',
        progress,
      });
    }
    return rows;
  }

  private async studentProgressSummary(studentId: string, programId: string) {
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

  async getStudent(mentorId: string, studentId: string) {
    const assignment = await this.assertAssigned(mentorId, studentId);
    const student = await this.repos.users.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');
    const program = await this.repos.programs.findById(assignment.programId);
    const progress = await this.studentProgressSummary(studentId, assignment.programId);
    const notes = await this.repos.mentors.listSessionNotes(mentorId, studentId);
    const reviews = (await this.repos.mentors.listReviewsByMentor(mentorId)).filter(
      (r) => r.studentId === studentId,
    );
    const sessions = (await this.repos.mentors.listSessionsByMentor(mentorId)).filter(
      (s) => s.studentId === studentId,
    );
    const courses = await this.repos.learning.listCoursesByProgramIds([assignment.programId]);

    return {
      student: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
      },
      program: program
        ? { id: program.id, title: program.title, slug: program.slug }
        : null,
      progress,
      courses: courses.map((c) => ({ id: c.id, title: c.title, slug: c.slug })),
      notes,
      reviews,
      sessions,
    };
  }

  async listReviews(mentorId: string) {
    const reviews = await this.repos.mentors.listReviewsByMentor(mentorId);
    const enriched = [];
    for (const r of reviews) {
      const student = await this.repos.users.findById(r.studentId);
      enriched.push({
        ...r,
        studentName: student?.fullName ?? 'Student',
      });
    }
    return { items: enriched, templates: MENTOR_REVIEW_TEMPLATES };
  }

  async createReview(mentorId: string, body: unknown) {
    const parsed = mentorReviewSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const assignment = await this.assertAssigned(mentorId, parsed.data.studentId);
    const review = await this.repos.mentors.createReview({
      mentorId,
      studentId: parsed.data.studentId,
      programId: parsed.data.programId ?? assignment.programId,
      title: parsed.data.title,
      grade: parsed.data.grade,
      feedback: parsed.data.feedback,
      status: parsed.data.status ?? 'published',
      templateKey: parsed.data.templateKey ?? null,
      documentKeys: parsed.data.documentKeys ?? [],
    });

    if (review.status === 'published') {
      await this.repos.notifications.create({
        userId: parsed.data.studentId,
        channel: 'in_app',
        title: 'New mentor review',
        body: `${parsed.data.title} — grade ${parsed.data.grade}`,
      });
    }

    await this.repos.audit.append({
      actorId: mentorId,
      action: 'mentor.review_create',
      resourceType: 'mentor_review',
      resourceId: review.id,
      metadata: {
        studentId: parsed.data.studentId,
        grade: parsed.data.grade,
        status: review.status,
      },
    });

    return review;
  }

  async updateReview(mentorId: string, reviewId: string, body: unknown) {
    const parsed = updateMentorReviewSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const existing = await this.repos.mentors.findReviewById(reviewId);
    if (!existing || existing.mentorId !== mentorId) {
      throw new NotFoundException('Review not found');
    }

    const wasDraft = existing.status === 'draft';
    const updated = await this.repos.mentors.updateReview(reviewId, {
      ...parsed.data,
      templateKey:
        parsed.data.templateKey === undefined
          ? undefined
          : parsed.data.templateKey,
    });
    if (!updated) throw new NotFoundException('Review not found');

    if (wasDraft && updated.status === 'published') {
      await this.repos.notifications.create({
        userId: updated.studentId,
        channel: 'in_app',
        title: 'New mentor review',
        body: `${updated.title} — grade ${updated.grade}`,
      });
    }

    return updated;
  }

  async createSessionNote(mentorId: string, body: unknown) {
    const parsed = mentorSessionNoteSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    await this.assertAssigned(mentorId, parsed.data.studentId);
    const note = await this.repos.mentors.createSessionNote({
      mentorId,
      studentId: parsed.data.studentId,
      note: parsed.data.note,
    });

    await this.repos.audit.append({
      actorId: mentorId,
      action: 'mentor.session_note',
      resourceType: 'mentor_session_note',
      resourceId: note.id,
      metadata: { studentId: parsed.data.studentId },
    });

    return note;
  }

  async listSessions(mentorId: string) {
    const sessions = await this.repos.mentors.listSessionsByMentor(mentorId);
    const items = [];
    for (const s of sessions) {
      const student = await this.repos.users.findById(s.studentId);
      items.push({
        ...s,
        studentName: student?.fullName ?? 'Student',
        studentEmail: student?.email ?? '',
      });
    }
    return { items };
  }

  async bookSession(mentorId: string, body: unknown) {
    const parsed = bookMentorSessionSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const assignment = await this.assertAssigned(mentorId, parsed.data.studentId);
    const startsAt = new Date(parsed.data.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      throw new BadRequestException('Invalid startsAt');
    }
    const endsAt = parsed.data.endsAt
      ? new Date(parsed.data.endsAt)
      : new Date(startsAt.getTime() + 45 * 60 * 1000);
    if (Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) {
      throw new BadRequestException('endsAt must be after startsAt');
    }

    const session = await this.repos.mentors.createSession({
      mentorId,
      studentId: parsed.data.studentId,
      programId: parsed.data.programId ?? assignment.programId,
      topic: parsed.data.topic,
      startsAt,
      endsAt,
      status: 'scheduled',
      meetingUrl: parsed.data.meetingUrl?.trim() || null,
    });

    await this.repos.notifications.create({
      userId: parsed.data.studentId,
      channel: 'in_app',
      title: 'Mentor session booked',
      body: `${parsed.data.topic} on ${startsAt.toLocaleString()}`,
    });

    await this.repos.audit.append({
      actorId: mentorId,
      action: 'mentor.session_book',
      resourceType: 'mentor_session',
      resourceId: session.id,
      metadata: { studentId: parsed.data.studentId, startsAt: startsAt.toISOString() },
    });

    return session;
  }

  async updateSession(mentorId: string, sessionId: string, body: unknown) {
    const parsed = updateMentorSessionSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const existing = await this.repos.mentors.findSessionById(sessionId);
    if (!existing || existing.mentorId !== mentorId) {
      throw new NotFoundException('Session not found');
    }

    const patch: Parameters<Repositories['mentors']['updateSession']>[1] = {};
    if (parsed.data.topic !== undefined) patch.topic = parsed.data.topic;
    if (parsed.data.status !== undefined) patch.status = parsed.data.status;
    if (parsed.data.meetingUrl !== undefined) {
      patch.meetingUrl =
        parsed.data.meetingUrl === null || parsed.data.meetingUrl === ''
          ? null
          : parsed.data.meetingUrl;
    }
    if (parsed.data.startsAt) {
      const startsAt = new Date(parsed.data.startsAt);
      if (Number.isNaN(startsAt.getTime())) throw new BadRequestException('Invalid startsAt');
      patch.startsAt = startsAt;
    }
    if (parsed.data.endsAt) {
      const endsAt = new Date(parsed.data.endsAt);
      if (Number.isNaN(endsAt.getTime())) throw new BadRequestException('Invalid endsAt');
      patch.endsAt = endsAt;
    }

    const updated = await this.repos.mentors.updateSession(sessionId, patch);
    if (!updated) throw new NotFoundException('Session not found');

    if (parsed.data.status === 'cancelled' || parsed.data.startsAt) {
      await this.repos.notifications.create({
        userId: existing.studentId,
        channel: 'in_app',
        title:
          parsed.data.status === 'cancelled'
            ? 'Mentor session cancelled'
            : 'Mentor session updated',
        body: updated.topic,
      });
    }

    return updated;
  }

  async listApprovals(mentorId: string) {
    const assignments = await this.repos.mentors.listAssignmentsByMentor(mentorId);
    const studentIds = new Set(assignments.map((a) => a.studentId));
    const items = [];
    for (const studentId of studentIds) {
      const apps = await this.repos.internships.listApplicationsByUser(studentId);
      const student = await this.repos.users.findById(studentId);
      for (const app of apps) {
        // Completion queue: offered apps (pending or decided)
        if (app.status !== 'offered') continue;
        const role = await this.repos.internships.findById(app.internshipId);
        items.push({
          id: app.id,
          studentId,
          studentName: student?.fullName ?? 'Student',
          title: role?.title ?? 'Internship',
          company: role?.company ?? '',
          status: app.status,
          mentorCompletionDecision: app.mentorCompletionDecision,
          mentorCompletionNote: app.mentorCompletionNote,
          needsMentorDecision: app.mentorCompletionDecision === 'pending',
          createdAt: app.createdAt,
        });
      }
    }
    return { items };
  }

  async decideCompletion(mentorId: string, applicationId: string, body: unknown) {
    const parsed = mentorCompletionDecisionSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const app = await this.repos.internships.findApplicationById(applicationId);
    if (!app) throw new NotFoundException('Application not found');
    await this.assertAssigned(mentorId, app.userId);

    if (app.status !== 'offered') {
      throw new BadRequestException('Completion approval is only for offered internships');
    }
    if (app.mentorCompletionDecision !== 'pending') {
      throw new BadRequestException('Already decided');
    }

    const updated = await this.repos.internships.updateMentorCompletion(
      applicationId,
      parsed.data.decision,
      parsed.data.note,
      parsed.data.documentKeys,
    );
    if (!updated) throw new NotFoundException('Application not found');

    const role = await this.repos.internships.findById(updated.internshipId);
    await this.repos.notifications.create({
      userId: updated.userId,
      channel: 'in_app',
      title:
        parsed.data.decision === 'approved'
          ? 'Mentor approved internship completion'
          : 'Mentor rejected internship completion',
      body: `“${role?.title ?? 'Internship'}”: ${parsed.data.decision}.${
        parsed.data.note ? ` ${parsed.data.note}` : ''
      }`,
    });

    await this.repos.audit.append({
      actorId: mentorId,
      action:
        parsed.data.decision === 'approved'
          ? 'mentor.internship_completion_approved'
          : 'mentor.internship_completion_rejected',
      resourceType: 'internship_application',
      resourceId: applicationId,
      metadata: { note: parsed.data.note ?? null },
    });

    return {
      id: updated.id,
      mentorCompletionDecision: updated.mentorCompletionDecision,
      mentorCompletionNote: updated.mentorCompletionNote,
      mentorCompletedAt: updated.mentorCompletedAt,
    };
  }
}
