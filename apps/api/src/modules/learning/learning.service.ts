import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { REPOSITORIES } from '../../common/database.service';
import { CertificatesService } from '../certificates/certificates.service';

@Injectable()
export class LearningService {
  constructor(
    @Inject(REPOSITORIES) private readonly repos: Repositories,
    @Inject(CertificatesService) private readonly certificates: CertificatesService,
  ) {}

  private async paidProgramIds(userId: string) {
    const orders = await this.repos.orders.listByUser(userId);
    return [...new Set(orders.filter((o) => o.status === 'paid').map((o) => o.programId))];
  }

  private async assertCourseAccess(userId: string, courseId: string) {
    const course = await this.repos.learning.findCourseById(courseId);
    if (!course || !course.published) throw new NotFoundException('Course not found');
    const paid = await this.paidProgramIds(userId);
    if (!paid.includes(course.programId)) {
      throw new ForbiddenException('Purchase this program to access the course');
    }
    return course;
  }

  async dashboard(userId: string) {
    const courses = await this.listCourses(userId);
    const progress = await this.repos.learning.listProgressForUser(userId);
    const totalLessons = courses.reduce((n, c) => n + c.lessonCount, 0);
    const completed = progress.length;
    const percent =
      totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100);
    const current = courses.find((c) => c.completedLessons < c.lessonCount) ?? courses[0] ?? null;

    const assignments = await this.repos.mentors.listAssignmentsByStudent(userId);
    let mentor: { id: string; fullName: string; email: string } | null = null;
    if (assignments[0]) {
      const m = await this.repos.users.findById(assignments[0].mentorId);
      if (m) mentor = { id: m.id, fullName: m.fullName, email: m.email };
    }

    return {
      welcome: 'Welcome back',
      userId,
      currentProgram: current
        ? { programId: current.programId, courseId: current.id, title: current.title }
        : null,
      progress: { percent, completedLessons: completed, totalLessons },
      enrolledCourses: courses.length,
      mentor,
      quickActions: ['Continue learning', 'Browse internships', 'Ask AI'],
    };
  }

  async listCourses(userId: string) {
    const programIds = await this.paidProgramIds(userId);
    if (!programIds.length) return [];

    const courses = await this.repos.learning.listCoursesByProgramIds(programIds);
    const progress = await this.repos.learning.listProgressForUser(userId);
    const completedSet = new Set(progress.map((p) => p.lessonId));

    const result = [];
    for (const course of courses) {
      const lessons = await this.repos.learning.listLessonsByCourse(course.id);
      const completedLessons = lessons.filter((l) => completedSet.has(l.id)).length;
      const program = await this.repos.programs.findById(course.programId);
      result.push({
        id: course.id,
        programId: course.programId,
        programTitle: program?.title ?? 'Program',
        title: course.title,
        slug: course.slug,
        summary: course.summary,
        lessonCount: lessons.length,
        completedLessons,
        percent:
          lessons.length === 0
            ? 0
            : Math.round((completedLessons / lessons.length) * 100),
      });
    }
    return result;
  }

  async getCourse(userId: string, courseId: string) {
    const course = await this.assertCourseAccess(userId, courseId);
    const lessons = await this.repos.learning.listLessonsByCourse(course.id);
    const progress = await this.repos.learning.listProgressForUser(userId);
    const completedSet = new Set(progress.map((p) => p.lessonId));
    const program = await this.repos.programs.findById(course.programId);

    return {
      id: course.id,
      programId: course.programId,
      programTitle: program?.title ?? 'Program',
      title: course.title,
      slug: course.slug,
      summary: course.summary,
      lessons: lessons.map((l) => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        sortOrder: l.sortOrder,
        completed: completedSet.has(l.id),
      })),
    };
  }

  async getLesson(userId: string, lessonId: string) {
    const lesson = await this.repos.learning.findLessonById(lessonId);
    if (!lesson || !lesson.published) throw new NotFoundException('Lesson not found');
    await this.assertCourseAccess(userId, lesson.courseId);
    const progress = await this.repos.learning.getProgress(userId, lesson.id);
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      slug: lesson.slug,
      content: lesson.content,
      sortOrder: lesson.sortOrder,
      completed: Boolean(progress),
      completedAt: progress?.completedAt ?? null,
    };
  }

  async markComplete(userId: string, lessonId: string) {
    const lesson = await this.repos.learning.findLessonById(lessonId);
    if (!lesson || !lesson.published) throw new NotFoundException('Lesson not found');
    const course = await this.assertCourseAccess(userId, lesson.courseId);
    const progress = await this.repos.learning.markLessonComplete(userId, lesson.id);
    await this.repos.audit.append({
      actorId: userId,
      action: 'learning.lesson_complete',
      resourceType: 'lesson',
      resourceId: lesson.id,
      metadata: { courseId: lesson.courseId },
    });

    const certificate = await this.certificates.issueIfEligible(userId, course.programId);

    return {
      lessonId: lesson.id,
      completed: true,
      completedAt: progress.completedAt,
      certificateId: certificate?.id ?? null,
    };
  }
}
