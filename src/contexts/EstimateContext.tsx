'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

export type EstimateSection = 'design' | 'labor' | 'materials' | 'estimate';
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
  const [activeSection, setActiveSection] = useState<EstimateSection>('design');
  const [selectedCategory, setSelectedCategory] =
    useState<ConstructionCategory>('demolition');

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      activeSection,
      setActiveSection,
      selectedCategory,
      setSelectedCategory,
    }),
    [activeSection, selectedCategory]
  );

  return (
    <EstimateContext.Provider value={contextValue}>
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
