export type OrderStatus = 'pending_payment' | 'paid' | 'failed' | 'cancelled';

export interface Order {
  id: string;
  /** Student (enrollee) the order belongs to. */
  userId: string;
  programId: string;
  programTitle: string;
  amountCents: number;
  currency: string;
  couponCode: string | null;
  status: OrderStatus;
  paymentId: string | null;
  /** Parent (or other payer) who completed sandbox/live payment, if different from userId. */
  paidByUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderRepository {
  create(
    input: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'paymentId' | 'paidByUserId'> & {
      paymentId?: string | null;
      paidByUserId?: string | null;
    },
  ): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  listByUser(userId: string): Promise<Order[]>;
  listPaid(limit?: number): Promise<Order[]>;
  countPaid(): Promise<number>;
  sumPaidAmountCents(): Promise<number>;
  findPaidByUserProgram(userId: string, programId: string): Promise<Order | null>;
  update(id: string, patch: Partial<Order>): Promise<Order>;
}
