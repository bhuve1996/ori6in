import { DEMO_EMAIL_DOMAIN, DEMO_PASSWORD } from './demo-accounts.js';

/**
 * Single source of truth for demo catalog content.
 * Seeded into the DB when ENABLE_DEMO_LOGINS=true (see DemoContentService).
 * Edit here — programs, CMS, blog, mentors, internships, curriculum stay in sync.
 */

export const DEMO_PROGRAMS = [
  {
    title: 'ORI6IN Career Launchpad',
    slug: 'career-launchpad',
    summary: '8-week mentored path from fundamentals to internship-ready projects.',
    description:
      'Build a portfolio with weekly mentor reviews, live sessions, and a final project showcase. Phase 1 ORI6IN own program.',
    priceCents: 2499900,
    currency: 'INR',
    isOwnProduct: true,
    published: true,
  },
  {
    title: 'ORI6IN AI Foundations',
    slug: 'ai-foundations',
    summary: 'Practical AI literacy for students — prompts, workflows, and ethics.',
    description:
      'Hands-on modules covering modern AI tools, responsible use, and project-based assignments with mentor feedback.',
    priceCents: 1499900,
    currency: 'INR',
    isOwnProduct: true,
    published: true,
  },
  {
    title: 'ORI6IN Mentor Intensive (draft)',
    slug: 'mentor-intensive-draft',
    summary: 'Draft program for admin catalog testing — not public.',
    description: 'This draft stays unpublished so admin can verify draft visibility.',
    priceCents: 999900,
    currency: 'INR',
    isOwnProduct: true,
    published: false,
  },
] as const;

export const DEMO_PAGES = [
  {
    slug: 'about',
    title: 'About ORI6IN',
    body: `ORI6IN is an education and career platform that connects learners with programs, mentors, and internships.

Phase 1 focuses on ORI6IN’s own programs with direct purchase, a student portal for learning, and mentor booking. Internships stay behind login. Company and advanced parent workflows arrive in later phases.

This page is managed through the Admin CMS.`,
    published: true,
  },
  {
    slug: 'pricing',
    title: 'Pricing',
    body: `ORI6IN programs are sold directly online.

Browse published programs for current prices. Scholarships and partner offerings are out of Phase 1 scope.

Edit this copy anytime from Admin → CMS.`,
    published: true,
  },
] as const;

export const DEMO_POSTS = [
  {
    slug: 'welcome-to-ori6in',
    title: 'Welcome to ORI6IN',
    excerpt: 'How we help learners grow through programs, mentorship, and real opportunities.',
    body: `ORI6IN brings learning, mentorship, and career exposure into one platform.

This post was seeded for demo walkthroughs and can be edited from Admin → CMS → Blog.`,
    published: true,
  },
  {
    slug: 'choosing-your-first-program',
    title: 'Choosing your first program',
    excerpt: 'A short guide for students starting on ORI6IN.',
    body: `Start with Career Launchpad if you want mentorship and a portfolio. Pick AI Foundations if you want practical AI skills first.

Both are ORI6IN own products available for direct purchase in Phase 1.`,
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
    title: 'Lead Mentor · Career Launchpad',
    bio: 'Guides learners through weekly reviews, session notes, and portfolio checkpoints on Career Launchpad. Former product engineer turned coach.',
    skills: ['Mentorship', 'Portfolio reviews', 'Career growth', 'Product thinking'],
    location: 'Bengaluru',
    primaryLogin: true,
  },
  {
    emailLocalPart: 'priya.sharma',
    fullName: 'Priya Sharma',
    title: 'Design Mentor · Product & UX',
    bio: 'Helps students turn fuzzy ideas into clear briefs, wireflows, and critique-ready case studies. 8 years in product design.',
    skills: ['UX design', 'Critique', 'Figma', 'Case studies'],
    location: 'Mumbai',
  },
  {
    emailLocalPart: 'arjun.mehta',
    fullName: 'Arjun Mehta',
    title: 'Engineering Mentor · Full-stack',
    bio: 'Reviews code, architecture choices, and demo readiness. Focuses on shipping small, solid milestones every week.',
    skills: ['JavaScript', 'React', 'Node.js', 'System design'],
    location: 'Remote',
  },
  {
    emailLocalPart: 'nisha.kapoor',
    fullName: 'Nisha Kapoor',
    title: 'AI Mentor · Practical literacy',
    bio: 'Coaches responsible prompting, workflow design, and AI-assisted project work for AI Foundations students.',
    skills: ['AI tools', 'Prompting', 'Ethics', 'Automation'],
    location: 'Hyderabad',
  },
  {
    emailLocalPart: 'rahul.desai',
    fullName: 'Rahul Desai',
    title: 'Career Mentor · Internships',
    bio: 'Preps students for internship applications — resumes, mock interviews, and storytelling for hiring managers.',
    skills: ['Interview prep', 'Resume', 'Storytelling', 'Internships'],
    location: 'Pune',
  },
  {
    emailLocalPart: 'meera.iyer',
    fullName: 'Meera Iyer',
    title: 'Communication Mentor',
    bio: 'Works on written and spoken clarity for demos, mentor sessions, and stakeholder updates.',
    skills: ['Communication', 'Presentation', 'Writing', 'Feedback'],
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
      'Support learning analytics pipelines and internship funnel reporting. SQL + Python helpful.',
    published: true,
    approvalStatus: 'approved' as const,
    paymentStatus: 'waived' as const,
  },
  {
    slug: 'mentor-ops-intern',
    title: 'Mentor Ops Intern',
    company: 'ORI6IN',
    location: 'Remote',
    description:
      'Coordinate mentor sessions, notes templates, and student check-ins for Career Launchpad.',
    published: true,
    approvalStatus: 'approved' as const,
    paymentStatus: 'waived' as const,
  },
] as const;

