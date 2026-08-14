export enum Role {
  Student = 'student',
  Mentor = 'mentor',
  Parent = 'parent',
  Company = 'company',
  Admin = 'admin',
  SuperAdmin = 'super_admin',
}

export type UserId = string;

export interface User {
  id: UserId;
  email: string;
  passwordHash?: string | null;
  fullName: string;
  role: Role;
  emailVerified: boolean;
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  passwordHash?: string | null;
  fullName: string;
  role: Role;
  googleId?: string | null;
  emailVerified?: boolean;
}

export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export const MVP_ROLES = [Role.Student, Role.Mentor, Role.Admin] as const;
export const PHASE2_ROLES = [Role.Parent, Role.Company] as const;
