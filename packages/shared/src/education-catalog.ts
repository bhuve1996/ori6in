/**
 * ORI6IN Education catalogue + static tool datasets (from product docs).
 * Programs are seeded via DEMO_PROGRAMS in demo-content.
 */

export type ProgramCategory =
  | 'flagship'
  | 'packages'
  | 'test-prep'
  | 'admissions'
  | 'combos'
  | 'premium';

export type CatalogProgram = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  priceCents: number;
  currency: 'INR';
  isOwnProduct: true;
  published: boolean;
  category: ProgramCategory;
};

const INR = 'INR' as const;
const own = { currency: INR, isOwnProduct: true as const };

/** Lower-priority first → newer createdAt on flagship / packages (list DESC). */
export const EDUCATION_PROGRAMS: CatalogProgram[] = [
  // —— Premium add-ons ——
  {
    ...own,
    category: 'premium',
    title: 'ORI6IN Fly',
    slug: 'ori6in-fly',
    summary: 'Pre-departure support — housing, travel, forex, SIM, and arrival guidance.',
    description:
      'ORI6IN Fly covers everything after the admit and before you leave India.\n\nIncludes pre-departure orientation, accommodation assistance, flight guidance, forex, insurance, SIM, banking, packing checklist, airport guidance, and arrival support.',
    priceCents: 999900,
    published: true,
  },
  {
    ...own,
    category: 'premium',
    title: 'ORI6IN Finance',
    slug: 'ori6in-finance',
    summary: 'Education loans, bank/NBFC options, financial documentation, and forex guidance.',
    description:
      'ORI6IN Finance helps fund your study-abroad journey.\n\nIncludes loan eligibility guidance, bank/NBFC options, financial documentation, loan application assistance, and forex planning.',
    priceCents: 1499900,
    published: true,
  },
  {
    ...own,
    category: 'premium',
    title: 'ORI6IN Visa Assist',
    slug: 'ori6in-visa-assist',
    summary: 'Visa documentation, financial guidance, mock interviews, and application support.',
    description:
      'ORI6IN Visa Assist helps after admission is secured.\n\nIncludes visa documentation, application guidance, financial documentation, visa SOP/statement guidance where applicable, mock interviews, and country-specific prep (F-1, UK, Australia, Canada study permit, and more).',
    priceCents: 1999900,
    published: true,
  },
  {
    ...own,
    category: 'premium',
    title: 'ORI6IN Scholarship Assist',
    slug: 'ori6in-scholarship-assist',
    summary: 'Scholarship shortlisting, application strategy, and funding guidance.',
    description:
      'ORI6IN Scholarship Assist finds and positions funding for your education.\n\nIncludes eligibility assessment, university & merit scholarships, country-specific scholarships, application guidance, education-loan pointers, and financial planning.',
    priceCents: 2499900,
    published: true,
  },
  {
    ...own,
    category: 'premium',
    title: 'ORI6IN Profile Builder',
    slug: 'ori6in-profile-builder',
    summary: 'Strengthen academics, projects, extracurriculars, and LinkedIn before you apply.',
    description:
      'ORI6IN Profile Builder strengthens your profile before applications.\n\nIncludes profile assessment, academic planning, internship guidance, certification roadmap, research guidance, extracurricular planning, resume building, and LinkedIn guidance.',
    priceCents: 3999900,
    published: true,
  },
  {
    ...own,
    category: 'premium',
    title: 'ORI6IN Apply',
    slug: 'ori6in-apply',
    summary: 'From shortlist to admit — applications, SOP/LOR, tracking, and offer evaluation.',
    description:
      'ORI6IN Apply takes you from shortlist to admit.\n\nIncludes university shortlisting, application strategy, submission, SOP assistance, LOR guidance, resume/CV, document verification, application tracking, university communication, and offer evaluation.',
    priceCents: 5999900,
    published: true,
  },
  {
    ...own,
    category: 'premium',
    title: 'ORI6IN Career Compass',
    slug: 'ori6in-career-compass',
    summary: 'Career counselling, course & country selection, ROI discussion, and a study-abroad roadmap.',
    description:
      'ORI6IN Career Compass is for students who do not yet know what to study.\n\nIncludes career counselling, course selection, country selection, career pathway mapping, industry prospects, course-to-career mapping, ROI discussion, and a personalised study-abroad roadmap. Pair with the free Career & Course Finder tool.',
    priceCents: 1999900,
    published: true,
  },

  // —— Combos ——
  {
    ...own,
    category: 'combos',
    title: 'German + Germany Admissions',
    slug: 'combo-german-germany',
    summary: 'German language training plus Germany bachelor’s or master’s application support.',
    description:
      'Combo: ORI6IN German (A1–B2 pathway) + Germany university applications.\n\nIdeal for public universities and English/German-taught master’s. Includes language milestones, shortlisting, applications, and counsellor check-ins.',
    priceCents: 8999900,
    published: true,
  },
  {
    ...own,
    category: 'combos',
    title: 'SAT + USA Undergraduate',
    slug: 'combo-sat-usa-ug',
    summary: 'SAT preparation plus USA bachelor’s application package.',
    description:
      'Combo: ORI6IN SAT + USA Undergraduate Admissions.\n\nIncludes SAT coaching with mocks, university shortlisting, Common App / institutional applications, essays, and counsellor tracking.',
    priceCents: 9999900,
    published: true,
  },
  {
    ...own,
    category: 'combos',
    title: 'TOEFL + USA Admissions',
    slug: 'combo-toefl-usa',
    summary: 'TOEFL preparation plus USA university application support.',
    description:
      'Combo: ORI6IN TOEFL + USA admissions pathway (undergraduate or master’s).\n\nScore-target coaching plus shortlisting, applications, SOP/LOR, and tracking.',
    priceCents: 9499900,
    published: true,
  },
  {
    ...own,
    category: 'combos',
    title: 'IELTS + Study Abroad',
    slug: 'combo-ielts-abroad',
    summary: 'IELTS preparation plus university admissions for your chosen destination.',
    description:
      'Combo: ORI6IN IELTS + admissions support for UK, Canada, Australia, Ireland, NZ, or other IELTS destinations.\n\nBand-target coaching plus shortlisting and application management.',
    priceCents: 8999900,
    published: true,
  },
  {
    ...own,
    category: 'combos',
    title: 'GMAT + USA Admissions',
    slug: 'combo-gmat-usa',
    summary: 'GMAT preparation plus MBA / master’s application support for the USA.',
    description:
      'Combo: ORI6IN GMAT + USA MBA/Master’s applications.\n\nStructured GMAT coaching with mocks plus school shortlisting, essays, recommendations, and interview prep.',
    priceCents: 11999900,
    published: true,
  },
  {
    ...own,
    category: 'combos',
    title: 'GRE + USA Admissions',
    slug: 'combo-gre-usa',
    summary: 'GRE preparation plus complete USA master’s application support.',
    description:
      'Combo: ORI6IN GRE + Complete USA Master’s Application.\n\nGRE coaching with score tracking plus university shortlisting, SOP/LOR, applications, and scholarship pointers.',
    priceCents: 10999900,
    published: true,
  },

  // —— Country admissions ——
  {
    ...own,
    category: 'admissions',
    title: 'Europe Admissions',
    slug: 'europe-admissions',
    summary: 'France, Netherlands, and wider Europe — bachelor’s and master’s pathways.',
    description:
      'ORI6IN Europe Admissions covers France, Netherlands, and other European destinations.\n\nIncludes profile evaluation, university shortlisting, applications, document guidance, and counsellor support for English- and local-language programs.',
    priceCents: 6999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Japan Admissions',
    slug: 'japan-admissions',
    summary: 'Japan undergraduate and master’s admissions with counsellor support.',
    description:
      'Japan study-abroad admissions support.\n\nIncludes shortlisting, application guidance, document checklists, and prep for university-specific requirements.',
    priceCents: 6999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'New Zealand Admissions',
    slug: 'new-zealand-admissions',
    summary: 'New Zealand undergraduate and master’s application support.',
    description:
      'New Zealand admissions for bachelor’s and master’s pathways.\n\nIncludes shortlisting, applications, SOP guidance, and offer follow-up.',
    priceCents: 6499900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Ireland Admissions',
    slug: 'ireland-admissions',
    summary: 'Ireland undergraduate and master’s admissions with counsellor support.',
    description:
      'Ireland study-abroad admissions.\n\nIncludes university shortlisting, applications, document verification, and scholarship pointers.',
    priceCents: 6499900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Germany Bachelor’s Admissions',
    slug: 'germany-bachelors-admissions',
    summary: 'Germany bachelor’s and public university application support.',
    description:
      'Germany Bachelor’s Admissions — including public university pathways.\n\nIncludes profile evaluation, shortlisting, applications, APS/document guidance where relevant, and counsellor tracking. Pair with ORI6IN German when needed.',
    priceCents: 6999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Germany Master’s Admissions',
    slug: 'germany-masters-admissions',
    summary: 'Germany master’s applications for public and private universities.',
    description:
      'Germany Master’s Admissions for STEM and non-STEM pathways.\n\nIncludes shortlisting, applications, SOP/LOR, document checklists, and scholarship pointers. Strong combo with German language training.',
    priceCents: 7499900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Australia Undergraduate Admissions',
    slug: 'australia-undergraduate-admissions',
    summary: 'Australia bachelor’s applications with shortlisting and counsellor support.',
    description:
      'Australia Undergraduate Admissions.\n\nIncludes profile evaluation, university shortlisting, applications, document guidance, and offer tracking.',
    priceCents: 6999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Australia Master’s Admissions',
    slug: 'australia-masters-admissions',
    summary: 'Australia master’s and MBA application support.',
    description:
      'Australia Master’s / MBA Admissions.\n\nIncludes shortlisting, applications, SOP/LOR, scholarship pointers, and counsellor follow-up.',
    priceCents: 7999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Canada Undergraduate Admissions',
    slug: 'canada-undergraduate-admissions',
    summary: 'Canada bachelor’s and college program application support.',
    description:
      'Canada Undergraduate / College Admissions.\n\nIncludes shortlisting, applications, document checklists, and pathway guidance for universities and colleges.',
    priceCents: 6999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'Canada Master’s Admissions',
    slug: 'canada-masters-admissions',
    summary: 'Canada master’s applications with shortlisting and scholarship pointers.',
    description:
      'Canada Master’s Admissions.\n\nIncludes profile evaluation, university shortlisting, applications, SOP/LOR, and funding guidance.',
    priceCents: 7999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'UK Undergraduate Admissions',
    slug: 'uk-undergraduate-admissions',
    summary: 'UK bachelor’s and foundation pathway applications (UCAS and direct).',
    description:
      'UK Undergraduate / Foundation Admissions.\n\nIncludes course selection, UCAS/direct applications, personal statement support, and counsellor tracking.',
    priceCents: 7499900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'UK Master’s Admissions',
    slug: 'uk-masters-admissions',
    summary: 'UK master’s and MBA applications with SOP and offer support.',
    description:
      'UK Master’s / MBA Admissions.\n\nIncludes shortlisting, applications, SOP/LOR, scholarship pointers, and CAS-oriented checklist guidance.',
    priceCents: 8499900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'USA PhD Admissions',
    slug: 'usa-phd-admissions',
    summary: 'USA PhD applications — research fit, SOP, recommendations, and tracking.',
    description:
      'USA PhD Admissions.\n\nIncludes research-fit shortlisting, SOP, academic CV, LOR strategy, application submission, and interview preparation.',
    priceCents: 9999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'USA MBA Admissions',
    slug: 'usa-mba-admissions',
    summary: 'USA MBA applications — school selection, essays, and interview prep.',
    description:
      'USA MBA Admissions.\n\nIncludes school shortlisting, essays, recommendations, resume, application tracking, and interview preparation. Pair with GMAT combo when needed.',
    priceCents: 9999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'USA STEM Programs',
    slug: 'usa-stem-admissions',
    summary: 'USA STEM master’s focus — shortlisting, applications, and scholarship pointers.',
    description:
      'USA STEM Programs admissions support.\n\nIncludes STEM-focused university shortlisting, applications, SOP/LOR, and funding guidance for engineering, CS, data, and related fields.',
    priceCents: 9499900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'USA Undergraduate Admissions',
    slug: 'usa-undergraduate-admissions',
    summary: 'USA bachelor’s applications — shortlisting, essays, and counsellor tracking.',
    description:
      'USA Undergraduate Admissions.\n\nIncludes profile evaluation, university shortlisting (safe/target/ambitious), applications, essays, recommendations, and tracking. Pair with SAT combo when needed.',
    priceCents: 8999900,
    published: true,
  },
  {
    ...own,
    category: 'admissions',
    title: 'USA Master’s Admissions',
    slug: 'usa-masters-admissions',
    summary: 'University shortlisting, applications, SOP/LOR, and tracking for USA master’s.',
    description:
      'Focused USA Master’s admissions support.\n\nIncludes profile evaluation, university shortlisting, application strategy & submission, SOP/LOR guidance, resume review, scholarship pointers, and application tracking across intakes.',
    priceCents: 8999900,
    published: true,
  },

  // —— Test prep ——
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN DET',
    slug: 'ori6in-det',
    summary: 'Duolingo English Test preparation — online coaching with mocks.',
    description:
      'ORI6IN DET prepares you for the Duolingo English Test.\n\nOnline format with practice sets, mock tests, and score-target coaching. Ideal for universities that accept DET.',
    priceCents: 999900,
    published: true,
  },
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN PTE',
    slug: 'ori6in-pte',
    summary: 'PTE Academic preparation — classroom or online with mock analysis.',
    description:
      'ORI6IN PTE covers PTE Academic skills with timed practice.\n\nClassroom or online formats, mock tests, and performance analysis for UK, Australia, Canada, and other PTE destinations.',
    priceCents: 1299900,
    published: true,
  },
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN German',
    slug: 'ori6in-german',
    summary: 'German language training (A1–B2) for Germany admissions — classroom or online.',
    description:
      'ORI6IN German prepares you for German-taught and many English-taught pathways in Germany.\n\nLive or online classes covering A1–B2, with speaking practice and admissions-aligned milestones.',
    priceCents: 1799900,
    published: true,
  },
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN SAT',
    slug: 'ori6in-sat',
    summary: 'SAT preparation for US undergraduate admissions — classroom or online.',
    description:
      'ORI6IN SAT builds Reading, Writing, and Math skills with timed practice.\n\nIncludes live or online classes, mock tests, and an admissions-ready study plan.',
    priceCents: 1999900,
    published: true,
  },
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN TOEFL',
    slug: 'ori6in-toefl',
    summary: 'TOEFL preparation with mocks and section-wise coaching — classroom or online.',
    description:
      'ORI6IN TOEFL covers Reading, Listening, Speaking, and Writing with score-target plans.\n\nIncludes free demo options, mock tests, and performance analysis.',
    priceCents: 1499900,
    published: true,
  },
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN GMAT',
    slug: 'ori6in-gmat',
    summary: 'GMAT preparation for MBA and master’s applications — classroom or online.',
    description:
      'ORI6IN GMAT targets Quant, Verbal, and Data Insights with structured mocks.\n\nClassroom or online formats with performance analysis and strategy sessions.',
    priceCents: 2999900,
    published: true,
  },
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN GRE',
    slug: 'ori6in-gre',
    summary: 'GRE preparation for master’s and PhD pathways — classroom or online.',
    description:
      'ORI6IN GRE covers Verbal, Quant, and Analytical Writing with timed mocks and score tracking.\n\nClassroom or online coaching aligned to USA/Canada/Europe master’s targets.',
    priceCents: 2499900,
    published: true,
  },
  {
    ...own,
    category: 'test-prep',
    title: 'ORI6IN IELTS',
    slug: 'ori6in-ielts',
    summary: 'IELTS preparation with live classes, mocks, and band-score coaching.',
    description:
      'ORI6IN IELTS builds Listening, Reading, Writing, and Speaking toward your target band.\n\nClassroom or online formats, free demo classes, mock tests, and performance analysis.',
    priceCents: 1499900,
    published: true,
  },

  // —— Packages ——
  {
    ...own,
    category: 'packages',
    title: 'ORI6IN Essential',
    slug: 'ori6in-essential',
    summary: 'Guidance package — profile evaluation, shortlisting, SOP review, and email support.',
    description:
      'ORI6IN Essential is for students who need clear guidance without full hand-holding.\n\nIncludes profile evaluation, career & course guidance, university shortlisting, application guidance, document checklist, SOP review, and email support.',
    priceCents: 2499900,
    published: true,
  },
  {
    ...own,
    category: 'packages',
    title: 'ORI6IN Advantage',
    slug: 'ori6in-advantage',
    summary: 'Most popular — applications, SOP editing, scholarships, and interview prep.',
    description:
      'ORI6IN Advantage is our most popular admissions package.\n\nEverything in Essential, plus detailed university shortlisting, SOP editing, LOR guidance, resume/CV review, application submission, scholarship guidance, application tracking, and interview preparation.',
    priceCents: 7499900,
    published: true,
  },
  {
    ...own,
    category: 'packages',
    title: 'ORI6IN Premier',
    slug: 'ori6in-premier',
    summary: 'End-to-end support with a dedicated counsellor, visa guidance, and pre-departure.',
    description:
      'ORI6IN Premier is complete end-to-end admission support.\n\nEverything in Advantage, plus a dedicated counsellor, profile building, complete application management, scholarship strategy, visa documentation guidance, mock visa interviews, priority support, and pre-departure orientation.',
    priceCents: 14999900,
    published: true,
  },
  {
    ...own,
    category: 'flagship',
    title: 'ORI6IN 360°',
    slug: 'ori6in-360',
    summary: 'Flagship end-to-end journey — test prep to university, scholarship, visa, and fly.',
    description:
      'ORI6IN 360° is our flagship study-abroad program: Dream. Apply. Fly.\n\nFrom discover → decide → shortlist → prepare → apply → fund → admit → visa → fly → connect.\n\nIncludes profile evaluation, career counselling, test-prep pathway, university shortlisting, SOP & LOR assistance, resume building, application processing, scholarship guidance, interview preparation, visa guidance, pre-departure orientation, and Student Hub access.\n\nDestinations: USA, UK, Canada, Australia, Germany, Ireland, New Zealand, Japan, France, Netherlands, and Europe.',
    priceCents: 24999900,
    published: true,
  },
  {
    ...own,
    category: 'packages',
    title: 'ORI6IN Mentor Intensive (draft)',
    slug: 'mentor-intensive-draft',
    summary: 'Draft program for admin catalog testing — not public.',
    description: 'This draft stays unpublished so admin can verify draft visibility.',
    priceCents: 999900,
    published: false,
  },
];

