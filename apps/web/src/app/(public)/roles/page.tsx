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
    headline: 'Learn, ship work, and step into opportunities.',
    canDo: [
      'Browse and purchase ORI6IN programs',
      'Take courses, lessons, assignments, and quizzes',
      'Build a career profile and portfolio-style projects',
      'Get mentor reviews and feedback on your work',
      'Browse internships after login and apply',
      'Track application status with company, parent, and mentor decisions',
      'Earn a completion certificate when all program lessons are done',
      'Track orders, notifications, and progress in your hub',
    ],
    phase2: [
      'Community / referrals (later platform work)',
      'Richer document uploads on applications',
      'Stronger progress storytelling beyond certificates',
    ],
    cta: { href: '/register', label: 'Start as a student' },
  },
  {
    id: 'mentor',
    role: 'Mentor',
    headline: 'Guide learners with reviews that keep them shipping.',
    canDo: [
      'Open a mentor hub with assigned students',
      'Book and manage mentoring sessions',
      'Write reviews with templates, drafts, and publish',
      'Approve internship completion for offered roles',
      'Appear in the public mentors directory',
    ],
    phase2: [
      'Student-side session request / reschedule calendar',
      'Richer rubrics and file attachments on reviews',
      'Video meeting links integrated with live providers',
    ],
    cta: { href: '/mentors', label: 'Meet mentors' },
  },
  {
    id: 'parent',
    role: 'Parent',
    headline: 'Stay close to progress, payments, and approvals.',
    canDo: [
      'Invite and link a real student account (student must accept)',
      'Follow learning progress for the linked student',
      'Sandbox-pay for programs on their behalf',
      'Two-way messaging with student, mentor, or support',
      'Approve or reject internship applications',
    ],
    phase2: [
      'Multi-child dashboards and finer consent controls',
      'Calendar sync for mentor sessions',
      'Live payment provider (still sandbox today)',
    ],
    cta: { href: '/demo-login', label: 'Try parent demo' },
  },
  {
    id: 'company',
    role: 'Company',
    headline: 'Post roles and find internship-ready talent.',
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
      'Publish programs and catalog items',
      'Edit CMS pages and blog posts',
      'Approve or reject company internship postings',
      'Use the admin hub for platform oversight',
      'Impersonation support tooling (where enabled)',
    ],
    phase2: [
      'Richer approval queues for mentor-created courses',
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
        lead="Pick a seat — student, mentor, parent, company, or admin — and see what the platform unlocks."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="roles-intro">
          Phase 1 shipped the public site plus core student, mentor, and admin portals. Phase 2 company,
          parent, mentor, internship status, and certificates are in place. Community extras and production
          hardening (live payments, email, storage) come next.
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
                  <h3>Phase 2 focus</h3>
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
                  <a className="btn btn-secondary" href="/programs">
                    Browse programs
                  </a>
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
              <strong>Hardening</strong> — live Razorpay/Stripe, production email, S3 hardening,
              custom domains polish, and ops monitoring come after Phase 2 product depth.
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
          <a className="btn btn-secondary" href="/register">
            Get started
          </a>
          <a className="btn btn-secondary" href="/demo-login">
            Demo logins
          </a>
        </div>
      </main>
    </>
  );
}
