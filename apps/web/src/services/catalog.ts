import { publicFetch } from '../lib/api';
import type { Program } from '../lib/api';

export type CatalogItem = {
  programId: string;
  slug: string;
  title: string;
  summary: string;
  priceCents: number;
  currency: string;
};

export async function listCatalog(revalidate = 30): Promise<CatalogItem[]> {
  return (await publicFetch<CatalogItem[]>('/catalog', revalidate)) ?? [];
}

export function catalogItemToProgram(item: CatalogItem): Program {
  return {
    id: item.programId,
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    description: '',
    priceCents: item.priceCents,
    currency: item.currency,
    published: true,
  };
}
