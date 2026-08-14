export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  body: string;
  published: boolean;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CmsRepository {
  getPageBySlug(slug: string): Promise<CmsPage | null>;
  listPages(publishedOnly?: boolean): Promise<CmsPage[]>;
  upsertPage(page: Omit<CmsPage, 'id' | 'updatedAt'> & { id?: string }): Promise<CmsPage>;
  listBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogBySlug(slug: string): Promise<BlogPost | null>;
  upsertBlogPost(
    post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> & { id?: string },
  ): Promise<BlogPost>;
}
