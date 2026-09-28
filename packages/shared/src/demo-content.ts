import { DEMO_EMAIL_DOMAIN } from './demo-accounts.js';
import { toSeedPrograms } from './education-catalog.js';

/**
 * Single source of truth for demo catalog content.
 * Seeded into the DB when ENABLE_DEMO_LOGINS=true (see DemoContentService).
 * Public CMS/blog/mentor copy follows the September 2026 brief (ED6E · BRI6GE · 6LOBAL · 6RIP).
 * Internal demo enrolment still uses DEMO_FLAGSHIP_PROGRAM_SLUG.
 */

/** Flagship product used for demo enrollment, mentor assignment, and certificates. */
export const DEMO_FLAGSHIP_PROGRAM_SLUG = 'ori6in-360';

export const DEMO_PROGRAMS = toSeedPrograms();

export const DEMO_PAGES = [
  {
    slug: 'about',
    title: 'About ORI6IN Education',
    body: `ORI6IN Education Private Limited is a profile-building platform for students from Class 8 onwards. Everything starts here.

Four product lines, one counsellor, one plan: ED6E (Class 8–12), BRI6GE (UG Year 1–3), 6LOBAL by Edumillenia for study-abroad counselling, and 6RIP test preparation.

We counsel from Jayanagar, Bengaluru — pan-India and online — for USA, UK, Canada, Germany, Ireland, Netherlands, Singapore, and Australia. Fees are quoted privately. The first Discovery Session is complimentary for student and parents together.`,
    published: true,
  },
  {
    slug: 'pricing',
    title: 'Get a quote',
    body: `We do not publish a rate card. Every family’s plan is quoted after a Discovery Session.

Write via /contact with your current class or UG year, destination interest, and timeline. A counsellor will call from +91 91130 88519 within one working day.`,
    published: true,
  },
] as const;

export const DEMO_POSTS = [
  {
    slug: 'welcome-to-ori6in',
    title: 'Welcome to ORI6IN Education',
    excerpt: 'Profile building from Class 8. Everything starts here.',
    body: `ORI6IN Education is built around one line: Everything starts here.

From Class 8 we build evidence beyond the marksheet. After Class 12 the same counsellor can continue into BRI6GE (the college years) or straight into 6LOBAL study-abroad counselling. Tests sit in 6RIP when the journey needs them.

## The four product lines
- ED6E — Class 8–12 profile building, monthly parent letter
- BRI6GE — UG Year 1–3 runway to a global master’s
- 6LOBAL by Edumillenia — UG, master’s, MBA, and PhD counselling
- 6RIP — IELTS, TOEFL, GRE, GMAT Focus, SAT, German, dMAT

## Destinations
USA · UK · Canada · Germany · Ireland · Netherlands · Singapore · Australia

Fees are never listed on the public site. Start with a complimentary Discovery Session, or read How it works.

This post is seeded for demos and can be edited from Admin → CMS → Blog.`,
    published: true,
  },
  {
    slug: 'choosing-your-first-program',
    title: 'Choosing your first ORI6IN programme',
    excerpt: 'ED6E, BRI6GE, 6LOBAL, or 6RIP — start where you are.',
    body: `Start where you are. The plan is not a template.

## Still in school (Class 8–12)
ED6E is the multi-year profile-building programme. Join at the current class. Parents receive a monthly letter.

## Already in an Indian UG degree
BRI6GE is the college-years runway — Foundation (Year 1), Momentum (Year 2), or Launch (Year 3) — then 6LOBAL for the applications.

## Ready to apply abroad
6LOBAL covers UG, master’s, MBA, and PhD with one counsellor from first call to departure. Country notes live on /destinations. Check /eligibility if you want a first read.

## Tests in the way
6RIP is test preparation (IELTS, TOEFL, GRE, GMAT Focus, SAT, German, dMAT). Bundles with counselling are quoted together — never as a public price list.

## How to decide
1. Book a complimentary Discovery Session (student and parents together).
2. Confirm class or UG year, destination, and timeline.
3. Request a quote from /contact. A counsellor will call within one working day.

All listed products are brands of ORI6IN Education Private Limited.`,
    published: true,
  },
] as const;

