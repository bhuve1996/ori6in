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
import { InternshipsService } from './internships.service';

@Controller('internships')
@UseGuards(JwtAuthGuard)
export class InternshipsController {
  constructor(
    @Inject(InternshipsService) private readonly internships: InternshipsService,
  ) {}

  /** Login-only listing (not public). */
  @Get()
  list() {
    return this.internships.list();
  }

  @Get('applications/mine')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  mine(@Req() req: { user: AuthUser }) {
    return this.internships.myApplications(req.user.sub);
  }

  @Post('applications/:id/withdraw')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  withdraw(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.internships.withdraw(req.user.sub, id);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.internships.detail(id);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student)
  apply(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.internships.apply(req.user.sub, id, body);
  }
}