/** Strip category before DB seed (Program model has no category column). */
export function toSeedPrograms(programs: CatalogProgram[] = EDUCATION_PROGRAMS) {
  return programs.map(({ category: _c, ...rest }) => rest);
}

export const PROGRAM_CATEGORY_LABELS: Record<ProgramCategory, string> = {
  flagship: 'Flagship',
  packages: 'Admission packages',
  'test-prep': 'Test prep',
  admissions: 'Study abroad admissions',
  combos: 'Combos',
  premium: 'Premium services',
};

export function categoryForSlug(slug: string): ProgramCategory | null {
  return EDUCATION_PROGRAMS.find((p) => p.slug === slug)?.category ?? null;
}

/* ——— Tool datasets ——— */

export type DestinationKey =
  | 'usa'
  | 'uk'
  | 'canada'
  | 'australia'
  | 'germany'
  | 'ireland'
  | 'new-zealand'
  | 'japan'
  | 'france'
  | 'netherlands';

export const DESTINATIONS: Array<{
  key: DestinationKey;
  name: string;
  flag: string;
  tuitionRangeUsd: [number, number];
  livingMonthlyUsd: [number, number];
  workWhileStudy: string;
  postStudy: string;
  englishTests: string[];
  highlights: string[];
}> = [
  {
    key: 'usa',
    name: 'USA',
    flag: '🇺🇸',
    tuitionRangeUsd: [18000, 55000],
    livingMonthlyUsd: [1200, 2200],
    workWhileStudy: 'On-campus ~20 hrs/week',
    postStudy: 'OPT / STEM OPT',
    englishTests: ['TOEFL', 'IELTS', 'DET'],
    highlights: ['Largest university choice', 'Strong STEM & MBA', 'Research & PhD depth'],
  },
  {
    key: 'uk',
    name: 'UK',
    flag: '🇬🇧',
    tuitionRangeUsd: [16000, 45000],
    livingMonthlyUsd: [1100, 2000],
    workWhileStudy: 'Up to 20 hrs/week term-time',
    postStudy: 'Graduate Route (typically 2 years)',
    englishTests: ['IELTS', 'PTE', 'TOEFL'],
    highlights: ['1-year master’s common', 'UCAS for undergrad', 'Global brand universities'],
  },
  {
    key: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    tuitionRangeUsd: [14000, 40000],
    livingMonthlyUsd: [1000, 1800],
    workWhileStudy: 'Off-campus work often allowed with study permit',
    postStudy: 'PGWP pathways',
    englishTests: ['IELTS', 'PTE', 'TOEFL'],
    highlights: ['College + university pathways', 'Immigration-friendly narrative', 'Co-op options'],
  },
  {
    key: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    tuitionRangeUsd: [15000, 42000],
    livingMonthlyUsd: [1100, 1900],
    workWhileStudy: 'Student visa work rights (check current rules)',
    postStudy: 'Temporary Graduate visa pathways',
    englishTests: ['IELTS', 'PTE', 'TOEFL'],
    highlights: ['Strong cities for students', 'Research & professional degrees', 'Regional options'],
  },
  {
    key: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    tuitionRangeUsd: [0, 18000],
    livingMonthlyUsd: [900, 1400],
    workWhileStudy: 'Limited hours; check visa rules',
    postStudy: 'Job-seeker / residence pathways',
    englishTests: ['IELTS', 'TOEFL', 'German A1–B2'],
    highlights: ['Public universities (low/no tuition)', 'STEM strength', 'German helps long-term'],
  },
  {
    key: 'ireland',
    name: 'Ireland',
    flag: '🇮🇪',
    tuitionRangeUsd: [12000, 32000],
    livingMonthlyUsd: [1100, 1800],
    workWhileStudy: 'Part-time during term (check stamp)',
    postStudy: 'Stay-back options for graduates',
    englishTests: ['IELTS', 'PTE'],
    highlights: ['English-speaking EU hub', 'Tech employers', 'Compact geography'],
  },
  {
    key: 'new-zealand',
    name: 'New Zealand',
    flag: '🇳🇿',
    tuitionRangeUsd: [14000, 35000],
    livingMonthlyUsd: [1000, 1700],
    workWhileStudy: 'Student visa work conditions apply',
    postStudy: 'Post-study work visas',
    englishTests: ['IELTS', 'PTE'],
    highlights: ['Quality of life', 'Research universities', 'Safe student cities'],
  },
  {
    key: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    tuitionRangeUsd: [5000, 15000],
    livingMonthlyUsd: [800, 1400],
    workWhileStudy: 'Permission-based part-time work',
    postStudy: 'Job-hunting visas / employment',
    englishTests: ['IELTS', 'TOEFL', 'Japanese JLPT'],
    highlights: ['Tech & engineering', 'English-taught programs growing', 'Cultural immersion'],
  },
  {
    key: 'france',
    name: 'France',
    flag: '🇫🇷',
    tuitionRangeUsd: [3000, 20000],
    livingMonthlyUsd: [900, 1600],
    workWhileStudy: 'Part-time allowed under student status',
    postStudy: 'Job-seeker / talent pathways',
    englishTests: ['IELTS', 'TOEFL', 'French TCF/DELF'],
    highlights: ['Public tuition advantages', 'Business & design schools', 'EU access'],
  },
  {
    key: 'netherlands',
    name: 'Netherlands',
    flag: '🇳🇱',
    tuitionRangeUsd: [8000, 22000],
    livingMonthlyUsd: [1000, 1700],
    workWhileStudy: 'Limited hours with work permit rules',
    postStudy: 'Orientation year for graduates',
    englishTests: ['IELTS', 'TOEFL'],
    highlights: ['Many English-taught degrees', 'Innovation hubs', 'Bikeable student cities'],
  },
];

