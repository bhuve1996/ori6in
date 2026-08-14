import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { blogPostUpsertSchema, cmsPageUpsertSchema } from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

@Injectable()
export class CmsService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  async getPublishedPage(slug: string) {
    const page = await this.repos.cms.getPageBySlug(slug);
    if (!page || !page.published) throw new NotFoundException('Page not found');
    return page;
  }

  listPages(publishedOnly = true) {
    return this.repos.cms.listPages(publishedOnly);
  }

  async upsertPage(body: unknown, actorId?: string) {
    const parsed = cmsPageUpsertSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const page = await this.repos.cms.upsertPage(parsed.data);
    if (actorId) {
      await this.repos.audit.append({
        actorId,
        action: 'cms.upsert_page',
        resourceType: 'cms_page',
        resourceId: page.id,
        metadata: { slug: page.slug, published: page.published },
      });
    }
    return page;
  }

  listBlogPosts(publishedOnly = true) {
    return this.repos.cms.listBlogPosts(publishedOnly);
  }

  async getPublishedBlog(slug: string) {
    const post = await this.repos.cms.getBlogBySlug(slug);
    if (!post || !post.published) throw new NotFoundException('Post not found');
    return post;
  }

  async upsertBlog(body: unknown, actorId?: string) {
    const parsed = blogPostUpsertSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const post = await this.repos.cms.upsertBlogPost(parsed.data);
    if (actorId) {
      await this.repos.audit.append({
        actorId,
        action: 'cms.upsert_blog',
        resourceType: 'blog_post',
        resourceId: post.id,
        metadata: { slug: post.slug, published: post.published },
      });
    }
    return post;
  }
}
