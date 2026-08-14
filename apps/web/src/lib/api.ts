export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function publicFetch<T>(path: string, revalidate = 30): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type Program = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  priceCents: number;
  currency: string;
  published: boolean;
};

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  body: string;
  published: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  published: boolean;
};
