import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { CmsModule } from '../cms/cms.module';
import { ProgramsModule } from '../programs/programs.module';
import {
  AdminCatalogController,
  AdminCmsController,
  AdminDashboardController,
  AdminImpersonationController,
  AdminUsersController,
} from './admin.controllers';

@Module({
  imports: [AdminModule, ProgramsModule, CmsModule],
  controllers: [
    AdminDashboardController,
    AdminUsersController,
    AdminCatalogController,
    AdminCmsController,
    AdminImpersonationController,
  ],
})
export class AdminDashboardModule {}
