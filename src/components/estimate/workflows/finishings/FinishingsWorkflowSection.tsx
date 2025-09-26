import React from 'react';
import { FinishingsSection } from './design/FinishingsSection';
import FinishingsLaborSection from './labor/FinishingsLaborSection';
import FinishingsMaterialsSection from './materials/FinishingsMaterialsSection';

interface FinishingsWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
}

export default function FinishingsWorkflowSection({
  activeSection,
}: FinishingsWorkflowSectionProps) {
  if (activeSection === 'design') {
    return <FinishingsSection />;
  }

  if (activeSection === 'labor') {
    return <FinishingsLaborSection />;
  }

  if (activeSection === 'materials') {
    return <FinishingsMaterialsSection />;
  }

  return null;
}
