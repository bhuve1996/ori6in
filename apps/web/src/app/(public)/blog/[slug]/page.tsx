import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicFetch, type BlogPost } from '../../../../lib/api';
import { PageBanner } from '../../../../components/PageBanner';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';
import { SITE_NAME } from '../../../../lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await publicFetch<BlogPost>(`/blog/${slug}`);
  if (!post) return { title: 'Blog' };
  return pageMeta({
    title: post.title,
    description: post.excerpt || `${post.title} — ${SITE_NAME} blog`,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await publicFetch<BlogPost>(`/blog/${slug}`);
  if (!post) notFound();

  return (
    <>
      <PageBanner
        image={BANNERS.blog}
        kicker="Blog"
        title={post.title}
        lead={post.excerpt}
      />
      <main id="main-content" className="page page-after-banner" tabIndex={-1}>
        <a className="back-link" href="/blog">
          ← Blog
        </a>
        <article className="prose">{post.body}</article>
      </main>
    </>
  );
}
