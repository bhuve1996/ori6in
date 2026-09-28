import { PublicToolFrame } from '../../../../components/public/PublicToolFrame';
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
    <PublicToolFrame
      title="Course & Career Finder"
      lead="Don’t know what to study? Start with pathways, courses, and country fits."
      image={BANNERS.about}
    >
      <CourseFinderTool />
    </PublicToolFrame>
  );
}
