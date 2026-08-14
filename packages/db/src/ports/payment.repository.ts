export type PaymentStatus = 'created' | 'paid' | 'failed';

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amountCents: number;
  currency: string;
  provider: string;
  providerRef: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRepository {
  create(
    input: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment | null>;
  update(id: string, patch: Partial<Payment>): Promise<Payment>;
}