export const DEMO_STUDENT_PROFILE = {
  email: `student@${DEMO_EMAIL_DOMAIN}`,
  headline: 'Aspiring product builder · Career Launchpad',
  bio: 'Demo student exploring ORI6IN programs, mentorship, and internships.',
  phone: '',
  location: 'Bengaluru',
  skills: ['JavaScript', 'React', 'Communication'],
  education: [{ school: 'Demo University', degree: 'B.Tech', year: '2026' }],
  experience: [] as Array<{ company: string; title: string; years?: string }>,
  projects: [
    {
      name: 'Portfolio starter',
      summary: 'Personal site showcasing Career Launchpad milestones.',
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
  'career-launchpad': [
    {
      slug: 'getting-started',
      title: 'Getting Started',
      summary: 'Orient yourself to the Career Launchpad path.',
      sortOrder: 1,
      lessons: [
        {
          slug: 'welcome',
          title: 'Welcome to Career Launchpad',
          content:
            'You are enrolled in ORI6IN Career Launchpad.\n\nThis track blends self-paced lessons with mentor-led checkpoints. Complete each lesson to track progress.',
          sortOrder: 1,
        },
        {
          slug: 'growth-mindset',
          title: 'Growth mindset for builders',
          content:
            'Treat every project as an experiment. Ship small, get feedback, iterate.\n\nMark this lesson complete when you have written one learning goal for this week.',
          sortOrder: 2,
        },
        {
          slug: 'first-project-brief',
          title: 'Your first project brief',
          content:
            'Pick a small problem you can demo in under two weeks.\n\nDocument: problem, users, success metric, and a 3-milestone plan.',
          sortOrder: 3,
        },
      ],
    },
  ],
  'ai-foundations': [
    {
      slug: 'ai-basics',
      title: 'AI Basics',
      summary: 'Practical AI literacy for everyday student workflows.',
      sortOrder: 1,
      lessons: [
        {
          slug: 'what-is-ai',
          title: 'What is AI (in practice)?',
          content:
            'Modern AI tools help with drafting, summarizing, and ideation. They are copilots — you stay accountable for the final output.',
          sortOrder: 1,
        },
        {
          slug: 'prompting-101',
          title: 'Prompting 101',
          content:
            'Good prompts include role, goal, constraints, and examples.\n\nTry rewriting a vague ask into a structured prompt before continuing.',
          sortOrder: 2,
        },
        {
          slug: 'responsible-ai',
          title: 'Responsible AI use',
          content:
            'Never paste secrets. Disclose AI assistance when required. Verify facts before sharing.',
          sortOrder: 3,
        },
      ],
    },
  ],
};
