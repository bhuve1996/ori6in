import { DEMO_MENTORS, DEMO_POSTS } from '@ori6in/shared';
import { publicFetch, type BlogPost, type CmsPage, type Program } from '../lib/api';
import type { MentorCardData } from '../components/cards/MentorCard';

/** Public catalog / CMS reads — thin service layer over `publicFetch`. */

export function resolveDemoPost(post: BlogPost): BlogPost {
  const demo = DEMO_POSTS.find((p) => p.slug === post.slug);
  if (!demo) return post;
  return { ...post, title: demo.title, excerpt: demo.excerpt, body: demo.body };
}

export function resolveDemoMentor<T extends MentorCardData>(mentor: T): T {
  const demo = DEMO_MENTORS.find(
    (m) => m.fullName.toLowerCase() === mentor.fullName.toLowerCase(),
  );
  if (!demo) return mentor;
  return {
    ...mentor,
    title: demo.title,
    bio: demo.bio,
    skills: demo.skills,
    location: mentor.location || demo.location,
  };
}

export async function listPrograms(revalidate = 30): Promise<Program[]> {
  return (await publicFetch<Program[]>('/programs', revalidate)) ?? [];
}

export async function getProgramBySlug(slug: string, revalidate = 30): Promise<Program | null> {
  return publicFetch<Program>(`/programs/${slug}`, revalidate);
}

export async function listMentors(revalidate = 30): Promise<MentorCardData[]> {
  const mentors = (await publicFetch<MentorCardData[]>('/mentors', revalidate)) ?? [];
  if (mentors.length) return mentors.map((m) => resolveDemoMentor(m));
  return DEMO_MENTORS.map((m) => ({
    id: m.emailLocalPart,
    fullName: m.fullName,
    title: m.title,
    bio: m.bio,
    skills: [...m.skills],
    location: m.location,
  }));
}

export async function getMentorById<T extends MentorCardData>(
  id: string,
  revalidate = 30,
): Promise<T | null> {
  const mentor = await publicFetch<T>(`/mentors/${id}`, revalidate);
  if (mentor) return resolveDemoMentor(mentor);
  const demo = DEMO_MENTORS.find((m) => m.emailLocalPart === id || m.fullName === id);
  if (!demo) return null;
  return resolveDemoMentor({
    id: demo.emailLocalPart,
    fullName: demo.fullName,
    title: demo.title,
    bio: demo.bio,
    skills: [...demo.skills],
    location: demo.location,
    assignedStudents: 0,
  } as unknown as T);
}

export async function listBlogPosts(revalidate = 30): Promise<BlogPost[]> {
  const posts = (await publicFetch<BlogPost[]>('/blog', revalidate)) ?? [];
  if (posts.length) return posts.map(resolveDemoPost);
  return DEMO_POSTS.map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    body: p.body,
    published: p.published,
  }));
}

export async function getBlogPostBySlug(slug: string, revalidate = 30): Promise<BlogPost | null> {
  const post = await publicFetch<BlogPost>(`/blog/${slug}`, revalidate);
  if (post) return resolveDemoPost(post);
  const demo = DEMO_POSTS.find((p) => p.slug === slug);
  if (!demo) return null;
  return {
    id: demo.slug,
    slug: demo.slug,
    title: demo.title,
    excerpt: demo.excerpt,
    body: demo.body,
    published: demo.published,
  };
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
