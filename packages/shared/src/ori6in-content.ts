/**
 * Public-site content from the September 2026 Word brief.
 * Section 7 catalogue names are CRM picklist values — keep verbatim.
 */

export const COMPANY = {
  legalName: 'ORI6IN Education Private Limited',
  formerName: 'Haridhi Education Consultancy Pvt. Ltd.',
  cin: 'U85500KA2025PTC201843',
  founder: 'Rishi Parashar',
  founderTitle: 'Founder & Director',
  address:
    '1315, 2nd Floor, 25th Main Road, Kottapalya, Puttaiahna Palya 9th Block, Jayanagar, Bengaluru 560041',
  cityShort: 'Jayanagar, Bengaluru',
  phoneDisplay: '+91 91130 88519',
  phoneTel: '+919113088519',
  whatsappUrl: 'https://wa.me/919113088519',
  email: 'info@ori6ineducation.com',
  tagline: 'Everything starts here.',
  coverage: 'Bengaluru (Jayanagar centre) · pan-India · online',
  governingLaw: 'India — courts at Bengaluru have exclusive jurisdiction',
  houseBrandLine: '6LOBAL by Edumillenia',
  brandsLegal:
    'Edumillenia · ED6E · BRI6GE · 6LOBAL · 6RIP · 6RAND · 6RANT are brands of ORI6IN Education Private Limited',
  copyrightYear: 2026,
} as const;

export const SITE_PUBLIC_NAME = 'ORI6IN';
export const SITE_PUBLIC_DESCRIPTION =
  'ORI6IN Education is a profile-building platform for students from Class 8 onwards — ED6E, BRI6GE, 6LOBAL study-abroad counselling, and 6RIP test preparation. Everything starts here.';

export const ED6E_PILLARS = ['Excellence', 'Direction', 'Growth', 'Exposure'] as const;
export const ED6E_EXPANSION = 'ED6E = Excellence · Direction · Growth · Exposure';

export const TICKER_ITEMS = [
  'Complimentary Profile Discovery Session — for students and parents',
  'ED6E admissions open for Class 8–12',
  'BRI6GE — for UG students planning a master’s abroad',
  'Study-abroad counselling for 2027 intakes',
  `Call ${COMPANY.phoneDisplay}`,
] as const;

export const HEADER_NAV = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/ed6e', label: 'ED6E' },
  { href: '/bri6ge', label: 'BRI6GE' },
  { href: '/study-abroad', label: '6LOBAL' },
  { href: '/test-prep', label: '6RIP' },
  { href: '/about', label: 'About' },
  { href: '/stories', label: 'Stories' },
  { href: '/contact', label: 'Contact' },
] as const;

export const FOOTER_PROGRAMMES = [
  { href: '/ed6e', label: 'ED6E (Class 8–12)' },
  { href: '/bri6ge', label: 'BRI6GE (UG Year 1–3)' },
  { href: '/study-abroad', label: '6LOBAL — Study Abroad' },
  { href: '/test-prep', label: '6RIP — Test Preparation' },
  { href: '/how-it-works', label: 'How it works' },
] as const;

export const FOOTER_COMPANY = [
  { href: '/about', label: 'About ORI6IN' },
  { href: '/stories', label: 'Success stories' },
  { href: '/contact', label: 'Contact & booking' },
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms & conditions' },
] as const;

export const FOOTER_ACCOUNTS = [
  { href: '/login', label: 'Student' },
  { href: '/login', label: 'Parent' },
  { href: '/login', label: 'Counsellor & staff' },
] as const;

/** 6RANT forex credits — same numbers on BRI6GE, 6LOBAL, and Terms. Not on 6RAND. */
export const GRANT_MILESTONES = [
  { id: 'counselling', label: 'Counselling', amountInr: 2000 },
  { id: 'ielts', label: 'IELTS', amountInr: 3000 },
  { id: 'offer', label: 'Offer letter', amountInr: 5000 },
  { id: 'visa', label: 'Visa', amountInr: 5000 },
  { id: 'arrival', label: 'Campus arrival', amountInr: 10000 },
] as const;

export const GRANT_TOTAL_INR = GRANT_MILESTONES.reduce((sum, m) => sum + m.amountInr, 0);

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export const GRANT_SUMMARY = GRANT_MILESTONES.map(
  (m) => `${m.label} ${formatInr(m.amountInr)}`,
).join(' · ');

export type CatalogueGroupId = 'A' | 'B' | 'C' | 'D' | 'E';

export type CatalogueItem = {
  id: string;
  group: CatalogueGroupId;
  /** Verbatim CRM / quote picklist value */
  label: string;
};

