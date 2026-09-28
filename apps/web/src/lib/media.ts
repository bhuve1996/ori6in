/** Dedicated demo mentor faces — keyed by fullName from DEMO_MENTORS */
const DEMO_MENTOR_FACES: Record<string, string> = {
  'Demo Mentor': '/avatars/mentors/demo-mentor.jpg',
  'Priya Sharma': '/avatars/mentors/priya-sharma.jpg',
  'Arjun Mehta': '/avatars/mentors/arjun-mehta.jpg',
  'Nisha Kapoor': '/avatars/mentors/nisha-kapoor.jpg',
  'Rahul Desai': '/avatars/mentors/rahul-desai.jpg',
  'Meera Iyer': '/avatars/mentors/meera-iyer.jpg',
};

const DEMO_PERSON_FACES: Record<string, string> = {
  'Demo Student': '/avatars/students/01.jpg',
  You: '/avatars/students/02.jpg',
};

const MENTOR_AVATARS = [
  '/avatars/mentors/demo-mentor.jpg',
  '/avatars/mentors/priya-sharma.jpg',
  '/avatars/mentors/arjun-mehta.jpg',
  '/avatars/mentors/nisha-kapoor.jpg',
  '/avatars/mentors/rahul-desai.jpg',
  '/avatars/mentors/meera-iyer.jpg',
] as const;

const STUDENT_AVATARS = [
  '/avatars/students/01.jpg',
  '/avatars/students/02.jpg',
  '/avatars/students/03.jpg',
  '/avatars/students/04.jpg',
  '/avatars/students/05.jpg',
  '/avatars/students/06.jpg',
] as const;

function hashSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

function lookupFace(seed: string) {
  const key = seed.trim();
  return (
    DEMO_MENTOR_FACES[key] ??
    DEMO_PERSON_FACES[key] ??
    Object.entries(DEMO_MENTOR_FACES).find(
      ([name]) => name.toLowerCase() === key.toLowerCase(),
    )?.[1]
  );
}

export function avatarFor(
  seed: string,
  kind: 'mentor' | 'student' | 'person' = 'person',
  preferredName?: string,
) {
  const dedicated = lookupFace(preferredName || '') || lookupFace(seed);
  if (dedicated) return dedicated;

  const pool = kind === 'mentor' ? MENTOR_AVATARS : STUDENT_AVATARS;
  return pool[hashSeed(seed || 'ori6in') % pool.length];
}

