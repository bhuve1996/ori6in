import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEMO_CURRICULUM, DEMO_PROGRAMS } from '@ori6in/shared';
import { PageBanner } from '../../../../components/PageBanner';
import { ProgramDetailView } from '../../../../components/ProgramDetailView';
import { programImage } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';
import { SITE_NAME } from '../../../../lib/site';
import { getProgramBySlug } from '../../../../services/public-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return { title: 'Program' };
  return pageMeta({
    title: program.title,
    description: program.summary || `${program.title} on ${SITE_NAME}`,
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const demo = DEMO_PROGRAMS.find((p) => p.slug === program.slug);
  const description =
    program.description && program.description.length > 140
      ? program.description
      : (demo?.description ?? program.description);
  const curriculum = [...(DEMO_CURRICULUM[program.slug] ?? [])].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <>
      <PageBanner
        image={programImage(program.slug)}
        kicker="Program"
        title={program.title}
        lead={program.summary}
      />
      <main id="main-content" className="page page-after-banner page-wide" tabIndex={-1}>
        <ProgramDetailView
          program={{ ...program, description }}
          image={programImage(program.slug)}
          curriculum={curriculum.map((course) => ({
            ...course,
            lessons: [...course.lessons].sort((a, b) => a.sortOrder - b.sortOrder),
          }))}
        />
      </main>
    </>
  );
}
