import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { PublicHero } from '../../../../components/public/PublicHero';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';
import { SITE_NAME } from '../../../../lib/site';
import {
  getBlogPostBySlug,
  listBlogPosts,
  resolveDemoPost,
} from '../../../../services/public-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Blog' };
  const resolved = resolveDemoPost(post);
  return pageMeta({
    title: resolved.title,
    description: resolved.excerpt || `${resolved.title} — ${SITE_NAME} blog`,
    path: `/blog/${resolved.slug}`,
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
  const raw = await getBlogPostBySlug(slug);
  if (!raw) notFound();
  const post = resolveDemoPost(raw);
  const body = post.body;

  const allPosts = await listBlogPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main id="main-content" className="pub">
      <PublicHero kicker="Blog" title={post.title} lead={post.excerpt} image={BANNERS.blog} />
      <section className="pub-section">
        <a className="back-link" href="/blog">
          ← Blog
        </a>

        <article className="blog-detail">
          <div className="blog-detail__body prose">{renderBody(body)}</div>

          {related.length > 0 ? (
            <aside className="blog-detail__related" aria-label="Related posts">
              <p className="blog-detail__kicker">Keep reading</p>
              <ul className="blog-detail__related-list">
                {related.map((item) => {
                  const card = resolveDemoPost(item);
                  return (
                    <li key={item.id}>
                      <a href={`/blog/${card.slug}`}>
                        <strong>{card.title}</strong>
                        <span>{card.excerpt}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </aside>
          ) : null}
        </article>
      </section>
    </main>
  );
}
