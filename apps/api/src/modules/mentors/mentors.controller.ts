import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@ori6in/shared';
import { JwtAuthGuard, Roles, RolesGuard, type AuthUser } from '../rbac/rbac';
import { MentorsService } from './mentors.service';

@Controller('mentor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Mentor)
export class MentorsController {
  constructor(@Inject(MentorsService) private readonly mentors: MentorsService) {}

  @Get('dashboard')
  dashboard(@Req() req: { user: AuthUser }) {
    return this.mentors.dashboard(req.user.sub);
  }

  @Get('students')
  students(@Req() req: { user: AuthUser }) {
    return this.mentors.listStudents(req.user.sub);
  }

  @Get('students/:id')
  student(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.mentors.getStudent(req.user.sub, id);
  }

  @Get('reviews')
  reviews(@Req() req: { user: AuthUser }) {
    return this.mentors.listReviews(req.user.sub);
  }

  @Post('reviews')
  createReview(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.mentors.createReview(req.user.sub, body);
  }

  @Patch('reviews/:id')
  updateReview(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.mentors.updateReview(req.user.sub, id, body);
  }

  @Post('reviews/session-notes')
  sessionNote(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.mentors.createSessionNote(req.user.sub, body);
  }

  @Get('sessions')
  sessions(@Req() req: { user: AuthUser }) {
    return this.mentors.listSessions(req.user.sub);
  }

  @Post('sessions')
  bookSession(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.mentors.bookSession(req.user.sub, body);
  }

  @Patch('sessions/:id')
  updateSession(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.mentors.updateSession(req.user.sub, id, body);
  }

  @Get('approvals')
  approvals(@Req() req: { user: AuthUser }) {
    return this.mentors.listApprovals(req.user.sub);
  }

  @Post('approvals/:id/decide')
  decideApproval(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.mentors.decideCompletion(req.user.sub, id, body);
  }
}
