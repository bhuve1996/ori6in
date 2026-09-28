import { redirect } from 'next/navigation';
import { categoryForSlug } from '@ori6in/shared';

export default async function LegacyProgramRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categoryForSlug(slug);
  if (category === 'test-prep' || category === 'combos') {
    redirect('/test-prep');
  }
  if (category) {
    redirect('/study-abroad');
  }
  redirect('/programmes');
}
