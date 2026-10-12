import { COMPANY } from '@ori6in/shared';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Privacy policy',
  description: 'How ORI6IN Education collects, uses and protects personal data under the DPDP Act 2023.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <main id="main-content" className="pub page">
      <section className="pub-hero pub-hero--simple">
        <p className="type-kicker">Privacy</p>
        <h1 className="type-display-lg">Privacy policy</h1>
        <p className="type-meta">Last updated September 2026 · DPDP Act 2023</p>
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
          When you use document check or edit features, the document text is sent to a trusted AI provider for that
          purpose only. This is explained in the consent you give.
        </p>
        <h2>4. What we never do</h2>
        <p>
          We do not sell your data, share commission or partner details with students, or let counsellors take student
          lists outside ORI6IN.
        </p>
        <h2>5. Your rights</h2>
        <p>You can request a full copy of your data at any time, and deletion within 30 days.</p>
        <h2>6. Storage</h2>
        <p>Your data is encrypted and kept in access-limited storage. Document links expire shortly after use.</p>
        <p>
          {COMPANY.legalName} · {COMPANY.email}
        </p>
      </section>
    </main>
  );
}
