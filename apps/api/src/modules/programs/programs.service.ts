import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Repositories } from '@ori6in/db';
import { programUpdateSchema, programUpsertSchema } from '@ori6in/shared';
import { REPOSITORIES } from '../../common/database.service';

@Injectable()
export class ProgramsService {
  constructor(@Inject(REPOSITORIES) private readonly repos: Repositories) {}

  /** Phase 1 public catalog: ORI6IN own published programs only. */
  listPublishedOwn() {
    return this.repos.programs.listPublished(true);
  }

  async getPublishedBySlug(slug: string) {
    const program = await this.repos.programs.findBySlug(slug);
    if (!program || !program.published || !program.isOwnProduct) {
      throw new NotFoundException('Program not found');
    }
    return program;
  }

  listAllOwn() {
    return this.repos.programs.listAll(true);
  }

  async create(body: unknown, actorId?: string) {
    const parsed = programUpsertSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const existing = await this.repos.programs.findBySlug(parsed.data.slug);
    if (existing) throw new BadRequestException('Slug already in use');

    const program = await this.repos.programs.create({
      ...parsed.data,
      isOwnProduct: true,
    });

    if (actorId) {
      await this.repos.audit.append({
        actorId,
        action: 'programs.create',
        resourceType: 'program',
        resourceId: program.id,
        metadata: { slug: program.slug, published: program.published },
      });
    }
    return program;
  }

  async update(id: string, body: unknown, actorId?: string) {
    const parsed = programUpdateSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const existing = await this.repos.programs.findById(id);
    if (!existing) throw new NotFoundException('Program not found');

    if (parsed.data.slug && parsed.data.slug !== existing.slug) {
      const clash = await this.repos.programs.findBySlug(parsed.data.slug);
      if (clash) throw new BadRequestException('Slug already in use');
    }

    const program = await this.repos.programs.update(id, {
      ...parsed.data,
      isOwnProduct: true,
    });

    if (actorId) {
      await this.repos.audit.append({
        actorId,
        action: 'programs.update',
        resourceType: 'program',
        resourceId: program.id,
        metadata: { slug: program.slug, published: program.published },
      });
    }
    return program;
  }
}
