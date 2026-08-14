import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AppConfig } from '@ori6in/config';
import type { Repositories } from '@ori6in/db';
import {
  checkoutSchema,
  completePaymentSchema,
  createPaymentSchema,
  DEMO_COUPON_CODE,
  DEMO_COUPON_PERCENT,
} from '@ori6in/shared';
import { APP_CONFIG, REPOSITORIES } from '../../common/database.service';

@Injectable()
export class CommerceService {
  constructor(
    @Inject(REPOSITORIES) private readonly repos: Repositories,
    @Inject(APP_CONFIG) private readonly config: AppConfig,
  ) {}

  async catalog() {
    const programs = await this.repos.programs.listPublished(true);
    return programs.map((p) => ({
      programId: p.id,
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      priceCents: p.priceCents,
      currency: p.currency,
    }));
  }

  async checkout(userId: string, body: unknown) {
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const program = await this.repos.programs.findById(parsed.data.programId);
    if (!program || !program.published || !program.isOwnProduct) {
      throw new NotFoundException('Program not available for purchase');
    }

    const already = await this.repos.orders.findPaidByUserProgram(userId, program.id);
    if (already) {
      throw new BadRequestException(`Already purchased (order ${already.id})`);
    }

    let amountCents = program.priceCents;
    let couponCode: string | null = null;
    const rawCoupon = parsed.data.couponCode?.toUpperCase();
    if (rawCoupon) {
      if (rawCoupon !== DEMO_COUPON_CODE) {
        throw new BadRequestException('Invalid coupon code');
      }
      couponCode = DEMO_COUPON_CODE;
      amountCents = Math.round(amountCents * (1 - DEMO_COUPON_PERCENT / 100));
    }

    const order = await this.repos.orders.create({
      userId,
      programId: program.id,
      programTitle: program.title,
      amountCents,
      currency: program.currency,
      couponCode,
      status: 'pending_payment',
    });

    await this.repos.audit.append({
      actorId: userId,
      action: 'commerce.checkout',
      resourceType: 'order',
      resourceId: order.id,
      metadata: { programId: program.id, amountCents, couponCode },
    });

    return {
      order,
      next: 'POST /payments/create',
    };
  }

  async createPayment(userId: string, body: unknown) {
    const parsed = createPaymentSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const order = await this.repos.orders.findById(parsed.data.orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();
    if (order.status === 'paid') {
      throw new BadRequestException('Order already paid');
    }

    const existing = await this.repos.payments.findByOrderId(order.id);
    if (existing && existing.status === 'created') {
      return {
        payment: existing,
        order,
        mockComplete: 'POST /payments/mock-complete',
      };
    }

    const provider = this.config.PAYMENT_PROVIDER;
    const payment = await this.repos.payments.create({
      orderId: order.id,
      userId,
      amountCents: order.amountCents,
      currency: order.currency,
      provider,
      providerRef: `mock_${provider}_${Date.now()}`,
      status: 'created',
    });

    await this.repos.orders.update(order.id, {
      paymentId: payment.id,
      status: 'pending_payment',
    });

    await this.repos.audit.append({
      actorId: userId,
      action: 'commerce.payment_create',
      resourceType: 'payment',
      resourceId: payment.id,
      metadata: { orderId: order.id, provider },
    });

    return {
      payment,
      order: await this.repos.orders.findById(order.id),
      mockComplete: 'POST /payments/mock-complete',
      note: 'Sandbox: call mock-complete to mark paid. Real Razorpay/Stripe adapters come later.',
    };
  }

  async mockComplete(userId: string, body: unknown) {
    const parsed = completePaymentSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    const payment = await this.repos.payments.findById(parsed.data.paymentId);
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.userId !== userId) throw new ForbiddenException();

    if (payment.status === 'paid') {
      const order = await this.repos.orders.findById(payment.orderId);
      return { payment, order };
    }

    const paidPayment = await this.repos.payments.update(payment.id, { status: 'paid' });
    const order = await this.repos.orders.update(payment.orderId, {
      status: 'paid',
      paymentId: payment.id,
    });

    await this.repos.notifications.create({
      userId,
      channel: 'in_app',
      title: 'Purchase confirmed',
      body: `You now have access to ${order.programTitle}.`,
    });

    await this.repos.audit.append({
      actorId: userId,
      action: 'commerce.payment_paid',
      resourceType: 'order',
      resourceId: order.id,
      metadata: { paymentId: payment.id, mock: true },
    });

    return { payment: paidPayment, order };
  }

  async listOrders(userId: string) {
    return this.repos.orders.listByUser(userId);
  }

  async getOrder(userId: string, orderId: string) {
    const order = await this.repos.orders.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();
    const payment = order.paymentId
      ? await this.repos.payments.findById(order.paymentId)
      : await this.repos.payments.findByOrderId(order.id);
    return { order, payment };
  }
}
