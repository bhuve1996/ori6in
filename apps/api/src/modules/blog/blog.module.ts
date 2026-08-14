import { Module } from '@nestjs/common';
import { CmsModule } from '../cms/cms.module';
import { BlogController } from './blog.controller';

@Module({
  imports: [CmsModule],
  controllers: [BlogController],
})
export class BlogModule {}
