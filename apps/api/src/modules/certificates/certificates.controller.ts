import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { Role } from '@ori6in/shared';
import { JwtAuthGuard, Roles, RolesGuard, type AuthUser } from '../rbac/rbac';
import { CertificatesService } from './certificates.service';

@Controller('student/certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Student)
export class StudentCertificatesController {
  constructor(@Inject(CertificatesService) private readonly certs: CertificatesService) {}

  @Get()
  list(@Req() req: { user: AuthUser }) {
    return this.certs.listForStudent(req.user.sub);
  }

  @Get(':id')
  detail(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.certs.getForStudent(req.user.sub, id);
  }
}

@Controller('admin/certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.SuperAdmin)
export class AdminCertificatesController {
  constructor(@Inject(CertificatesService) private readonly certs: CertificatesService) {}

  @Get()
  list() {
    return this.certs.listForAdmin();
  }
}

@Controller('certificates')
export class PublicCertificatesController {
  constructor(@Inject(CertificatesService) private readonly certs: CertificatesService) {}

  @Get('verify/:code')
  verify(@Param('code') code: string) {
    return this.certs.verifyByCode(code);
  }
}