export type UniLevel = 'undergraduate' | 'masters' | 'mba' | 'phd';

export const SAMPLE_UNIVERSITIES: Array<{
  id: string;
  name: string;
  country: DestinationKey;
  city: string;
  levels: UniLevel[];
  fields: string[];
  tuitionUsd: number;
  ieltsMin: number;
  greOptional: boolean;
  scholarshipLikely: boolean;
  selectivity: 'safe' | 'target' | 'ambitious';
}> = [
  { id: 'asu', name: 'Arizona State University', country: 'usa', city: 'Tempe', levels: ['undergraduate', 'masters'], fields: ['CS', 'Business', 'Engineering'], tuitionUsd: 32000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'safe' },
  { id: 'northeastern', name: 'Northeastern University', country: 'usa', city: 'Boston', levels: ['undergraduate', 'masters'], fields: ['CS', 'Data', 'Engineering'], tuitionUsd: 48000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'cmu', name: 'Carnegie Mellon University', country: 'usa', city: 'Pittsburgh', levels: ['masters', 'phd'], fields: ['CS', 'AI', 'Engineering'], tuitionUsd: 52000, ieltsMin: 7.0, greOptional: false, scholarshipLikely: false, selectivity: 'ambitious' },
  { id: 'uiuc', name: 'University of Illinois Urbana-Champaign', country: 'usa', city: 'Urbana', levels: ['masters', 'phd'], fields: ['CS', 'Engineering'], tuitionUsd: 36000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'manchester', name: 'University of Manchester', country: 'uk', city: 'Manchester', levels: ['undergraduate', 'masters'], fields: ['Business', 'Engineering', 'CS'], tuitionUsd: 28000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'ucl', name: 'University College London', country: 'uk', city: 'London', levels: ['undergraduate', 'masters', 'phd'], fields: ['CS', 'Design', 'Sciences'], tuitionUsd: 35000, ieltsMin: 7.0, greOptional: true, scholarshipLikely: false, selectivity: 'ambitious' },
  { id: 'glasgow', name: 'University of Glasgow', country: 'uk', city: 'Glasgow', levels: ['undergraduate', 'masters'], fields: ['Business', 'Engineering'], tuitionUsd: 26000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'safe' },
  { id: 'toronto', name: 'University of Toronto', country: 'canada', city: 'Toronto', levels: ['undergraduate', 'masters', 'phd'], fields: ['CS', 'Sciences', 'Business'], tuitionUsd: 42000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: false, selectivity: 'ambitious' },
  { id: 'ubc', name: 'University of British Columbia', country: 'canada', city: 'Vancouver', levels: ['undergraduate', 'masters'], fields: ['CS', 'Engineering', 'Sciences'], tuitionUsd: 38000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'waterloo', name: 'University of Waterloo', country: 'canada', city: 'Waterloo', levels: ['undergraduate', 'masters'], fields: ['CS', 'Engineering'], tuitionUsd: 36000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'melbourne', name: 'University of Melbourne', country: 'australia', city: 'Melbourne', levels: ['undergraduate', 'masters'], fields: ['Business', 'CS', 'Sciences'], tuitionUsd: 34000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'ambitious' },
  { id: 'unsw', name: 'UNSW Sydney', country: 'australia', city: 'Sydney', levels: ['undergraduate', 'masters'], fields: ['Engineering', 'Business', 'CS'], tuitionUsd: 33000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'monash', name: 'Monash University', country: 'australia', city: 'Melbourne', levels: ['undergraduate', 'masters'], fields: ['Business', 'Engineering', 'Pharmacy'], tuitionUsd: 30000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'safe' },
  { id: 'tum', name: 'Technical University of Munich', country: 'germany', city: 'Munich', levels: ['masters', 'phd'], fields: ['Engineering', 'CS', 'Sciences'], tuitionUsd: 1500, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'ambitious' },
  { id: 'rwth', name: 'RWTH Aachen', country: 'germany', city: 'Aachen', levels: ['masters'], fields: ['Engineering', 'CS'], tuitionUsd: 1200, ieltsMin: 6.0, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'tu-berlin', name: 'TU Berlin', country: 'germany', city: 'Berlin', levels: ['undergraduate', 'masters'], fields: ['Engineering', 'CS'], tuitionUsd: 800, ieltsMin: 6.0, greOptional: true, scholarshipLikely: true, selectivity: 'safe' },
  { id: 'trinity', name: 'Trinity College Dublin', country: 'ireland', city: 'Dublin', levels: ['undergraduate', 'masters'], fields: ['CS', 'Business', 'Sciences'], tuitionUsd: 24000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'ambitious' },
  { id: 'ucd', name: 'University College Dublin', country: 'ireland', city: 'Dublin', levels: ['undergraduate', 'masters'], fields: ['Business', 'Engineering'], tuitionUsd: 22000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'auckland', name: 'University of Auckland', country: 'new-zealand', city: 'Auckland', levels: ['undergraduate', 'masters'], fields: ['Business', 'Engineering', 'Sciences'], tuitionUsd: 28000, ieltsMin: 6.0, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'otago', name: 'University of Otago', country: 'new-zealand', city: 'Dunedin', levels: ['undergraduate', 'masters'], fields: ['Sciences', 'Health'], tuitionUsd: 26000, ieltsMin: 6.0, greOptional: true, scholarshipLikely: true, selectivity: 'safe' },
  { id: 'tokyo', name: 'University of Tokyo', country: 'japan', city: 'Tokyo', levels: ['masters', 'phd'], fields: ['Engineering', 'Sciences'], tuitionUsd: 5500, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'ambitious' },
  { id: 'osaka', name: 'Osaka University', country: 'japan', city: 'Osaka', levels: ['masters'], fields: ['Engineering', 'Sciences'], tuitionUsd: 5200, ieltsMin: 6.0, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'sorbonne', name: 'Sorbonne University', country: 'france', city: 'Paris', levels: ['masters', 'phd'], fields: ['Sciences', 'Humanities'], tuitionUsd: 4000, ieltsMin: 6.0, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
  { id: 'polytechnique', name: 'École Polytechnique', country: 'france', city: 'Palaiseau', levels: ['masters'], fields: ['Engineering', 'CS'], tuitionUsd: 14000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: false, selectivity: 'ambitious' },
  { id: 'delft', name: 'TU Delft', country: 'netherlands', city: 'Delft', levels: ['masters'], fields: ['Engineering', 'CS'], tuitionUsd: 18000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'ambitious' },
  { id: 'amsterdam', name: 'University of Amsterdam', country: 'netherlands', city: 'Amsterdam', levels: ['undergraduate', 'masters'], fields: ['Business', 'CS', 'Social Sciences'], tuitionUsd: 14000, ieltsMin: 6.5, greOptional: true, scholarshipLikely: true, selectivity: 'target' },
];

export const SAMPLE_SCHOLARSHIPS: Array<{
  id: string;
  name: string;
  country: DestinationKey | 'multi';
  type: 'merit' | 'need' | 'university' | 'government';
  level: UniLevel | 'any';
  amountHint: string;
  eligibility: string;
}> = [
  { id: 'fulbright', name: 'Fulbright-Nehru (indicative)', country: 'usa', type: 'government', level: 'any', amountHint: 'Full / substantial', eligibility: 'Strong academics + leadership; competitive' },
  { id: 'chevening', name: 'Chevening (indicative)', country: 'uk', type: 'government', level: 'masters', amountHint: 'Full tuition + stipend', eligibility: 'Leadership + 2+ years work experience typical' },
  { id: 'commonwealth', name: 'Commonwealth Scholarships (indicative)', country: 'uk', type: 'government', level: 'masters', amountHint: 'Full / substantial', eligibility: 'Academic merit + development impact' },
  { id: 'vanier', name: 'Vanier-like doctoral awards (indicative)', country: 'canada', type: 'government', level: 'phd', amountHint: 'High stipend', eligibility: 'Research excellence' },
  { id: 'australia-awards', name: 'Australia Awards (indicative)', country: 'australia', type: 'government', level: 'any', amountHint: 'Full / substantial', eligibility: 'Country-specific eligibility windows' },
  { id: 'daad', name: 'DAAD scholarships (indicative)', country: 'germany', type: 'government', level: 'masters', amountHint: 'Stipend + support', eligibility: 'Academic merit; program-specific' },
  { id: 'govt-ireland', name: 'Government of Ireland (indicative)', country: 'ireland', type: 'government', level: 'masters', amountHint: 'Tuition contribution', eligibility: 'Merit-based calls' },
  { id: 'uni-merit-usa', name: 'University merit awards (USA)', country: 'usa', type: 'university', level: 'any', amountHint: '$5k–$25k+/yr', eligibility: 'GPA + profile; early applications help' },
  { id: 'uni-merit-uk', name: 'University merit awards (UK)', country: 'uk', type: 'university', level: 'any', amountHint: '£2k–£10k+', eligibility: 'Offer holders; course-specific' },
  { id: 'uni-merit-can', name: 'Entrance scholarships (Canada)', country: 'canada', type: 'university', level: 'undergraduate', amountHint: 'CAD 1k–20k+', eligibility: 'High school / transfer GPA' },
  { id: 'stem-diversity', name: 'STEM diversity & women-in-tech (multi)', country: 'multi', type: 'merit', level: 'masters', amountHint: 'Varies', eligibility: 'STEM majors; essay + recommendations' },
  { id: 'need-based', name: 'Need-aware institutional aid', country: 'multi', type: 'need', level: 'any', amountHint: 'Partial tuition', eligibility: 'Financial docs + timely forms' },
];

export const CAREER_PATHS: Array<{
  id: string;
  title: string;
  courses: string[];
  countries: DestinationKey[];
  outlook: string;
}> = [
  { id: 'cs', title: 'Computer Science / Software', courses: ['MS CS', 'MS Software Engineering', 'MEng Computing'], countries: ['usa', 'canada', 'uk', 'germany', 'netherlands'], outlook: 'Strong hiring in product & services; portfolio matters.' },
  { id: 'data', title: 'Data / AI', courses: ['MS Data Science', 'MS AI', 'MSc Business Analytics'], countries: ['usa', 'uk', 'canada', 'ireland', 'germany'], outlook: 'High demand; math + projects differentiate.' },
  { id: 'eng', title: 'Engineering', courses: ['MS Mechanical', 'MS Electrical', 'MEng Civil'], countries: ['usa', 'germany', 'australia', 'canada', 'uk'], outlook: 'Industry-linked programs and co-ops help ROI.' },
  { id: 'business', title: 'Business / Management', courses: ['MBA', 'MSc Management', 'MSc Finance'], countries: ['usa', 'uk', 'france', 'australia', 'canada'], outlook: 'Work experience boosts MBA outcomes.' },
  { id: 'design', title: 'Design / UX', courses: ['MDes', 'MA Interaction Design', 'MSc HCI'], countries: ['usa', 'uk', 'netherlands', 'australia'], outlook: 'Portfolio-first admissions.' },
  { id: 'health', title: 'Public Health / Life Sciences', courses: ['MPH', 'MSc Biotechnology', 'MSc Epidemiology'], countries: ['usa', 'uk', 'australia', 'new-zealand', 'canada'], outlook: 'Research fit and labs matter for PhD tracks.' },
  { id: 'hospitality', title: 'Hospitality / Tourism', courses: ['MSc Hospitality', 'MBA Tourism'], countries: ['france', 'australia', 'uk', 'netherlands'], outlook: 'Switzerland often preferred; AU/UK/FR also strong.' },
];

export const HUB_CHANNELS = [
  { id: 'usa', title: 'USA community', blurb: 'Intakes, SOP tips, visa timelines, and alumni AMAs.' },
  { id: 'uk', title: 'UK community', blurb: 'UCAS/CAS notes, scholarships, and city living threads.' },
  { id: 'canada', title: 'Canada community', blurb: 'College vs university, PGWP chatter, and co-op stories.' },
  { id: 'test-prep', title: 'Test-prep lounge', blurb: 'IELTS, TOEFL, GRE, GMAT, PTE, DET, and German drills.' },
  { id: 'scholarships', title: 'Scholarship alerts', blurb: 'Weekly calls, deadlines, and essay critique swaps.' },
  { id: 'pre-departure', title: 'Pre-departure', blurb: 'Housing, forex, packing, and airport meetups.' },
] as const;

export const HUB_EVENTS = [
  { title: 'USA Fall intake workshop', when: 'Weekly · online', tag: 'Admissions' },
  { title: 'IELTS speaking clinic', when: 'Twice weekly', tag: 'Test prep' },
  { title: 'Scholarship essay lab', when: 'Saturdays', tag: 'Funding' },
  { title: 'Visa mock interviews', when: 'By cohort', tag: 'Visa' },
  { title: 'ORI6IN Fly orientation', when: 'Pre-departure weeks', tag: 'Fly' },
] as const;
