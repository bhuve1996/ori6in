type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Safe JSON-LD for Organization / WebSite / breadcrumbs. */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
