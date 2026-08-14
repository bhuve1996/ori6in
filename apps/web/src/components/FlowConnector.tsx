'use client';

import { memo } from 'react';

type Props = {
  className?: string;
  tone?: 'light' | 'dark';
};

function FlowConnectorInner({ className, tone = 'light' }: Props) {
  const classes = ['flow-connector', tone === 'dark' ? 'flow-connector--dark' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} aria-hidden="true">
      <span className="flow-connector__track" />
    </span>
  );
}

export const FlowConnector = memo(FlowConnectorInner);
