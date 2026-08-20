'use client';

import { MotionConfig } from 'motion/react';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useMounted } from '../hooks/useMounted';
import { ToastProvider } from './Toast';

const OwlAssistant = dynamic(() =>
  import('./OwlAssistant').then((m) => m.OwlAssistant),
);

function OwlAssistantGate({ softLaunch }: { softLaunch: boolean }) {
  const mounted = useMounted();
  if (!mounted || softLaunch) return null;
  return <OwlAssistant />;
}

export function AppProviders({
  children,
  softLaunch = false,
}: {
  children: ReactNode;
  softLaunch?: boolean;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        {children}
        <OwlAssistantGate softLaunch={softLaunch} />
      </ToastProvider>
    </MotionConfig>
  );
}
