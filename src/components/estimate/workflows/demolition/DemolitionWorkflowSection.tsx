import React from 'react';
import { DemolitionSection } from './design/DemolitionSection';
import DemolitionLaborSection from './labor/DemolitionLaborSection';
import DemolitionMaterialsSection from './materials/DemolitionMaterialsSection';

interface DemolitionWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
}

export default function DemolitionWorkflowSection({
  activeSection,
}: DemolitionWorkflowSectionProps) {
  // Note: All sections now manage their own context updates

  if (activeSection === 'design') {
    return <DemolitionSection />;
  }

  if (activeSection === 'labor') {
    return <DemolitionLaborSection />;
  }

  if (activeSection === 'materials') {
    return <DemolitionMaterialsSection />;
  }

  return null;
}
