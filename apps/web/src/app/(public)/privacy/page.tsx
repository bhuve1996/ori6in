import { COMPANY } from '@ori6in/shared';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Privacy policy',
  description: 'DPDP Act 2023 privacy disclosure for ORI6IN Education (placeholder pending legal review).',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <main id="main-content" className="pub page">
      <section className="pub-hero pub-hero--simple">
        <p className="type-kicker">Privacy</p>
        <h1 className="type-display-lg">Privacy policy</h1>
        <p className="pub-banner-warn">Placeholder pending advocate review under the DPDP Act 2023.</p>
      </section>
      <section className="pub-section prose">
        <h2>1. What we collect</h2>
        <p>
          Identity, contact details, academic records, test scores, uploaded documents, and payment references —
          nothing without a named purpose.
        </p>
        <h2>2. Consent</h2>
        <p>
          Explicit at sign-up, timestamped with policy version. Under-18 students are enrolled and consented through a
          parent.
        </p>
        <h2>3. Third-party AI</h2>
        <p>
          Document text goes to the Anthropic API only for document check/edit features — disclosed in consent text.
        </p>
        <h2>4. What we never do</h2>
        <p>
          We do not sell data, show commission/partner data to students, put personal data in logs, or allow counsellor
          exports.
        </p>
        <h2>5. Your rights</h2>
        <p>Full data export in one session; deletion within 30 days with an audit record.</p>
        <h2>6. Storage</h2>
        <p>Encrypted at rest and in transit; private buckets; 15-minute signed URLs.</p>
        <p>
          {COMPANY.legalName} · {COMPANY.email}
        </p>
      </section>
    </main>
  );
}
