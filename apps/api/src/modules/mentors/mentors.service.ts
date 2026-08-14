import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { mentorReviewSchema, mentorSessionNoteSchema } from '@ori6in/shared';
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
    return {
      mentorId,
      assignedStudents: students.length,
      students,
      recentReviews: reviews.slice(0, 5),
      recentNotes: notes.slice(0, 5),
      upcomingMeetings: [],
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
    return enriched;
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
    });

    await this.repos.notifications.create({
      userId: parsed.data.studentId,
      channel: 'in_app',
      title: 'New mentor review',
      body: `${parsed.data.title} — grade ${parsed.data.grade}`,
    });

    await this.repos.audit.append({
      actorId: mentorId,
      action: 'mentor.review_create',
      resourceType: 'mentor_review',
      resourceId: review.id,
      metadata: { studentId: parsed.data.studentId, grade: parsed.data.grade },
    });

    return review;
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
}
