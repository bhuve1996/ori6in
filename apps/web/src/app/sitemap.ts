import type { MetadataRoute } from 'next';
import { absoluteUrl } from '../lib/site';
import { listBlogPosts } from '../services/public-content';

const STATIC_PATHS = [
  '/',
  '/how-it-works',
  '/ed6e',
  '/bri6ge',
  '/study-abroad',
  '/destinations',
  '/test-prep',
  '/programmes',
  '/about',
  '/stories',
  '/contact',
  '/eligibility',
  '/privacy',
  '/terms',
  '/blog',
  '/mentors',
  '/tools',
  '/hub',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const posts = await listBlogPosts();
  for (const post of posts) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
