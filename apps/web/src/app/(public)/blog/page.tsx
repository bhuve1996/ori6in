import { BlogCard } from '../../../components/cards';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { listBlogPosts } from '../../../services/public-content';

export const metadata = pageMeta({
  title: 'Blog',
  description: 'Guides and notes from ORI6IN on learning, mentorship, and careers.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await listBlogPosts();

  return (
    <>
      <PageBanner
        image={BANNERS.blog}
        kicker="Blog"
        title="Stories from the path"
        lead="Guides and notes from ORI6IN — learning, mentorship, and careers."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        {posts.length === 0 ? (
          <p className="meta">No posts yet.</p>
        ) : (
          <div className="mkt-blog-grid">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
