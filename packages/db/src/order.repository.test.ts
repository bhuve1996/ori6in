import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Role } from '@ori6in/shared';
import { createMemoryRepositories } from './memory/index.js';

describe('OrderRepository (memory adapter)', () => {
  it('creates and lists paid orders for a user', async () => {
    const repos = createMemoryRepositories();
    const user = await repos.users.create({
      email: 'buyer@ori6in.test',
      fullName: 'Buyer',
      role: Role.Student,
      passwordHash: 'hash',
    });
    const program = await repos.programs.create({
      title: 'Test Program',
      slug: 'test-program',
      summary: 'Summary',
      description: 'Description',
      priceCents: 10000,
      currency: 'INR',
      isOwnProduct: true,
      published: true,
    });

    const order = await repos.orders.create({
      userId: user.id,
      programId: program.id,
      programTitle: program.title,
      amountCents: 9000,
      currency: 'INR',
      couponCode: 'ORI6IN10',
      status: 'pending_payment',
    });

    await repos.orders.update(order.id, { status: 'paid' });
    const paid = await repos.orders.findPaidByUserProgram(user.id, program.id);
    assert.equal(paid?.id, order.id);
    const list = await repos.orders.listByUser(user.id);
    assert.equal(list.length, 1);
  });
});