export type DemoMentorPersona = {
  /** Deterministic demo email under DEMO_EMAIL_DOMAIN */
  emailLocalPart: string;
  fullName: string;
  /** Shown as directory title / profile headline */
  title: string;
  bio: string;
  skills: string[];
  location: string;
  /** Only the primary mentor gets portal login via DEMO_ACCOUNTS */
  primaryLogin?: boolean;
};

export const DEMO_MENTORS: DemoMentorPersona[] = [
  {
    emailLocalPart: 'mentor',
    fullName: 'Demo Mentor',
    title: 'Lead Counsellor · ED6E & 6LOBAL',
    bio: 'Guides families from Class 8 profile-building through 6LOBAL applications — one counsellor, one plan.\n\nExpect an honest Discovery Session, a written roadmap, and a monthly parent letter on ED6E.',
    skills: ['Study abroad', 'Profile evaluation', 'University shortlisting', 'SOP review'],
    location: 'Bengaluru',
    primaryLogin: true,
  },
  {
    emailLocalPart: 'priya.sharma',
    fullName: 'Priya Sharma',
    title: 'Counsellor · 6LOBAL destinations',
    bio: 'Helps students map USA and Canada bachelor’s and master’s pathways on 6LOBAL — shortlists, essays, and scholarship positioning.\n\nSessions focus on fit, deadlines, and applications that admissions officers can follow.',
    skills: ['USA admissions', 'Canada', 'Scholarships', 'Essays'],
    location: 'Mumbai',
  },
  {
    emailLocalPart: 'arjun.mehta',
    fullName: 'Arjun Mehta',
    title: 'Counsellor · 6LOBAL UK & Europe',
    bio: 'Reviews UK, Ireland, Germany, and Netherlands applications — course fit, credibility prep, and timeline planning.\n\nBring transcripts, target courses, and a draft SOP — leave with a prioritised university list.',
    skills: ['UK admissions', 'Germany', 'CAS prep', 'Course selection'],
    location: 'Remote',
  },
  {
    emailLocalPart: 'nisha.kapoor',
    fullName: 'Nisha Kapoor',
    title: '6RIP Coach · IELTS & TOEFL',
    bio: 'Coaches band and score targets for IELTS and TOEFL on 6RIP — mock analysis and weekly drills.\n\nYou will practise speaking, writing structure, and timing under exam conditions.',
    skills: ['IELTS', 'TOEFL', 'Mock tests', 'Band strategy'],
    location: 'Hyderabad',
  },
  {
    emailLocalPart: 'rahul.desai',
    fullName: 'Rahul Desai',
    title: 'Visa & Interview Coach',
    bio: 'Preps students for university, credibility, and visa interviews — mocks, documentation checklists, and confidence drills.\n\nBest fit when offers are in and the visa file needs polish.',
    skills: ['Visa interviews', 'F-1 prep', 'Documentation', 'Mock interviews'],
    location: 'Pune',
  },
  {
    emailLocalPart: 'meera.iyer',
    fullName: 'Meera Iyer',
    title: 'Pre-departure · 6LOBAL',
    bio: 'Runs pre-departure orientation for 6LOBAL families — housing, forex, packing, and arrival — plus Student Hub webinars.\n\nBring your offer letter and travel window; leave with a clear departure checklist.',
    skills: ['Pre-departure', 'Accommodation', 'Forex', 'Student community'],
    location: 'Chennai',
  },
];

export function demoMentorEmail(localPart: string) {
  return `${localPart}@${DEMO_EMAIL_DOMAIN}`;
}