export function initialsFor(name: string) {
  const parts = name
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-zA-Z0-9\s'-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'OR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function programImage(slug: string) {
  const known: Record<string, string> = {
    'ori6in-360': '/programs/career-launchpad.jpg',
    'ori6in-premier': '/programs/leadership.jpg',
    'ori6in-advantage': '/programs/learning.jpg',
    'ori6in-essential': '/programs/career.jpg',
    'ori6in-apply': '/programs/startup.jpg',
    'ori6in-career-compass': '/programs/career.jpg',
    'ori6in-finance': '/programs/finance.jpg',
    'usa-masters-admissions': '/programs/startup.jpg',
    'usa-undergraduate-admissions': '/programs/career.jpg',
    'usa-mba-admissions': '/programs/leadership.jpg',
    'usa-phd-admissions': '/programs/tech.jpg',
    'usa-stem-admissions': '/programs/tech.jpg',
    'uk-masters-admissions': '/programs/learning.jpg',
    'uk-undergraduate-admissions': '/programs/career.jpg',
    'canada-masters-admissions': '/programs/startup.jpg',
    'canada-undergraduate-admissions': '/programs/career.jpg',
    'australia-masters-admissions': '/programs/leadership.jpg',
    'australia-undergraduate-admissions': '/programs/learning.jpg',
    'germany-masters-admissions': '/programs/ai-foundations.jpg',
    'germany-bachelors-admissions': '/programs/ai-foundations.jpg',
    'ireland-admissions': '/programs/learning.jpg',
    'new-zealand-admissions': '/programs/default.jpg',
    'japan-admissions': '/programs/tech.jpg',
    'europe-admissions': '/programs/leadership.jpg',
    'ori6in-ielts': '/programs/learning.jpg',
    'ori6in-toefl': '/programs/learning.jpg',
    'ori6in-pte': '/programs/learning.jpg',
    'ori6in-det': '/programs/learning.jpg',
    'ori6in-gre': '/programs/tech.jpg',
    'ori6in-gmat': '/programs/tech.jpg',
    'ori6in-sat': '/programs/career.jpg',
    'ori6in-german': '/programs/ai-foundations.jpg',
    'ori6in-profile-builder': '/programs/startup.jpg',
    'ori6in-scholarship-assist': '/programs/finance.jpg',
    'ori6in-visa-assist': '/programs/leadership.jpg',
    'ori6in-fly': '/programs/default.jpg',
    'combo-gre-usa': '/programs/tech.jpg',
    'combo-gmat-usa': '/programs/leadership.jpg',
    'combo-ielts-abroad': '/programs/learning.jpg',
    'combo-toefl-usa': '/programs/startup.jpg',
    'combo-sat-usa-ug': '/programs/career.jpg',
    'combo-german-germany': '/programs/ai-foundations.jpg',
    'career-launchpad': '/programs/career-launchpad.jpg',
    'ai-foundations': '/programs/ai-foundations.jpg',
  };
  return known[slug] ?? '/programs/default.jpg';
}

export const BRAND = {
  /** Raster wordmark (light surfaces) */
  logo: '/brand/logo.png',
  /** Crisp vector wordmark for light surfaces */
  logoSvg: '/brand/logo.svg',
  /** Cream + gold vector wordmark for dark header / hero surfaces */
  logoDark: '/brand/logo-dark.svg',
  /** Pixel-matched dark raster (same art as logo.png, remapped) */
  logoDarkPng: '/brand/logo-dark.png',
  owl: '/brand/owl.png',
  owlFull: '/brand/owl-mascot.png',
  owlIcon: '/brand/owl-icon.png',
  introVideo: '/brand/owl-intro.mp4',
  tagline: 'Everything starts here.',
} as const;

export const BANNERS = {
  programs: '/banners/programs.jpg',
  mentors: '/banners/mentors.jpg',
  blog: '/banners/blog.jpg',
  about: '/banners/about.jpg',
  howItWorks: '/banners/how-it-works.jpg',
  pricing: '/banners/pricing.jpg',
  auth: '/banners/auth.jpg',
  student: '/banners/student.jpg',
  mentorPortal: '/banners/mentor-portal.jpg',
  admin: '/banners/admin.jpg',
  internships: '/banners/internships.jpg',
  companies: '/banners/companies.jpg',
  parents: '/banners/parents.jpg',
} as const;

export const HOME = {
  hero: '/home/hero.jpg',
  mentors: '/home/mentors.jpg',
  internships: '/home/internships.jpg',
  pathPrograms: '/home/path-programs.jpg',
  pathMentors: '/home/path-mentors.jpg',
  pathInternships: '/home/path-internships.jpg',
  outcomesPortfolio: '/home/outcomes-portfolio.jpg',
  outcomesFeedback: '/home/outcomes-feedback.jpg',
  outcomesReady: '/home/outcomes-ready.jpg',
} as const;

/** Campus / atmosphere thumbs for University Finder cards (illustrative — not official logos). */
const UNI_CAMPUS_BY_COUNTRY: Record<string, readonly string[]> = {
  usa: ['/programs/startup.jpg', '/programs/tech.jpg', '/home/path-programs.jpg', '/banners/programs.jpg'],
  uk: ['/programs/learning.jpg', '/programs/leadership.jpg', '/home/outcomes-portfolio.jpg'],
  canada: ['/programs/career.jpg', '/programs/startup.jpg', '/banners/how-it-works.jpg'],
  australia: ['/programs/leadership.jpg', '/programs/default.jpg', '/home/internships.jpg'],
  germany: ['/programs/ai-foundations.jpg', '/programs/tech.jpg', '/home/path-internships.jpg'],
  ireland: ['/programs/learning.jpg', '/banners/about.jpg'],
  'new-zealand': ['/programs/default.jpg', '/home/outcomes-ready.jpg'],
  japan: ['/programs/tech.jpg', '/programs/ai-foundations.jpg'],
  france: ['/programs/leadership.jpg', '/banners/blog.jpg'],
  netherlands: ['/programs/startup.jpg', '/home/path-mentors.jpg'],
};

const UNI_CAMPUS_FALLBACK = [
  '/programs/career-launchpad.jpg',
  '/programs/learning.jpg',
  '/programs/career.jpg',
  '/banners/programs.jpg',
  '/home/path-programs.jpg',
] as const;

export function universityCampusImage(id: string, country?: string) {
  const pool = (country && UNI_CAMPUS_BY_COUNTRY[country]) || UNI_CAMPUS_FALLBACK;
  return pool[hashSeed(id) % pool.length];
}

/** Visual thumbs for Scholarship Finder — by funding type, not official award logos. */
export function scholarshipLeadImage(type: string, id: string) {
  const byType: Record<string, readonly string[]> = {
    government: ['/banners/about.jpg', '/programs/leadership.jpg', '/home/outcomes-ready.jpg'],
    university: ['/programs/learning.jpg', '/banners/programs.jpg', '/home/path-programs.jpg'],
    merit: ['/programs/career-launchpad.jpg', '/programs/tech.jpg', '/home/outcomes-portfolio.jpg'],
    need: ['/programs/finance.jpg', '/banners/pricing.jpg', '/programs/career.jpg'],
  };
  const pool = byType[type] ?? UNI_CAMPUS_FALLBACK;
  return pool[hashSeed(id) % pool.length];
}