export const CATALOGUE_GROUPS: { id: CatalogueGroupId; label: string }[] = [
  { id: 'A', label: 'ED6E — Class 8–12' },
  { id: 'B', label: 'BRI6GE — UG Year 1–3' },
  { id: 'C', label: '6LOBAL — Admission counselling' },
  { id: 'D', label: '6RIP — Test preparation' },
  { id: 'E', label: 'Bundles' },
];

export const CATALOGUE: CatalogueItem[] = [
  {
    id: 'ed6e-class-8',
    group: 'A',
    label: 'ED6E — entry Class 8 (Discover · 5 years)',
  },
  {
    id: 'ed6e-class-9',
    group: 'A',
    label: 'ED6E — entry Class 9 (Explore · 4 years)',
  },
  {
    id: 'ed6e-class-10',
    group: 'A',
    label: 'ED6E — entry Class 10 (Define · 3 years)',
  },
  {
    id: 'ed6e-class-11',
    group: 'A',
    label: 'ED6E — entry Class 11 (Differentiate · 2 years)',
  },
  {
    id: 'ed6e-class-12',
    group: 'A',
    label: 'ED6E — entry Class 12 (Position · 1 year)',
  },
  {
    id: 'bri6ge-y1',
    group: 'B',
    label: 'BRI6GE — entry UG Year 1 (Foundation · 3 years)',
  },
  {
    id: 'bri6ge-y2',
    group: 'B',
    label: 'BRI6GE — entry UG Year 2 (Momentum · 2 years)',
  },
  {
    id: 'bri6ge-y3',
    group: 'B',
    label: 'BRI6GE — entry UG Year 3 (Launch · 1 year)',
  },
  {
    id: 'global-essential-ug-ms',
    group: 'C',
    label: '6LOBAL Essential — Admission Counselling (UG / MS)',
  },
  {
    id: 'global-essential-mba',
    group: 'C',
    label: '6LOBAL Essential — Admission Counselling (MBA)',
  },
  {
    id: 'grand-concierge',
    group: 'C',
    label: '6RAND — concierge tier (three tiers)',
  },
  { id: 'phd-guidance', group: 'C', label: 'PhD guidance' },
  { id: 'ielts-regular', group: 'D', label: 'IELTS — Regular (6 wk)' },
  { id: 'ielts-fast', group: 'D', label: 'IELTS — Fast Track (4 wk)' },
  { id: 'ielts-weekend', group: 'D', label: 'IELTS — Weekend (8 wk)' },
  { id: 'ielts-121', group: 'D', label: 'IELTS — One-to-One' },
  { id: 'toefl-regular', group: 'D', label: 'TOEFL iBT — Regular (6 wk)' },
  { id: 'toefl-fast', group: 'D', label: 'TOEFL iBT — Fast Track (4 wk)' },
  { id: 'toefl-121', group: 'D', label: 'TOEFL iBT — One-to-One' },
  { id: 'gre-regular', group: 'D', label: 'GRE — Regular (10–12 wk)' },
  { id: 'gre-intensive', group: 'D', label: 'GRE — Intensive (8 wk)' },
  { id: 'gre-121', group: 'D', label: 'GRE — One-to-One' },
  { id: 'gmat-regular', group: 'D', label: 'GMAT Focus — Regular (10–12 wk)' },
  { id: 'gmat-intensive', group: 'D', label: 'GMAT Focus — Intensive (8 wk)' },
  { id: 'gmat-121', group: 'D', label: 'GMAT Focus — One-to-One' },
  { id: 'sat-regular', group: 'D', label: 'SAT — Regular (8–10 wk)' },
  { id: 'sat-intensive', group: 'D', label: 'SAT — Intensive (6 wk)' },
  { id: 'sat-121', group: 'D', label: 'SAT — One-to-One' },
  { id: 'pte-regular', group: 'D', label: 'PTE Academic — Regular (6 wk)' },
  { id: 'pte-fast', group: 'D', label: 'PTE Academic — Fast Track (4 wk)' },
  { id: 'pte-121', group: 'D', label: 'PTE Academic — One-to-One' },
  { id: 'det-regular', group: 'D', label: 'Duolingo (DET) — Comprehensive (4–6 wk)' },
  { id: 'det-fast', group: 'D', label: 'Duolingo (DET) — Fast Track (2–3 wk)' },
  { id: 'det-121', group: 'D', label: 'Duolingo (DET) — One-to-One' },
  { id: 'german-a1', group: 'D', label: 'German Language — A1 (8 wk)' },
  { id: 'german-a2', group: 'D', label: 'German Language — A2 (8 wk)' },
  { id: 'german-b1', group: 'D', label: 'German Language — B1 (10 wk)' },
  { id: 'german-b2', group: 'D', label: 'German Language — B2 (12 wk)' },
  { id: 'german-121', group: 'D', label: 'German Language — One-to-One (per level)' },
  { id: 'french-a1', group: 'D', label: 'French Language — A1 (8 wk)' },
  { id: 'french-a2', group: 'D', label: 'French Language — A2 (8 wk)' },
  { id: 'french-b1', group: 'D', label: 'French Language — B1 (10 wk)' },
  { id: 'french-121', group: 'D', label: 'French Language — One-to-One' },
  { id: 'japanese-n5', group: 'D', label: 'Japanese Language — N5 (10–12 wk)' },
  { id: 'japanese-n4', group: 'D', label: 'Japanese Language — N4 (12 wk)' },
  { id: 'japanese-121', group: 'D', label: 'Japanese Language — One-to-One' },
  { id: 'dmat', group: 'D', label: 'dMAT preparation' },
  { id: 'bundle-ielts-global', group: 'E', label: 'IELTS + 6LOBAL counselling' },
  { id: 'bundle-gre-global', group: 'E', label: 'GRE + 6LOBAL counselling' },
  { id: 'bundle-gmat-global', group: 'E', label: 'GMAT + 6LOBAL counselling' },
  { id: 'bundle-german-global', group: 'E', label: 'German A1 + 6LOBAL counselling' },
  { id: 'bundle-ielts-german', group: 'E', label: 'IELTS + German A1' },
  { id: 'bundle-bri6ge-global', group: 'E', label: 'BRI6GE + 6LOBAL counselling' },
  { id: 'bundle-bri6ge-grip', group: 'E', label: 'BRI6GE + 6RIP (GRE + IELTS)' },
];

