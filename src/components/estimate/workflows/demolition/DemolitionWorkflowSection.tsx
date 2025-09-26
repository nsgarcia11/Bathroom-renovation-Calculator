import React from 'react';
import { DemolitionSection } from './design/DemolitionSection';
import DemolitionLaborSection from './labor/DemolitionLaborSection';
import DemolitionMaterialsSection from './materials/DemolitionMaterialsSection';

interface DemolitionWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
  contractorHourlyRate?: number;
}

export default function DemolitionWorkflowSection({
  activeSection,
  contractorHourlyRate,
}: DemolitionWorkflowSectionProps) {
  // Note: All sections now manage their own context updates

  if (activeSection === 'design') {
    return <DemolitionSection />;
  }

  if (activeSection === 'labor') {
    return (
      <DemolitionLaborSection contractorHourlyRate={contractorHourlyRate} />
    );
  }

  if (activeSection === 'materials') {
    return <DemolitionMaterialsSection />;
  }

  return null;
}
