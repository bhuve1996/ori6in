import { publicFetch, type BlogPost } from '../../../lib/api';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Blog',
  description: 'Guides and notes from ORI6IN on learning, mentorship, and careers.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = (await publicFetch<BlogPost[]>('/blog')) ?? [];

  return (
    <>
      <PageBanner
        image={BANNERS.blog}
        kicker="Blog"
        title="Stories from the path"
        lead="Guides and notes from ORI6IN — learning, mentorship, and careers."
      />
      <main id="main-content" className="page page-after-banner page--wide">
        {posts.length === 0 ? (
          <p className="meta">No posts yet.</p>
        ) : (
          <div className="mkt-blog-grid">
            {posts.map((post, i) => (
              <a key={post.id} className="mkt-blog-card" href={`/blog/${post.slug}`}>
                <div className="mkt-blog-card__media">
                  <img
                    src={BANNERS.blog}
                    alt=""
                    loading={i === 0 ? 'eager' : 'lazy'}
                    style={{ objectPosition: `${20 + ((i * 17) % 60)}% center` }}
                  />
                </div>
                <div className="mkt-blog-card__body">
                  <p className="tile-meta">Article</p>
                  <h2>{post.title}</h2>
                  <p className="tile-sub">{post.excerpt}</p>
                  <span className="tile-cta">Read more</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
