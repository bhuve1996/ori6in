import { Body, Controller, Get, Inject, Param, Post, UseGuards, Req } from '@nestjs/common';
import { Role } from '@ori6in/shared';
import { LearningService } from '../learning/learning.service';
import { JwtAuthGuard, Roles, RolesGuard, type AuthUser } from '../rbac/rbac';

const assignments = new Map<string, unknown[]>();
const quizzes = new Map<string, unknown[]>();
const chatSessions = new Map<string, Array<{ role: string; content: string }>>();

@Controller('student/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class StudentDashboardController {
  constructor(@Inject(LearningService) private readonly learning: LearningService) {}

  @Get()
  dashboard(@Req() req: { user: AuthUser }) {
    return this.learning.dashboard(req.user.sub);
  }
}

@Controller('student/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class LearningCoursesController {
  constructor(@Inject(LearningService) private readonly learning: LearningService) {}

  @Get()
  list(@Req() req: { user: AuthUser }) {
    return this.learning.listCourses(req.user.sub);
  }

  @Get(':id')
  detail(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.learning.getCourse(req.user.sub, id);
  }
}

@Controller('student/lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class LearningLessonsController {
  constructor(@Inject(LearningService) private readonly learning: LearningService) {}

  @Get(':id')
  detail(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.learning.getLesson(req.user.sub, id);
  }

  @Post(':id/complete')
  complete(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.learning.markComplete(req.user.sub, id);
  }
}

@Controller('student/assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class LearningAssignmentsController {
  @Get()
  list(@Req() req: { user: AuthUser }) {
    return assignments.get(req.user.sub) ?? [];
  }

  @Post()
  submit(
    @Req() req: { user: AuthUser },
    @Body() body: { assignmentId: string; fileKey?: string; notes?: string },
  ) {
    const list = assignments.get(req.user.sub) ?? [];
    const row = { ...body, userId: req.user.sub, submittedAt: new Date().toISOString() };
    list.push(row);
    assignments.set(req.user.sub, list);
    return row;
  }
}

@Controller('student/quizzes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class LearningQuizzesController {
  @Get(':id')
  get(@Param('id') id: string) {
    return {
      id,
      title: 'Basic Quiz',
      questions: [{ id: 'q1', prompt: 'What is ORI6IN?', options: ['Platform', 'IDE'] }],
    };
  }

  @Post(':id/submit')
  submit(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: { answers: Record<string, string> },
  ) {
    const row = { quizId: id, userId: req.user.sub, answers: body.answers, score: 1 };
    const list = quizzes.get(req.user.sub) ?? [];
    list.push(row);
    quizzes.set(req.user.sub, list);
    return row;
  }
}

@Controller('ai/chat')
@UseGuards(JwtAuthGuard)
export class AiChatController {
  @Post()
  chat(@Req() req: { user: AuthUser }, @Body() body: { message: string }) {
    const history = chatSessions.get(req.user.sub) ?? [];
    history.push({ role: 'user', content: body.message });
    const reply = {
      role: 'assistant',
      content:
        'ORI6IN AI (basic): I can help with program guidance. Advanced memory/RAG arrives in Month 3.',
    };
    history.push(reply);
    chatSessions.set(req.user.sub, history);
    return { reply: reply.content, turns: history.length };
  }
}
