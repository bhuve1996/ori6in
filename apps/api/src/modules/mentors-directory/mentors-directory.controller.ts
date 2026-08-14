import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';

/** Public mentor directory backed by users with mentor role. */
@Controller('mentors')
export class MentorsDirectoryController {
  constructor(@Inject(AdminService) private readonly admin: AdminService) {}

  @Get()
  list() {
    return this.admin.listMentorsDirectory();
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.admin.getMentorDirectoryDetail(id);
  }
}
