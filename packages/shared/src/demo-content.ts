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
      'Career Launchpad is ORI6IN’s flagship mentored track. You ship weekly milestones, get written mentor reviews, and leave with a portfolio you can defend in interviews.\n\nExpect live checkpoints, a structured project brief, and a final showcase. Internships stay behind login once your work is ready to show.',
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
      'AI Foundations teaches practical literacy — not hype. You learn prompting patterns, responsible use, and how to fold AI into real student workflows with mentor feedback.\n\nModules mix short lessons with project briefs so you finish with demos you can explain, not just chat logs.',
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

Students buy ORI6IN programs, ship weekly work, and get mentor reviews. Parents can follow progress and approve internship steps. Companies post roles and review applicants. Admins run catalog, CMS, and approvals.

Certificates are issued when a program is completed. Community extras and live payment providers continue to deepen after this core path.

This page is managed through the Admin CMS.`,
    published: true,
  },
  {
    slug: 'pricing',
    title: 'Pricing',
    body: `ORI6IN programs are sold directly online.

Browse published programs for current prices. Sandbox checkout is available for demos; live Razorpay/Stripe wiring comes with production hardening.

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

Students enroll in ORI6IN programs, ship weekly work, and get mentor reviews that are specific enough to act on. Parents can follow progress. Companies post internship roles once learners are ready to apply.

## What Phase 1 includes
- Own programs you can buy online (Career Launchpad, AI Foundations)
- Student portal for lessons, assignments, and progress
- Mentor directory, sessions, and written reviews
- Internship applications behind student login

## What comes next
Deeper AI tools, live payments, and richer company workflows land after the core path feels solid.

This post is seeded for demos and can be edited from Admin → CMS → Blog.`,
    published: true,
  },
  {
    slug: 'choosing-your-first-program',
    title: 'Choosing your first program',
    excerpt: 'A short guide for students starting on ORI6IN.',
    body: `Start with Career Launchpad if you want mentorship and a portfolio. Pick AI Foundations if you want practical AI skills first.

## Career Launchpad
Best if you want an 8-week path with project briefs, mentor checkpoints, and a showcase you can bring to interviews.

## AI Foundations
Best if you need prompting, workflows, and responsible AI habits before (or alongside) a bigger build track.

