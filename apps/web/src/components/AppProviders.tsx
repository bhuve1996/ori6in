'use client';

import { MotionConfig } from 'motion/react';
import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { useMounted } from '../hooks/useMounted';
import { ToastProvider } from './Toast';

const OwlAssistant = dynamic(() =>
  import('./OwlAssistant').then((m) => m.OwlAssistant),
);

function OwlAssistantGate() {
  const mounted = useMounted();
  if (!mounted) return null;
  return <OwlAssistant />;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        {children}
        <OwlAssistantGate />
      </ToastProvider>
    </MotionConfig>
  );
}