export const DEMO_INTERNSHIPS = [
  {
    slug: 'frontend-intern',
    title: 'Frontend Intern',
    company: 'ORI6IN Labs',
    location: 'Remote',
    description:
      'Help build the student portal (courses, checkout, progress). React/Next.js experience preferred.',
    published: true,
    approvalStatus: 'approved' as const,
    paymentStatus: 'waived' as const,
  },
  {
    slug: 'data-intern',
    title: 'Data Intern',
    company: 'ORI6IN Labs',
    location: 'Hybrid · Bengaluru',
    description:
      'Support counselling analytics and admissions funnel reporting. SQL + Python helpful.',
    published: true,
    approvalStatus: 'approved' as const,
    paymentStatus: 'waived' as const,
  },
  {
    slug: 'mentor-ops-intern',
    title: 'Counsellor Ops Intern',
    company: 'ORI6IN',
    location: 'Remote',
    description:
      'Coordinate counsellor sessions, document checklists, and student check-ins for ED6E and 6LOBAL families.',
    published: true,
    approvalStatus: 'approved' as const,
    paymentStatus: 'waived' as const,
  },
] as const;

export const DEMO_STUDENT_PROFILE = {
  email: `student@${DEMO_EMAIL_DOMAIN}`,
  headline: 'Aspiring master’s applicant · ORI6IN 360°',
  bio: 'Demo student exploring ORI6IN study-abroad packages, test prep, and counsellor guidance.',
  phone: '',
  location: 'Bengaluru',
  skills: ['IELTS prep', 'SOP drafting', 'Research'],
  education: [{ school: 'Demo University', degree: 'B.Tech', year: '2026' }],
  experience: [] as Array<{ company: string; title: string; years?: string }>,
  projects: [
    {
      name: 'Study-abroad roadmap',
      summary: 'Personal plan covering shortlist, tests, and scholarship targets.',
    },
  ],
} as const;

export const DEMO_CURRICULUM: Record<
  string,
  Array<{
    slug: string;
    title: string;
    summary: string;
    sortOrder: number;
    lessons: Array<{ slug: string; title: string; content: string; sortOrder: number }>;
  }>