## How to decide
1. Look at the curriculum outline on each program page.
2. Skim mentor profiles that match the skills you want reviewed.
3. Enroll, complete the first module, and book a mentor session early.

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
    bio: 'Guides learners through weekly reviews, session notes, and portfolio checkpoints on Career Launchpad. Former product engineer turned coach.\n\nExpect crisp written feedback, honest critique on demos, and help turning milestones into interview stories.',
    skills: ['Mentorship', 'Portfolio reviews', 'Career growth', 'Product thinking'],
    location: 'Bengaluru',
    primaryLogin: true,
  },
  {
    emailLocalPart: 'priya.sharma',
    fullName: 'Priya Sharma',
    title: 'Design Mentor · Product & UX',
    bio: 'Helps students turn fuzzy ideas into clear briefs, wireflows, and critique-ready case studies. 8 years in product design.\n\nSessions focus on structure, visual clarity, and storytelling that hiring managers can follow.',
    skills: ['UX design', 'Critique', 'Figma', 'Case studies'],
    location: 'Mumbai',
  },
  {
    emailLocalPart: 'arjun.mehta',
    fullName: 'Arjun Mehta',
    title: 'Engineering Mentor · Full-stack',
    bio: 'Reviews code, architecture choices, and demo readiness. Focuses on shipping small, solid milestones every week.\n\nBring PRs, diagrams, and a short walkthrough — leave with a fix list ordered by impact.',
    skills: ['JavaScript', 'React', 'Node.js', 'System design'],
    location: 'Remote',
  },
  {
    emailLocalPart: 'nisha.kapoor',
    fullName: 'Nisha Kapoor',
    title: 'AI Mentor · Practical literacy',
    bio: 'Coaches responsible prompting, workflow design, and AI-assisted project work for AI Foundations students.\n\nYou will practice disclosure, verification, and building workflows you can defend in a critique.',
    skills: ['AI tools', 'Prompting', 'Ethics', 'Automation'],
    location: 'Hyderabad',
  },
  {
    emailLocalPart: 'rahul.desai',
    fullName: 'Rahul Desai',
    title: 'Career Mentor · Internships',
    bio: 'Preps students for internship applications — resumes, mock interviews, and storytelling for hiring managers.\n\nBest fit when your portfolio is nearly ready and you need a sharper pitch.',
    skills: ['Interview prep', 'Resume', 'Storytelling', 'Internships'],
    location: 'Pune',
  },
  {
    emailLocalPart: 'meera.iyer',
    fullName: 'Meera Iyer',
    title: 'Communication Mentor',
    bio: 'Works on written and spoken clarity for demos, mentor sessions, and stakeholder updates.\n\nBring a draft talk track or write-up and leave with a tighter narrative.',
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
      summary: 'Orient yourself to the Career Launchpad path and set weekly goals.',
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
        {
          slug: 'workspace-setup',
          title: 'Workspace and portfolio setup',
          content:
            'Create a simple portfolio home: about, projects, and contact.\n\nLink your first brief so mentors can review from one place.',
          sortOrder: 4,
        },
      ],
    },
    {
      slug: 'build-and-ship',
      title: 'Build & Ship',
      summary: 'Turn your brief into milestones with weekly demos mentors can review.',
      sortOrder: 2,
      lessons: [
        {
          slug: 'milestone-planning',
          title: 'Milestone planning',
          content:
            'Break the brief into three milestones. Each should produce something a mentor can click or critique.',
          sortOrder: 1,
        },
        {
          slug: 'weekly-demo',
          title: 'Running a weekly demo',
          content:
            'Record a 3-minute walkthrough: what changed, what is blocked, what you need feedback on.',
          sortOrder: 2,
        },
        {
          slug: 'feedback-loops',
          title: 'Closing the feedback loop',
          content:
            'Translate mentor notes into a short fix list. Ship the top two items before the next session.',
          sortOrder: 3,
        },
      ],
    },
    {
      slug: 'showcase-and-apply',
      title: 'Showcase & Apply',
      summary: 'Package your work for interviews and internship applications.',
      sortOrder: 3,
      lessons: [
        {
          slug: 'case-study-writeup',
          title: 'Case study write-up',
          content:
            'Write problem → approach → outcome for your main project. Keep it under one page.',
          sortOrder: 1,
        },
        {
          slug: 'portfolio-polish',
          title: 'Portfolio polish',
          content:
            'Tighten visuals, add captions, and remove unfinished experiments from the public page.',
          sortOrder: 2,
        },
        {
          slug: 'internship-readiness',
          title: 'Internship readiness checklist',
          content:
            'Resume bullet, live link, and a 60-second pitch. Then apply from the student internships board.',
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
    {
      slug: 'ai-workflows',
      title: 'AI Workflows',
      summary: 'Build repeatable workflows for study, writing, and project research.',
      sortOrder: 2,
      lessons: [
        {
          slug: 'study-copilot',
          title: 'Study copilot patterns',
          content:
            'Use AI to outline readings, quiz yourself, and explain tough concepts — then rewrite answers in your own words.',
          sortOrder: 1,
        },
        {
          slug: 'research-assist',
          title: 'Research assist without plagiarism',
          content:
            'Collect sources, summarize claims, and keep a citation list. AI drafts are drafts — you own the final text.',
          sortOrder: 2,
        },
        {
          slug: 'automation-lite',
          title: 'Light automation',
          content:
            'Chain prompts for brief → outline → checklist. Save your best prompts as reusable templates.',
          sortOrder: 3,
        },
        {
          slug: 'workflow-project',
          title: 'Workflow project brief',
          content:
            'Ship a short demo of one AI-assisted workflow you use weekly. Include before/after and risks you mitigated.',
          sortOrder: 4,
        },
      ],
    },
    {
      slug: 'ai-in-projects',
      title: 'AI in Projects',
      summary: 'Apply AI inside a real student project with mentor critique.',
      sortOrder: 3,
      lessons: [
        {
          slug: 'project-scoping',
          title: 'Scoping an AI-assisted project',
          content:
            'Define the human tasks vs AI tasks. Mentors will challenge fuzzy scopes.',
          sortOrder: 1,
        },
        {
          slug: 'critique-ready-demo',
          title: 'Critique-ready demo',
          content:
            'Prepare a walkthrough that shows prompts, outputs, edits you made, and what you rejected.',
          sortOrder: 2,
        },
        {
          slug: 'ethics-checkpoint',
          title: 'Ethics checkpoint',
          content:
            'Document disclosure, data you avoided, and how a reviewer can reproduce your result.',
          sortOrder: 3,
        },
      ],
    },
  ],
};
