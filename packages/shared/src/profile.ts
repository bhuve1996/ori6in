import { z } from 'zod';

const educationSchema = z.object({
  school: z.string().min(1).max(120),
  degree: z.string().max(120).optional(),
  year: z.string().max(20).optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1).max(120),
  title: z.string().min(1).max(120),
  years: z.string().max(40).optional(),
});

const projectSchema = z.object({
  name: z.string().min(1).max(120),
  url: z.string().url().optional().or(z.literal('')),
  summary: z.string().max(500).optional(),
});

export const studentProfileSchema = z.object({
  headline: z.string().max(160).optional().default(''),
  bio: z.string().max(2000).optional().default(''),
  phone: z.string().max(40).optional().default(''),
  location: z.string().max(120).optional().default(''),
  skills: z.array(z.string().min(1).max(40)).max(30).optional().default([]),
  education: z.array(educationSchema).max(20).optional().default([]),
  experience: z.array(experienceSchema).max(20).optional().default([]),
  projects: z.array(projectSchema).max(20).optional().default([]),
});

export type StudentProfileDto = z.infer<typeof studentProfileSchema>;
