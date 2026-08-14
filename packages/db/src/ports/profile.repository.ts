export interface EducationItem {
  school: string;
  degree?: string;
  year?: string;
}

export interface ExperienceItem {
  company: string;
  title: string;
  years?: string;
}

export interface ProjectItem {
  name: string;
  url?: string;
  summary?: string;
}

export interface StudentProfile {
  userId: string;
  headline: string;
  bio: string;
  phone: string;
  location: string;
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  updatedAt: Date;
}

export interface ProfileRepository {
  getByUserId(userId: string): Promise<StudentProfile | null>;
  upsert(profile: Omit<StudentProfile, 'updatedAt'>): Promise<StudentProfile>;
}
