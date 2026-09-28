import { redirect } from 'next/navigation';

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<{ program?: string; programme?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const q = new URLSearchParams({ lead: 'quote' });
  const programme = params.programme ?? params.program;
  if (programme) q.set('programme', programme);
  redirect(`/contact?${q.toString()}`);
}
