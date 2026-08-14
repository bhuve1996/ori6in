import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Repositories, StudentProfile } from '@ori6in/db';
import { studentProfileSchema } from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

function emptyProfile(userId: string): StudentProfile {
  return {
    userId,
    headline: '',
    bio: '',
    phone: '',
    location: '',
    skills: [],
    education: [],
    experience: [],
    projects: [],
    updatedAt: new Date(0),
  };
}

@Injectable()
export class ProfileService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  async get(userId: string) {
    const existing = await this.repos.profiles.getByUserId(userId);
    return existing ?? emptyProfile(userId);
  }

  async save(userId: string, body: unknown) {
    const parsed = studentProfileSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const data = parsed.data;
    const projects = data.projects.map((p) => ({
      name: p.name,
      url: p.url || undefined,
      summary: p.summary,
    }));

    return this.repos.profiles.upsert({
      userId,
      headline: data.headline,
      bio: data.bio,
      phone: data.phone,
      location: data.location,
      skills: data.skills,
      education: data.education,
      experience: data.experience,
      projects,
    });
  }
}
