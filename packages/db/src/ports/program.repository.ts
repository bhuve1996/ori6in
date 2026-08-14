export interface Program {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  priceCents: number;
  currency: string;
  isOwnProduct: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramRepository {
  findById(id: string): Promise<Program | null>;
  findBySlug(slug: string): Promise<Program | null>;
  listPublished(ownOnly?: boolean): Promise<Program[]>;
  /** Admin catalog: includes drafts. Phase 1 still scopes to own products by default. */
  listAll(ownOnly?: boolean): Promise<Program[]>;
  create(input: Omit<Program, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program>;
  update(id: string, patch: Partial<Program>): Promise<Program>;
}
