import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
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

  @Post('reviews/session-notes')
  sessionNote(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.mentors.createSessionNote(req.user.sub, body);
  }
}