export function catalogueById(id: string) {
  return CATALOGUE.find((item) => item.id === id);
}

export function catalogueGrouped() {
  return CATALOGUE_GROUPS.map((group) => ({
    ...group,
    items: CATALOGUE.filter((item) => item.group === group.id),
  }));
}

/** Discovery / brochure / contact interest picklist */
export const INTEREST_OPTIONS = [
  'ED6E (Class 8–12)',
  'BRI6GE (UG Year 1–3)',
  '6LOBAL — Study Abroad',
  '6RIP — Test Preparation',
  'Not sure yet',
] as const;

export const DPDP_CONSENT_LABEL =
  'I consent to ORI6IN Education collecting my identity, contact details, and academic interest so a counsellor can call me back. If the student is under 18, a parent or guardian is providing this consent. ORI6IN does not sell personal data.';

export const LEAD_CALLBACK_PROMISE = `A counsellor will call you from ${COMPANY.phoneDisplay} within one working day.`;

export const LEAD_CONTACT_SUCCESS = `Received. A counsellor will call you from ${COMPANY.phoneDisplay} within one working day.`;

export type LeadKind = 'discovery' | 'brochure' | 'quote' | 'contact' | 'eligibility';

export const LEAD_SOURCES: Record<LeadKind, string> = {
  discovery: 'Website — book a session',
  brochure: 'Website — brochure',
  quote: 'Website — get a quote',
  contact: 'Website — contact form',
  eligibility: 'Website — eligibility check',
};

export const STUDY_DESTINATIONS = [
  {
    id: 'usa',
    name: 'USA',
    work: 'OPT 12 months + 24-month STEM extension',
    tests: 'GRE/GMAT + IELTS/TOEFL',
  },
  {
    id: 'uk',
    name: 'UK',
    work: '2-year Graduate Route post-study work',
    tests: 'IELTS/PTE',
  },
  {
    id: 'canada',
    name: 'Canada',
    work: 'PGWP up to 3 years, PR pathways',
    tests: 'IELTS/TOEFL',
  },
  {
    id: 'germany',
    name: 'Germany',
    work: 'Low/no tuition at public universities',
    tests: 'IELTS/TestDaF',
  },
  {
    id: 'ireland',
    name: 'Ireland',
    work: '2-year Third Level Graduate scheme',
    tests: 'IELTS/PTE',
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    work: '1-year orientation visa post-study',
    tests: 'IELTS/TOEFL',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    work: 'Strong Asia hub, competitive admits',
    tests: 'IELTS/TOEFL',
  },
  {
    id: 'australia',
    name: 'Australia',
    work: 'Temporary Graduate visa (2–4 years)',
    tests: 'IELTS/PTE',
  },
] as const;

