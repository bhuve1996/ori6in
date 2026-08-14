type Link = { href: string; label: string };

export function PortalNavGrid({ links }: { links: Link[] }) {
  return (
    <div className="portal-grid">
      {links.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </div>
  );
}
