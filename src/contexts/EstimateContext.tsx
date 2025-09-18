'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type EstimateSection = 'scope' | 'labor' | 'materials' | 'estimate';
export type ConstructionCategory =
  | 'demolition'
  | 'shower-base'
  | 'shower-walls'
  | 'floors'
  | 'finishings'
  | 'structural'
  | 'trades';

interface EstimateContextType {
  activeSection: EstimateSection;
  setActiveSection: (section: EstimateSection) => void;
  selectedCategory: ConstructionCategory;
  setSelectedCategory: (category: ConstructionCategory) => void;
}

const EstimateContext = createContext<EstimateContextType | undefined>(
  undefined
);

interface EstimateProviderProps {
  children: ReactNode;
}

export function EstimateProvider({ children }: EstimateProviderProps) {
  const [activeSection, setActiveSection] = useState<EstimateSection>('scope');
  const [selectedCategory, setSelectedCategory] =
    useState<ConstructionCategory>('demolition');

  return (
    <EstimateContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </EstimateContext.Provider>
  );
}

export function useEstimate() {
  const context = useContext(EstimateContext);
  if (context === undefined) {
    throw new Error('useEstimate must be used within an EstimateProvider');
  }
  return context;
}
