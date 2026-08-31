import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'What you can do',
  description:
    'What students, mentors, parents, companies, and admins can do on ORI6IN — today and in Phase 2.',
  path: '/roles',
});

type RoleBlock = {
  id: string;
  role: string;
  headline: string;
  canDo: string[];
  phase2: string[];
  cta: { href: string; label: string };
};

const ROLES: RoleBlock[] = [
  {
    id: 'student',
    role: 'Student',
    headline: 'Plan, prepare, and apply for study abroad with counsellor support.',
    canDo: [
      'Browse ORI6IN programs (packages, test prep, admissions, combos)',
      'Use free tools: University Finder, Course Finder, Scholarships, Cost Calculator',
      'Request a personalised quote (no public price list)',
      'Take courses and lessons for enrolled programs',
      'Work with assigned counsellors / mentors on your plan',
      'Join Student Hub communities and pre-departure resources',
      'Track orders, notifications, and progress in your hub',
      'Earn a completion certificate when program lessons are done',
    ],
    phase2: [
      'Live Student Hub forums and event RSVPs',
      'Deeper document uploads on applications',
      'Richer progress storytelling beyond certificates',
    ],
    cta: { href: '/register', label: 'Start as a student' },
  },
  {
    id: 'mentor',
    role: 'Counsellor',
    headline: 'Guide students through shortlists, applications, and visa readiness.',
    canDo: [
      'Open a counsellor hub with assigned students',
      'Book and manage counselling sessions',
      'Write reviews and session notes',
      'Appear in the public counsellors directory',
      'Support internship / opportunity completion workflows where used',
    ],
    phase2: [
      'Student-side session request / reschedule calendar',
      'Richer rubrics and file attachments on reviews',
      'Video meeting links integrated with live providers',
    ],
    cta: { href: '/mentors', label: 'Meet counsellors' },
  },
  {
    id: 'parent',
    role: 'Parent',
    headline: 'Stay close to progress, payments, and approvals.',
    canDo: [
      'Invite and link a real student account (student must accept)',
      'Follow learning progress for the linked student',
      'Sandbox-pay for programs on their behalf',
      'Two-way messaging with student, counsellor, or support',
      'Approve or reject opportunity applications when required',
    ],
    phase2: [
      'Multi-child dashboards and finer consent controls',
      'Calendar sync for counselling sessions',
      'Live payment provider (still sandbox today)',
    ],
    cta: { href: '/demo-login', label: 'Try parent demo' },
  },
  {
    id: 'company',
    role: 'Company',
    headline: 'Post roles and review applicants (platform partnership track).',
    canDo: [
      'Open a company hub with role and applicant overviews',
      'Create internship role drafts and edit them',
      'Sandbox pay-to-post, then submit roles for admin approval',
      'Review applicants and move them through pipeline statuses',
      'See interview-ready applicants in the interviews view',
    ],
    phase2: [
      'Richer interview scheduling (calendar / reschedule)',
      'Real payment provider for paid posting (still sandbox today)',
      'Company-owned branding and multi-seat hiring teams',
    ],
    cta: { href: '/demo-login', label: 'Try company demo' },
  },
  {
    id: 'admin',
    role: 'Admin',
    headline: 'Run catalog, CMS, users, and support.',
    canDo: [
      'Manage users and roles',
      'Publish Education programs and catalog items',
      'Edit CMS pages and blog posts',
      'Approve or reject company internship postings',
      'Use the admin hub for platform oversight',
      'Impersonation support tooling (where enabled)',
    ],
    phase2: [
      'Richer approval queues for counsellor-created courses',
      'Deeper analytics and super-admin controls',
      'Audit-heavy workflows for every sensitive action',
    ],
    cta: { href: '/demo-login', label: 'Try admin demo' },
  },
];

export default function RolesPage() {
  return (
    <>
      <PageBanner
        image={BANNERS.about}
        kicker="Roles"
        title="What you can do on ORI6IN"
        lead="Students and counsellors drive study abroad — parents, companies, and admins support the journey."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="roles-intro">
          Public Education surfaces include programs, free tools, Student Hub, and Get a quote. Portals
          cover student learning, counsellor sessions, parent oversight, company roles, and admin CMS.
        </p>

        <nav className="roles-jump" aria-label="Jump to role">
          {ROLES.map((r) => (
            <a key={r.id} href={`#${r.id}`}>
              {r.role}
            </a>
          ))}
        </nav>

        <div className="roles-stack">
          {ROLES.map((r) => (
            <section key={r.id} id={r.id} className="roles-card">
              <header className="roles-card__head">
                <p className="roles-card__kicker">{r.role}</p>
                <h2>{r.headline}</h2>
              </header>

              <div className="roles-card__cols">
                <div>
                  <h3>You can</h3>
                  <ul>
                    {r.canDo.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Coming next</h3>
                  <ul>
                    {r.phase2.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="cta-row">
                <a className="btn btn-accent" href={r.cta.href}>
                  {r.cta.label}
                </a>
                {r.id === 'student' ? (
                  <>
                    <a className="btn btn-secondary" href="/programs">
                      Browse programs
                    </a>
                    <a className="btn btn-secondary" href="/tools">
                      Free tools
                    </a>
                  </>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <section className="roles-skip" aria-labelledby="roles-skip-title">
          <h2 id="roles-skip-title">What we are skipping for now</h2>
          <ul>
            <li>
              <strong>AI depth</strong> — basic student chat stays; memory/RAG, career coach, resume,
              and roadmap tools are deferred.
            </li>
            <li>
              <strong>Hardening</strong> — live Razorpay/Stripe, production email hardening, and ops
              monitoring continue after Education public launch polish.
            </li>
          </ul>
          <p className="meta">
            Full notes live in the repo docs (<code>docs/roadmap.md</code>).
          </p>
        </section>

        <div className="cta-row" style={{ marginTop: '2rem' }}>
          <a className="btn btn-accent" href="/how-it-works">
            How it works
          </a>
          <a className="btn btn-secondary" href="/pricing">
            Get a quote
          </a>
          <a className="btn btn-secondary" href="/demo-login">
            Demo logins
          </a>
        </div>
      </main>
    </>
  );
}
