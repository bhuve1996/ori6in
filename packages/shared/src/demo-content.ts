import { DEMO_EMAIL_DOMAIN } from './demo-accounts.js';
import { toSeedPrograms } from './education-catalog.js';

/**
 * Single source of truth for demo catalog content.
 * Seeded into the DB when ENABLE_DEMO_LOGINS=true (see DemoContentService).
 * Full Education product list lives in education-catalog.ts.
 */

/** Flagship product used for demo enrollment, mentor assignment, and certificates. */
export const DEMO_FLAGSHIP_PROGRAM_SLUG = 'ori6in-360';

export const DEMO_PROGRAMS = toSeedPrograms();

export const DEMO_PAGES = [
  {
    slug: 'about',
    title: 'About ORI6IN Education',
    body: `ORI6IN Education helps students Dream. Apply. Fly. — from career clarity and test prep to university admits, scholarships, visas, and pre-departure.

We counsel for USA, UK, Canada, Australia, Germany, Ireland, New Zealand, Japan, France, Netherlands, and Europe across bachelor’s, master’s, MBA, and PhD pathways.

Students pick packages (Essential, Advantage, Premier) or the flagship ORI6IN 360° journey. Test prep (IELTS, TOEFL, PTE, DET, GRE, GMAT, SAT, German), Profile Builder, Scholarship Assist, Visa Assist, Finance, Apply, and Fly plug in as needed. Free tools include University Finder, Course Finder, Scholarship Finder, Cost Calculator, Eligibility Checker, and Country Comparison — plus the ORI6IN Student Hub.`,
    published: true,
  },
  {
    slug: 'pricing',
    title: 'Get a quote',
    body: `We don't publish a fixed price list — every student's path is different.

Share your destination, degree level, and timeline. An ORI6IN counsellor will reply with a personalised quote for Essential, Advantage, Premier, ORI6IN 360°, country admissions, combos, test prep, or add-ons like Visa Assist, Finance, and Fly.`,
    published: true,
  },
] as const;

export const DEMO_POSTS = [
  {
    slug: 'welcome-to-ori6in',
    title: 'Welcome to ORI6IN Education',
    excerpt: 'How we take students from dream destination to boarding pass.',
    body: `ORI6IN Education is built around one promise: Dream. Apply. Fly.

Students explore destinations, prepare for tests, shortlist universities, submit strong applications, unlock funding, clear visas, and leave India ready — with counsellors beside them.

## What you can buy today
- Flagship ORI6IN 360° end-to-end journey
- Essential / Advantage / Premier admission packages
- Country admissions: USA, UK, Canada, Australia, Germany, Ireland, NZ, Japan, Europe
- Combos: GRE+USA, GMAT+USA, IELTS+Abroad, TOEFL+USA, SAT+USA UG, German+Germany
- Test prep: IELTS, TOEFL, PTE, DET, GRE, GMAT, SAT, German
- Profile Builder, Apply, Scholarship Assist, Finance, Visa Assist, Fly, Career Compass

## Free tools
University Finder · Course Finder · Scholarship Finder · Cost Calculator · Eligibility · Country Compare · Student Hub

## Destinations
USA · UK · Canada · Australia · Germany · Ireland · New Zealand · Japan · France · Netherlands · Europe

This post is seeded for demos and can be edited from Admin → CMS → Blog.`,
    published: true,
  },
  {
    slug: 'choosing-your-first-program',
    title: 'Choosing your first ORI6IN program',
    excerpt: 'A short guide for students starting their study-abroad journey.',
    body: `Start with ORI6IN 360° if you want one end-to-end path. Pick Advantage or Premier if you already know your country. Add IELTS/GRE/PTE/DET (or other tests) when scores are still pending. Use free tools on /tools to shortlist before you request a quote.

## ORI6IN 360°
Best if you want Discover → Decide → Shortlist → Prepare → Apply → Fund → Visa → Fly in one package.

## Advantage / Premier / Combos
Best if you need application depth (Advantage), a dedicated counsellor plus visa & pre-departure (Premier), or a test+admissions combo.

## Test prep first
Choose IELTS, TOEFL, PTE, DET, GRE, GMAT, SAT, or German when your score is the blocker — then layer an admissions package.

## How to decide
1. Confirm country and degree level (try Country Compare).
2. Check whether you need test prep or profile building first.
3. Request a quote or enroll, then book a counsellor session early.

All listed products are ORI6IN own products — pricing via personalised quote.`,
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
    title: 'Lead Counsellor · ORI6IN 360°',
    bio: 'Guides students through the full Dream → Apply → Fly journey on ORI6IN 360°. Former admissions counsellor turned lead coach.\n\nExpect crisp profile feedback, honest university shortlists, and clear next steps each week.',
    skills: ['Study abroad', 'Profile evaluation', 'University shortlisting', 'SOP review'],
    location: 'Bengaluru',
    primaryLogin: true,
  },
  {
    emailLocalPart: 'priya.sharma',
    fullName: 'Priya Sharma',
    title: 'Counsellor · USA & Canada Admissions',
    bio: 'Helps students map USA/Canada bachelor’s and master’s pathways — shortlists, essays, and scholarship positioning.\n\nSessions focus on fit, deadlines, and applications that admissions officers can follow.',
    skills: ['USA admissions', 'Canada', 'Scholarships', 'Essays'],
    location: 'Mumbai',
  },
  {
    emailLocalPart: 'arjun.mehta',
    fullName: 'Arjun Mehta',
    title: 'Counsellor · UK & Europe',
    bio: 'Reviews UK, Ireland, Germany, and wider Europe applications — course fit, CAS/credibility prep, and timeline planning.\n\nBring transcripts, target courses, and a draft SOP — leave with a prioritised university list.',
    skills: ['UK admissions', 'Germany', 'CAS prep', 'Course selection'],
    location: 'Remote',
  },
  {
    emailLocalPart: 'nisha.kapoor',
    fullName: 'Nisha Kapoor',
    title: 'Test Prep Coach · IELTS & TOEFL',
    bio: 'Coaches band and score targets for IELTS and TOEFL with mock analysis and weekly drills.\n\nYou will practice speaking, writing structure, and timing under exam conditions.',
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
    title: 'Pre-Departure & Student Hub',
    bio: 'Runs ORI6IN Fly orientation — housing, forex, SIM, packing, and arrival support — plus community webinars.\n\nBring your offer letter and travel window; leave with a clear departure checklist.',
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
      'Coordinate counsellor sessions, document checklists, and student check-ins for ORI6IN 360°.',
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
