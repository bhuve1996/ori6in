import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CmsService } from '../cms/cms.service';

@Controller('blog')
export class BlogController {
  constructor(@Inject(CmsService) private readonly cms: CmsService) {}

  @Get()
  list() {
    return this.cms.listBlogPosts(true);
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.cms.getPublishedBlog(slug);
  }
}
