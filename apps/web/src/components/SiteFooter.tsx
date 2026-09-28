'use client';

import { COMPANY, FOOTER_ACCOUNTS, FOOTER_COMPANY, FOOTER_PROGRAMMES } from '@ori6in/shared';
import { usePathname } from 'next/navigation';
import { BRAND } from '../lib/media';
import { isPortalChromePath } from '../lib/routes';
import { useLead } from './leads/LeadContext';
import { goldSixNodes } from './public/GoldSix';

export function SiteFooter() {
  const pathname = usePathname();
  const { openLead } = useLead();
  const compact = isPortalChromePath(pathname);

  if (compact) {
    return (
      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__copy">
            © {COMPANY.copyrightYear} {COMPANY.legalName}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__col">
          <div className="site-footer__brand-block">
            <img src={BRAND.owl} alt="" width={40} height={40} className="site-footer__owl" />
            <p className="site-footer__name">
              <img
                className="site-footer__logo"
                src={BRAND.logoDark}
                alt="ORI6IN"
                width={160}
                height={40}
              />
            </p>
          </div>
          <p className="site-footer__tagline">{COMPANY.tagline}</p>
          <div className="site-footer__contact">
            <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a>
            <a href={COMPANY.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          </div>
        </div>
        <nav className="site-footer__col" aria-label="Programmes">
          <h2>Programmes</h2>
          {FOOTER_PROGRAMMES.map((link) => (
            <a key={link.href} href={link.href}>
              {goldSixNodes(link.label)}
            </a>
          ))}
        </nav>
        <nav className="site-footer__col" aria-label="Company">
          <h2>Company</h2>
          {FOOTER_COMPANY.map((link) => (
            <a key={link.href} href={link.href}>
              {goldSixNodes(link.label)}
            </a>
          ))}
        </nav>
        <nav className="site-footer__col" aria-label="Accounts">
          <h2>Accounts</h2>
          {FOOTER_ACCOUNTS.map((link) => (
            <a key={link.label} href={link.href}>
              {goldSixNodes(link.label)}
            </a>
          ))}
          <button type="button" className="btn btn-accent" onClick={() => openLead({ kind: 'discovery' })}>
            Book a free session
          </button>
        </nav>
      </div>
      <p className="site-footer__legal">
        © {COMPANY.copyrightYear} {COMPANY.legalName} (formerly {COMPANY.formerName}) · {COMPANY.address}{' '}
        · {goldSixNodes(COMPANY.brandsLegal)} · CIN {COMPANY.cin}
      </p>
    </footer>
  );
}
