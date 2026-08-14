import { z } from 'zod';
import { Role } from './kernel.js';

export const createCompanySchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  password: z.string().min(8),
});

export const assignMentorSchema = z.object({
  mentorId: z.string().uuid(),
  studentId: z.string().uuid(),
  programId: z.string().uuid(),
});

export const adminUserRoleQuerySchema = z
  .enum([
    Role.Student,
    Role.Mentor,
    Role.Parent,
    Role.Company,
    Role.Admin,
    Role.SuperAdmin,
  ])
  .optional();

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
export type AssignMentorDto = z.infer<typeof assignMentorSchema>;
