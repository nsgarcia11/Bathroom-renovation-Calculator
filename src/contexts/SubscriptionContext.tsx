'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import {
  useSubscription,
  useSubscriptionLimits,
  useRecordPdfExport,
  SubscriptionLimits,
} from '@/hooks/use-subscription';
import { useProjects } from '@/hooks/use-projects';
import { Subscription } from '@/types';

interface SubscriptionContextType {
  subscription: Subscription | null;
  limits: SubscriptionLimits;
  recordPdfExport: (projectId: string) => Promise<void>;
  isRecordingExport: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { data: subscription } = useSubscription();
  const { data: projects } = useProjects();
  const projectCount = projects?.length || 0;
  const limits = useSubscriptionLimits(projectCount);
  const recordExportMutation = useRecordPdfExport();

  const recordPdfExport = async (projectId: string) => {
    await recordExportMutation.mutateAsync(projectId);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription: subscription || null,
        limits,
        recordPdfExport,
        isRecordingExport: recordExportMutation.isPending,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );
  }
  return context;
}