export const ELIGIBILITY_QUESTIONS = [
  {
    id: 'aim',
    prompt: 'What are you aiming for?',
    options: ['Undergraduate', 'Master’s', 'MBA', 'PhD', 'Test prep'] as const,
  },
  {
    id: 'qualification',
    prompt: 'Highest completed qualification?',
    options: ['Class 10', 'Class 12', 'Bachelor’s', 'Master’s'] as const,
  },
  {
    id: 'percentage',
    prompt: 'Approximate academic percentage?',
    options: ['Below 65%', '65–75%', '75–85%', 'Above 85%'] as const,
  },
  {
    id: 'english',
    prompt: 'English test status?',
    options: ['Not started', 'Booked', 'Done below 6.5', 'Done 6.5 or above'] as const,
  },
  {
    id: 'destinations',
    prompt: 'Preferred destinations?',
    options: [
      'USA-Canada',
      'UK-Ireland',
      'Germany-Netherlands',
      'Singapore-Australia',
    ] as const,
  },
  {
    id: 'start',
    prompt: 'When do you want to start?',
    options: ['2026', '2027', '2028 or later', 'Not sure yet'] as const,
  },
] as const;

export type EligibilityAnswers = Record<(typeof ELIGIBILITY_QUESTIONS)[number]['id'], string>;

export type EligibilityVerdictId = 'strong' | 'possible' | 'solid';

export function eligibilityVerdict(answers: Partial<EligibilityAnswers>): EligibilityVerdictId {
  if (answers.percentage === 'Below 65%') return 'possible';
  if (answers.percentage === 'Above 85%' && answers.english === 'Done 6.5 or above') {
    return 'strong';
  }
  return 'solid';
}

export const ELIGIBILITY_VERDICTS: Record<
  EligibilityVerdictId,
  { title: string; body: string }
> = {
  strong: {
    title: 'Strong starting position',
    body: 'Your academics and English test already sit in a competitive band. A counsellor will still map Reach / Match / Safe options against the current intake.',
  },
  possible: {
    title: 'Possible — with the right map',
    body: 'The file needs a clear plan: destination fit, test timeline, and evidence beyond marks. We will send the full read after you share contact details.',
  },
  solid: {
    title: 'Solid foundation',
    body: 'There is enough to work with. The next step is a personalised map of tests, destinations, and timing.',
  },
};

/** Master’s + Bachelor’s (UG years) should be flagged toward BRI6GE. */
export function eligibilitySuggestsBri6ge(answers: Partial<EligibilityAnswers>) {
  return answers.aim === 'Master’s' && answers.qualification === 'Bachelor’s';
}

export const ED6E_STAGES = [
  {
    catalogueId: 'ed6e-class-8',
    entry: 'Class 8',
    stage: 'Discover',
    years: '5 years',
    focus: 'Aptitude mapping, interest inventory, reading habits, first exposure menus.',
  },
  {
    catalogueId: 'ed6e-class-9',
    entry: 'Class 9',
    stage: 'Explore',
    years: '4 years',
    focus: 'Taster projects, competitions, club roles, first portfolio entries.',
  },
  {
    catalogueId: 'ed6e-class-10',
    entry: 'Class 10',
    stage: 'Define',
    years: '3 years',
    focus: 'Stream and board decisions, direction essays, summer programmes.',
  },
  {
    catalogueId: 'ed6e-class-11',
    entry: 'Class 11',
    stage: 'Differentiate',
    years: '2 years',
    focus: 'Signature project, leadership evidence, external validation, test calendar.',
  },
  {
    catalogueId: 'ed6e-class-12',
    entry: 'Class 12',
    stage: 'Position',
    years: '1 year',
    focus: 'Applications, essays, interviews.',
  },
] as const;

export const BRI6GE_STAGES = [
  {
    catalogueId: 'bri6ge-y1',
    entry: 'UG Year 1',
    stage: 'Foundation',
    years: '3 years',
    focus:
      'Profile audit, direction-setting, first internships and research exposure, reading and skill habits.',
  },
  {
    catalogueId: 'bri6ge-y2',
    entry: 'UG Year 2',
    stage: 'Momentum',
    years: '2 years',
    focus:
      'Signature project, internship depth, GRE/IELTS calendar begins, German-route decisions (uni-assist, APS, dMAT from 2027).',
  },
  {
    catalogueId: 'bri6ge-y3',
    entry: 'UG Year 3',
    stage: 'Launch',
    years: '1 year',
    focus:
      'Final profile polish, tests completed, shortlist drafted, handover to 6LOBAL for the applications.',
  },
] as const;

