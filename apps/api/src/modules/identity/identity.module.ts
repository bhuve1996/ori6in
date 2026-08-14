import { Module } from '@nestjs/common';
import { DemoAccountsService } from './demo-accounts.service';
import { DemoContentService } from './demo-content.service';
import { IdentityController } from './identity.controller';
import { IdentityService } from './identity.service';

@Module({
  controllers: [IdentityController],
  providers: [IdentityService, DemoAccountsService, DemoContentService],
  exports: [IdentityService],
})
export class IdentityModule {}
