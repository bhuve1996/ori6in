import { BlogCard } from '../../../components/cards';
import { PublicHero } from '../../../components/public/PublicHero';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { listBlogPosts, resolveDemoPost } from '../../../services/public-content';

export const metadata = pageMeta({
  title: 'Blog',
  description: 'Guides from ORI6IN on study abroad, applications, scholarships, and visas.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await listBlogPosts();

  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Blog"
        title="Stories from the path"
        lead="Guides and notes from ORI6IN — destinations, applications, funding, and fly-ready tips."
        image={BANNERS.blog}
      />
      <section className="pub-section">
        {posts.length === 0 ? (
          <p className="meta">No posts yet.</p>
        ) : (
          <div className="mkt-blog-grid">
            {posts.map((post, i) => {
              const item = resolveDemoPost(post);
              return <BlogCard key={post.id} post={item} index={i} />;
            })}
          </div>
        )}
      </section>
    </main>
  );
}
