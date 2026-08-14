export interface AuditEvent {
  id: string;
  actorId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface AuditRepository {
  append(event: Omit<AuditEvent, 'id' | 'createdAt'>): Promise<AuditEvent>;
  listByActor(actorId: string, limit?: number): Promise<AuditEvent[]>;
}
