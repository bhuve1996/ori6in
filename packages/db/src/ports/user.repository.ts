import type { CreateUserInput, User, UserId } from '@ori6in/shared';

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: UserId, patch: Partial<User>): Promise<User>;
  count(): Promise<number>;
  list(params?: { role?: string; page?: number; pageSize?: number }): Promise<{
    items: User[];
    total: number;
  }>;
}
