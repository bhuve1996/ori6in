'use client';

import type { ReactNode } from 'react';
import { OwlAssistant } from './OwlAssistant';
import { ToastProvider } from './Toast';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <OwlAssistant />
    </ToastProvider>
  );
}
