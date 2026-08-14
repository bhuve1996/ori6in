export interface Course {
  id: string;
  programId: string;
  title: string;
  slug: string;
  summary: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  content: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: Date;
}

export interface LearningRepository {
  createCourse(
    input: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Course>;
  findCourseById(id: string): Promise<Course | null>;
  findCourseByProgramSlug(programId: string, slug: string): Promise<Course | null>;
  listCoursesByProgramIds(programIds: string[]): Promise<Course[]>;
  createLesson(
    input: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Lesson>;
  findLessonById(id: string): Promise<Lesson | null>;
  findLessonByCourseSlug(courseId: string, slug: string): Promise<Lesson | null>;
  listLessonsByCourse(courseId: string): Promise<Lesson[]>;
  getProgress(userId: string, lessonId: string): Promise<LessonProgress | null>;
  listProgressForUser(userId: string): Promise<LessonProgress[]>;
  markLessonComplete(userId: string, lessonId: string): Promise<LessonProgress>;
}
