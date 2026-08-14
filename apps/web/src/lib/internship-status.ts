/** Human-readable labels for internship pipeline & decision fields. */

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  under_review: 'Under review',
  interview: 'Interview',
  offered: 'Offer received',
  rejected: 'Not selected',
  withdrawn: 'Withdrawn',
};

export const PARENT_DECISION_LABELS: Record<string, string> = {
  pending: 'Awaiting parent',
  approved: 'Parent approved',
  rejected: 'Parent declined',
};

export const MENTOR_COMPLETION_LABELS: Record<string, string> = {
  pending: 'Awaiting mentor sign-off',
  approved: 'Mentor signed off',
  rejected: 'Mentor declined completion',
};

export const LISTING_APPROVAL_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending admin approval',
  approved: 'Approved',
  rejected: 'Rejected',
};

export function applicationStatusLabel(status: string) {
  return APPLICATION_STATUS_LABELS[status] ?? status;
}

export function parentDecisionLabel(decision: string) {
  return PARENT_DECISION_LABELS[decision] ?? decision;
}

export function mentorCompletionLabel(decision: string) {
  return MENTOR_COMPLETION_LABELS[decision] ?? decision;
}

export function listingApprovalLabel(status: string) {
  return LISTING_APPROVAL_LABELS[status] ?? status;
}

export type TimelineEvent = {
  at: string | Date;
  status: string;
  note?: string;
};

export function formatTimelineEvent(ev: TimelineEvent) {
  const when = new Date(ev.at).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const label = applicationStatusLabel(ev.status);
  return ev.note ? `${when} — ${label}: ${ev.note}` : `${when} — ${label}`;
}
