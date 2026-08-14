import { Controller, Get, Inject, Param } from '@nestjs/common';
import { CmsService } from '../cms/cms.service';

@Controller('cms/pages')
export class CmsPagesController {
  constructor(@Inject(CmsService) private readonly cms: CmsService) {}

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.cms.getPublishedPage(slug);
  }
}
