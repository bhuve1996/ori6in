import type { MetadataRoute } from 'next';
import { publicFetch, type BlogPost, type Program } from '../lib/api';
import { absoluteUrl } from '../lib/site';

const STATIC_PATHS = [
  '/',
  '/programs',
  '/mentors',
  '/how-it-works',
  '/roles',
  '/blog',
  '/pricing',
  '/about',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  const [programs, posts] = await Promise.all([
    publicFetch<Program[]>('/programs'),
    publicFetch<BlogPost[]>('/blog'),
  ]);

  for (const p of programs ?? []) {
    entries.push({
      url: absoluteUrl(`/programs/${p.slug}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const post of posts ?? []) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
