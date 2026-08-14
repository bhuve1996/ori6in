import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Role } from '@ori6in/shared';
import { JwtAuthGuard, Roles, RolesGuard, type AuthUser } from '../rbac/rbac';
import { ProfileService } from './profile.service';

@Controller('student/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class StudentProfileController {
  constructor(@Inject(ProfileService) private readonly profiles: ProfileService) {}

  @Get()
  get(@Req() req: { user: AuthUser }) {
    return this.profiles.get(req.user.sub);
  }

  @Post()
  save(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.profiles.save(req.user.sub, body);
  }
}
