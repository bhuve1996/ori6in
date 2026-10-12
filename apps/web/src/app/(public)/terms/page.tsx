import { COMPANY, GRANT_SUMMARY, formatInr, GRANT_TOTAL_INR } from '@ori6in/shared';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Terms & conditions',
  description: 'ORI6IN Education service terms and 6RANT reward conditions.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <main id="main-content" className="pub page">
      <section className="pub-hero pub-hero--simple">
        <p className="type-kicker">Terms</p>
        <h1 className="type-display-lg">Terms & conditions</h1>
        <p className="type-meta">Last updated September 2026</p>
      </section>
      <section className="pub-section prose">
        <h2>1. Services</h2>
        <p>
          Counselling, ED6E and BRI6GE profile building, and related software. Nothing is a guarantee of admission,
          scholarship or visa.
        </p>
        <h2>2. 6RANT</h2>
        <p>
          Milestone rewards {GRANT_SUMMARY} = {formatInr(GRANT_TOTAL_INR)} as forex credit; verified against documents;
          maker–checker approval; amounts per the signed programme schedule.
        </p>
        <h2>3. 6RAND</h2>
        <p>The concierge tier does not participate in 6RANT.</p>
        <h2>4. Payments</h2>
        <p>Instalment plan on the student’s invoice page; plans set per student.</p>
        <h2>5. Acceptable use</h2>
        <p>No foreign documents, no accessing others’ records, no probing security.</p>
        <h2>6. Governing law</h2>
        <p>{COMPANY.governingLaw}</p>
      </section>
    </main>
  );
}
