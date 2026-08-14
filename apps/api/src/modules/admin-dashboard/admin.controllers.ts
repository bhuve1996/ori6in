import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Repositories } from '@ori6in/db';
import { Role } from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';
import { AdminService } from '../admin/admin.service';
import { CmsService } from '../cms/cms.service';
import { CompanyPortalService } from '../company-portal/company-portal.service';
import { ProgramsService } from '../programs/programs.service';
import { JwtAuthGuard, Roles, RolesGuard, type AuthUser } from '../rbac/rbac';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminDashboardController {
  constructor(@Inject(AdminService) private readonly admin: AdminService) {}

  @Get()
  dashboard() {
    return this.admin.dashboard();
  }
}

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminUsersController {
  constructor(@Inject(AdminService) private readonly admin: AdminService) {}

  @Get()
  list(@Query('role') role?: string) {
    return this.admin.listUsers(role);
  }

  @Post('company')
  createCompany(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.admin.createCompany(req.user.sub, body);
  }

  @Post('assign-mentor')
  assignMentor(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.admin.assignMentor(req.user.sub, body);
  }
}

@Controller('admin/catalog')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminCatalogController {
  constructor(@Inject(ProgramsService) private readonly programs: ProgramsService) {}

  @Get('programs')
  listPrograms() {
    return this.programs.listAllOwn();
  }

  @Post('programs')
  createProgram(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.programs.create(body, req.user.sub);
  }

  @Put('programs/:id')
  updateProgram(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.programs.update(id, body, req.user.sub);
  }
}

@Controller('admin/cms')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminCmsController {
  constructor(@Inject(CmsService) private readonly cms: CmsService) {}

  @Get('pages')
  listPages() {
    return this.cms.listPages(false);
  }

  @Post('pages')
  upsertPage(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.cms.upsertPage(body, req.user.sub);
  }

  @Get('blog')
  blogs() {
    return this.cms.listBlogPosts(false);
  }

  @Post('blog')
  upsertBlog(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.cms.upsertBlog(body, req.user.sub);
  }
}

@Controller('admin/impersonate')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminImpersonationController {
  constructor(
    @Inject(REPOSITORIES) private readonly repos: Repositories,
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}

  @Post(':userId')
  async impersonate(
    @Req() req: { user: AuthUser },
    @Param('userId') userId: string,
  ) {
    const target = await this.repos.users.findById(userId);
    if (!target) throw new BadRequestException('User not found');

    await this.repos.audit.append({
      actorId: req.user.sub,
      action: 'admin.impersonate',
      resourceType: 'user',
      resourceId: target.id,
      metadata: { targetRole: target.role },
    });

    const token = this.jwt.sign({
      sub: target.id,
      email: target.email,
      role: target.role,
      impersonatedBy: req.user.sub,
    });

    return {
      token,
      user: {
        id: target.id,
        email: target.email,
        fullName: target.fullName,
        role: target.role,
      },
      impersonatedBy: req.user.sub,
    };
  }
}

@Controller('admin/approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminApprovalsController {
  constructor(@Inject(CompanyPortalService) private readonly company: CompanyPortalService) {}

  @Get('internships')
  listPending() {
    return this.company.listPendingApprovals();
  }

  @Post('internships/:id/review')
  review(
    @Req() req: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    return this.company.reviewApproval(req.user.sub, id, body);
  }
}
