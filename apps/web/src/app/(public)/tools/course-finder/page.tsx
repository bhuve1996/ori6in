import { PageBanner } from '../../../../components/PageBanner';
import { CourseFinderTool } from '../../../../components/tools/CourseFinderTool';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';

export const metadata = pageMeta({
  title: 'Course & Career Finder',
  description: 'ORI6IN Career Compass lite — map interests to courses and study destinations.',
  path: '/tools/course-finder',
});

export default function CourseFinderPage() {
  return (
    <>
      <PageBanner
        image={BANNERS.about}
        kicker="Tools"
        title="Course & Career Finder"
        lead="Don’t know what to study? Start with pathways, courses, and country fits."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="tools-back">
          <a href="/tools">← All tools</a>
        </p>
        <CourseFinderTool />
      </main>
    </>
  );
}
