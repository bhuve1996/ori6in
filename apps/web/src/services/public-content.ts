import { publicFetch, type BlogPost, type CmsPage, type Program } from '../lib/api';
import type { MentorCardData } from '../components/cards/MentorCard';

/** Public catalog / CMS reads — thin service layer over `publicFetch`. */

export async function listPrograms(revalidate = 30): Promise<Program[]> {
  return (await publicFetch<Program[]>('/programs', revalidate)) ?? [];
}

export async function getProgramBySlug(slug: string, revalidate = 30): Promise<Program | null> {
  return publicFetch<Program>(`/programs/${slug}`, revalidate);
}

export async function listMentors(revalidate = 30): Promise<MentorCardData[]> {
  return (await publicFetch<MentorCardData[]>('/mentors', revalidate)) ?? [];
}

export async function getMentorById<T extends { id: string }>(
  id: string,
  revalidate = 30,
): Promise<T | null> {
  return publicFetch<T>(`/mentors/${id}`, revalidate);
}

export async function listBlogPosts(revalidate = 30): Promise<BlogPost[]> {
  return (await publicFetch<BlogPost[]>('/blog', revalidate)) ?? [];
}

export async function getBlogPostBySlug(slug: string, revalidate = 30): Promise<BlogPost | null> {
  return publicFetch<BlogPost>(`/blog/${slug}`, revalidate);
}

export async function getCmsPage(slug: string, revalidate = 30): Promise<CmsPage | null> {
  return publicFetch<CmsPage>(`/cms/pages/${slug}`, revalidate);
}

/** Prefer live CMS body unless it looks like a short/stale Phase-1 stub. */
export function resolveCmsCopy(
  page: CmsPage | null,
  fallback: { title: string; body: string },
  minLen: number,
) {
  const apiBody = page?.body ?? '';
  const useLive = apiBody.length > minLen && !/Phase 1/i.test(apiBody);
  return {
    title: page?.title ?? fallback.title,
    body: useLive ? apiBody : fallback.body,
  };
}
