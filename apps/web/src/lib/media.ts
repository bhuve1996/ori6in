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
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'OR';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function programImage(slug: string) {
  const known: Record<string, string> = {
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