export type GripTestItem = {
  id: string;
  name: string;
  startingPrice: string;
  startingPriceInr: number;
  badge?: string;
  summary?: string;
  variants: readonly string[];
};

export const GRIP_TESTS: readonly GripTestItem[] = [
  {
    id: 'ielts',
    name: 'IELTS Academic & General',
    startingPrice: '₹15,000',
    startingPriceInr: 15000,
    badge: 'Starts from ₹15k',
    summary: 'Band 7.5+ coaching with live Cambridge diagnostic mocks & 1-on-1 speaking reviews.',
    variants: ['ielts-regular', 'ielts-fast', 'ielts-weekend', 'ielts-121'] as const,
  },
  {
    id: 'toefl',
    name: 'TOEFL iBT',
    startingPrice: '₹15,000',
    startingPriceInr: 15000,
    badge: 'Starts from ₹15k',
    summary: 'Score 100+ targeted training with computer-based mock analytics and speech reviews.',
    variants: ['toefl-regular', 'toefl-fast', 'toefl-121'] as const,
  },
  {
    id: 'gre',
    name: 'GRE General',
    startingPrice: '₹35,000',
    startingPriceInr: 35000,
    badge: 'Starts from ₹35k',
    summary: '325+ target prep covering Quant shortcuts, high-frequency Verbal vocab & AWA strategy.',
    variants: ['gre-regular', 'gre-intensive', 'gre-121'] as const,
  },
  {
    id: 'gmat',
    name: 'GMAT Focus Edition',
    startingPrice: '₹35,000',
    startingPriceInr: 35000,
    badge: 'Starts from ₹35k',
    summary: 'Top B-school focus with Quant mastery, Data Insights case prep & adaptive mocks.',
    variants: ['gmat-regular', 'gmat-intensive', 'gmat-121'] as const,
  },
  {
    id: 'sat',
    name: 'Digital SAT',
    startingPrice: '₹40,000',
    startingPriceInr: 40000,
    badge: 'Starts from ₹40k',
    summary: '1500+ Ivy & top US university target prep with Bluebook app mocks & Math mastery.',
    variants: ['sat-regular', 'sat-intensive', 'sat-121'] as const,
  },
  {
    id: 'pte',
    name: 'PTE Academic',
    startingPrice: '₹15,000',
    startingPriceInr: 15000,
    badge: 'Starts from ₹15k',
    summary: 'Fast-track Pearson scoring for Australia, UK, and Canada university & visa requirements.',
    variants: ['pte-regular', 'pte-fast', 'pte-121'] as const,
  },
  {
    id: 'det',
    name: 'Duolingo English Test (DET)',
    startingPrice: '₹15,000',
    startingPriceInr: 15000,
    badge: 'Starts from ₹15k',
    summary: 'Target 125+ with computer-adaptive test strategies, mock evaluations & rapid feedback.',
    variants: ['det-regular', 'det-fast', 'det-121'] as const,
  },
  {
    id: 'german',
    name: 'German Language (A1 – B2)',
    startingPrice: '₹25,000',
    startingPriceInr: 25000,
    badge: 'Starts from ₹25k',
    summary: 'Goethe-Institut & TestDaF curriculum for German university tuition-free admissions & APS visa.',
    variants: ['german-a1', 'german-a2', 'german-b1', 'german-b2', 'german-121'] as const,
  },
  {
    id: 'french',
    name: 'French Language (A1 – B1)',
    startingPrice: '₹32,000',
    startingPriceInr: 32000,
    badge: 'Starts from ₹32k',
    summary: 'DELF/DALF certified syllabus for France and Canada (bonus Express Entry points).',
    variants: ['french-a1', 'french-a2', 'french-b1', 'french-121'] as const,
  },
  {
    id: 'japanese',
    name: 'Japanese Language (JLPT N5 – N4)',
    startingPrice: '₹30,000',
    startingPriceInr: 30000,
    badge: 'Starts from ₹30k',
    summary: 'JLPT certified coaching for Japan university admissions, MEXT scholarships & tech careers.',
    variants: ['japanese-n5', 'japanese-n4', 'japanese-121'] as const,
  },
];

export const GRIP_FORMAT_LINE = 'Small-batch and one-to-one · Jayanagar centre and online';

export const BUNDLE_IDS = [
  'bundle-ielts-global',
  'bundle-gre-global',
  'bundle-gmat-global',
  'bundle-german-global',
  'bundle-ielts-german',
  'bundle-bri6ge-global',
  'bundle-bri6ge-grip',
] as const;
