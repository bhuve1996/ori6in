type Props = {
  image: string;
  title: string;
  lead?: string;
  kicker?: string;
  tone?: 'dark' | 'light';
};

export function PageBanner({ image, title, lead, kicker, tone = 'dark' }: Props) {
  return (
    <section className="page-banner" data-tone={tone} aria-label={title}>
      <div
        className="page-banner__media"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-hidden="true"
      />
      <img
        className="page-banner__owl"
        src="/brand/owl.png"
        alt=""
        aria-hidden="true"
        width={160}
        height={160}
      />
      <div className="page-banner__inner">
        {kicker ? <p className="page-banner__kicker">{kicker}</p> : null}
        <h1>{title}</h1>
        {lead ? <p>{lead}</p> : null}
      </div>
    </section>
  );
}
