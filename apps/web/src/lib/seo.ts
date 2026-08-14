import type { Metadata } from 'next';
import { SITE_NAME, absoluteUrl } from './site';

export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${opts.title} · ${SITE_NAME}`,
      description: opts.description,
      url,
    },
    twitter: {
      title: `${opts.title} · ${SITE_NAME}`,
      description: opts.description,
    },
  };
}
