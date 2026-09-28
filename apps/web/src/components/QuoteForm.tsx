'use client';

import { LeadForm } from './leads/LeadForm';

/** Legacy wrapper — pricing page until it becomes a redirect. */
export function QuoteForm({ defaultProgram = '' }: { programs?: { slug: string; title: string }[]; defaultProgram?: string }) {
  return <LeadForm kind="quote" programmeLabel={defaultProgram || undefined} />;
}
