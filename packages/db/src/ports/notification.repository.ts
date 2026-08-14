export interface NotificationRecord {
  id: string;
  userId: string;
  channel: 'email' | 'in_app' | 'sms' | 'whatsapp' | 'push';
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

export interface NotificationRepository {
  create(
    input: Omit<NotificationRecord, 'id' | 'createdAt' | 'read'>,
  ): Promise<NotificationRecord>;
  findById(id: string): Promise<NotificationRecord | null>;
  listForUser(userId: string): Promise<NotificationRecord[]>;
  countUnread(userId: string): Promise<number>;
  markRead(id: string): Promise<void>;
  markAllReadForUser(userId: string): Promise<number>;
}
