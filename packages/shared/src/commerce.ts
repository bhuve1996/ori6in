import { z } from 'zod';

export const checkoutSchema = z.object({
  programId: z.string().uuid(),
  couponCode: z.string().trim().min(1).optional(),
});

export const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
});

export const completePaymentSchema = z.object({
  paymentId: z.string().uuid(),
});

export const DEMO_COUPON_CODE = 'ORI6IN10';
export const DEMO_COUPON_PERCENT = 10;

export type CheckoutDto = z.infer<typeof checkoutSchema>;
export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
export type CompletePaymentDto = z.infer<typeof completePaymentSchema>;
