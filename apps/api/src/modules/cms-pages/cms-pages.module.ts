import { Module } from '@nestjs/common';
import { CmsModule } from '../cms/cms.module';
import { CmsPagesController } from './cms-pages.controller';

@Module({
  imports: [CmsModule],
  controllers: [CmsPagesController],
})
export class CmsPagesModule {}
