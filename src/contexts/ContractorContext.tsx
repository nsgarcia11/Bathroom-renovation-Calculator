'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useContractor } from '@/hooks/use-contractor';
import { Contractor } from '@/types';

interface ContractorContextType {
  contractor: Contractor | null;
  hourlyRate: number;
  taxRate: number;
  isLoading: boolean;
}

const ContractorContext = createContext<ContractorContextType | undefined>(
  undefined
);

interface ContractorProviderProps {
  children: ReactNode;
}

export function ContractorProvider({ children }: ContractorProviderProps) {
  const { data: contractor, isLoading } = useContractor();

  const hourlyRate = contractor?.hourly_rate || 75;
  const taxRate = contractor?.tax_rate || 0;

  return (
    <ContractorContext.Provider
      value={{
        contractor: contractor || null,
        hourlyRate,
        taxRate,
        isLoading,
      }}
    >
      {children}
    </ContractorContext.Provider>
  );
}

export function useContractorContext() {
  const context = useContext(ContractorContext);
  if (context === undefined) {
    throw new Error(
      'useContractorContext must be used within a ContractorProvider'
    );
  }
  return context;
}
