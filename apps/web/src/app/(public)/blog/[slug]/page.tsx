import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DEMO_POSTS } from '@ori6in/shared';
import { PageBanner } from '../../../../components/PageBanner';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';
import { SITE_NAME } from '../../../../lib/site';
import { getBlogPostBySlug, listBlogPosts } from '../../../../services/public-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Blog' };
  return pageMeta({
    title: post.title,
    description: post.excerpt || `${post.title} — ${SITE_NAME} blog`,
    path: `/blog/${post.slug}`,
  });
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/).filter(Boolean);
  const nodes: ReactNode[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trimEnd());
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith('## ')) {
        nodes.push(<h2 key={`h-${nodes.length}`}>{line.replace(/^##\s+/, '')}</h2>);
        i += 1;
        continue;
      }
      if (line.startsWith('- ')) {
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(lines[i].replace(/^-\s+/, ''));
          i += 1;
        }
        nodes.push(
          <ul key={`ul-${nodes.length}`}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>,
        );
        continue;
      }
      if (/^\d+\.\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s+/, ''));
          i += 1;
        }
        nodes.push(
          <ol key={`ol-${nodes.length}`}>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>,
        );
        continue;
      }
      const para: string[] = [];
      while (
        i < lines.length &&
        !lines[i].startsWith('## ') &&
        !lines[i].startsWith('- ') &&
        !/^\d+\.\s/.test(lines[i])
      ) {
        if (lines[i].trim()) para.push(lines[i].trim());
        i += 1;
      }
      if (para.length) {
        nodes.push(<p key={`p-${nodes.length}`}>{para.join(' ')}</p>);
      }
    }
  }

  return nodes;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const demo = DEMO_POSTS.find((p) => p.slug === post.slug);
  const body =
    post.body && post.body.length > 180 ? post.body : (demo?.body ?? post.body);

  const allPosts = await listBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageBanner
        image={BANNERS.blog}
        kicker="Blog"
        title={post.title}
        lead={post.excerpt}
      />
      <main id="main-content" className="page page-after-banner page-wide" tabIndex={-1}>
        <a className="back-link" href="/blog">
          ← Blog
        </a>

        <article className="blog-detail">
          <div className="blog-detail__body prose">{renderBody(body)}</div>

          {related.length > 0 ? (
            <aside className="blog-detail__related" aria-label="Related posts">
              <p className="blog-detail__kicker">Keep reading</p>
              <ul className="blog-detail__related-list">
                {related.map((item) => (
                  <li key={item.id}>
                    <a href={`/blog/${item.slug}`}>
                      <strong>{item.title}</strong>
                      <span>{item.excerpt}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </article>
      </main>
    </>
  );
}