> = {
  [DEMO_FLAGSHIP_PROGRAM_SLUG]: [
    {
      slug: 'discover-decide',
      title: 'Discover & Decide',
      summary: 'Profile clarity, career direction, and country/course fit.',
      sortOrder: 1,
      lessons: [
        {
          slug: 'welcome-360',
          title: 'Welcome to ORI6IN 360°',
          content:
            'You are enrolled in ORI6IN 360° — Dream. Apply. Fly.\n\nThis journey covers discover → decide → shortlist → prepare → apply → fund → visa → fly. Complete each lesson to track progress with your counsellor.',
          sortOrder: 1,
        },
        {
          slug: 'profile-evaluation',
          title: 'Profile evaluation',
          content:
            'Gather academics, activities, work, and budget constraints.\n\nMark complete when you have uploaded or listed your key documents for review.',
          sortOrder: 2,
        },
        {
          slug: 'career-course-fit',
          title: 'Career & course fit',
          content:
            'Map interests to degree types and outcomes. Discuss ROI and industry prospects with your counsellor.\n\nWrite one preferred pathway and one backup.',
          sortOrder: 3,
        },
        {
          slug: 'country-selection',
          title: 'Country selection',
          content:
            'Compare USA, UK, Canada, Australia, Germany, and other destinations on cost, visas, and post-study options.\n\nShortlist 1–2 primary countries.',
          sortOrder: 4,
        },
      ],
    },
    {
      slug: 'shortlist-prepare',
      title: 'Shortlist & Prepare',
      summary: 'Universities, tests, and a personalised admissions roadmap.',
      sortOrder: 2,
      lessons: [
        {
          slug: 'university-shortlist',
          title: 'University shortlisting',
          content:
            'Build Safe / Target / Ambitious lists with tuition, deadlines, and entry requirements.\n\nAim for 6–10 programs across tiers.',
          sortOrder: 1,
        },
        {
          slug: 'test-plan',
          title: 'Test preparation plan',
          content:
            'Confirm IELTS/TOEFL/GRE/GMAT/SAT/German needs and target scores.\n\nBook a demo or enroll in the matching ORI6IN test-prep product if scores are pending.',
          sortOrder: 2,
        },
        {
          slug: 'documents-checklist',
          title: 'Documents checklist',
          content:
            'Transcripts, recommendations, passport, and financial proofs.\n\nCreate a shared checklist with due dates for each item.',
          sortOrder: 3,
        },
      ],
    },
    {
      slug: 'apply-fund',
      title: 'Apply & Fund',
      summary: 'Applications, essays, scholarships, and offer evaluation.',
      sortOrder: 3,
      lessons: [
        {
          slug: 'sop-lor-resume',
          title: 'SOP, LOR & resume',
          content:
            'Draft Statement of Purpose, request LORs, and polish your CV for academics.\n\nSubmit drafts for counsellor review before finalising.',
          sortOrder: 1,
        },
        {
          slug: 'applications',
          title: 'Application submission',
          content:
            'Complete forms, upload documents, and track each portal.\n\nLog application IDs and fee receipts in one place.',
          sortOrder: 2,
        },
        {
          slug: 'scholarships-finance',
          title: 'Scholarships & finance',
          content:
            'Shortlist university and external scholarships; sketch loan/forex needs.\n\nApply to at least two funding options aligned to your offers.',
          sortOrder: 3,
        },
        {
          slug: 'offer-evaluation',
          title: 'Offer evaluation',
          content:
            'Compare admits on cost, ranking fit, funding, and career outcomes.\n\nDecide with your counsellor before paying deposits.',
          sortOrder: 4,
        },
      ],
    },
    {
      slug: 'visa-fly',
      title: 'Visa & Fly',
      summary: 'Visa file, mocks, pre-departure, and community connect.',
      sortOrder: 4,
      lessons: [
        {
          slug: 'visa-file',
          title: 'Visa documentation',
          content:
            'Assemble financials, CAS/I-20 equivalents, and forms for your destination.\n\nRun a file review with your counsellor before booking the appointment.',
          sortOrder: 1,
        },
        {
          slug: 'mock-interview',
          title: 'Mock visa / credibility interview',
          content:
            'Practice answers on funding, course choice, and return intent.\n\nRecord one mock and note improvements.',
          sortOrder: 2,
        },
        {
          slug: 'pre-departure',
          title: 'Pre-departure orientation',
          content:
            'Housing, flights, forex, insurance, SIM, banking, and packing.\n\nComplete the ORI6IN Fly checklist before travel week.',
          sortOrder: 3,
        },
      ],
    },
  ],
  'ori6in-ielts': [
    {
      slug: 'ielts-foundations',
      title: 'IELTS Foundations',
      summary: 'Format, scoring, and a personalised band target plan.',
      sortOrder: 1,
      lessons: [
        {
          slug: 'ielts-overview',
          title: 'IELTS overview & band goals',
          content:
            'Understand Listening, Reading, Writing, and Speaking criteria.\n\nSet a target band with your coach and a weekly practice cadence.',
          sortOrder: 1,
        },
        {
          slug: 'listening-reading',
          title: 'Listening & Reading drills',
          content:
            'Timed section practice with error logs.\n\nComplete one full Listening and one Reading set this week.',
          sortOrder: 2,
        },
        {
          slug: 'writing-speaking',
          title: 'Writing & Speaking drills',
          content:
            'Task 1/2 structures and speaking part frameworks.\n\nSubmit one Writing Task 2 and one Speaking recording for feedback.',
          sortOrder: 3,
        },
      ],
    },
    {
      slug: 'ielts-mocks',
      title: 'Mocks & Performance',
      summary: 'Full mocks, analysis, and exam-week readiness.',
      sortOrder: 2,
      lessons: [
        {
          slug: 'full-mock-1',
          title: 'Full mock test #1',
          content:
            'Sit a complete mock under exam conditions.\n\nShare scores and weak sections with your coach.',
          sortOrder: 1,
        },
        {
          slug: 'score-analysis',
          title: 'Score analysis & fix list',
          content:
            'Turn mock results into a short fix list — top three improvements only.\n\nRevisit those drills before mock #2.',
          sortOrder: 2,
        },
        {
          slug: 'exam-week',
          title: 'Exam-week checklist',
          content:
            'ID, timing, rest, and last light practice.\n\nConfirm test centre logistics and target band one final time.',
          sortOrder: 3,
        },
      ],
    },
  ],
};
