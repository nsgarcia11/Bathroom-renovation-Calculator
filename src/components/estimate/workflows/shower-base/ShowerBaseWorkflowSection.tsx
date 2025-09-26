import React from 'react';
import { ShowerBaseSection } from './design/ShowerBaseSection';
import ShowerBaseLaborSection from './labor/ShowerBaseLaborSection';
import ShowerBaseMaterialsSection from './materials/ShowerBaseMaterialsSection';

interface ShowerBaseWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
}

export default function ShowerBaseWorkflowSection({
  activeSection,
}: ShowerBaseWorkflowSectionProps) {
  if (activeSection === 'design') {
    return <ShowerBaseSection />;
  }

  if (activeSection === 'labor') {
    return <ShowerBaseLaborSection />;
  }

  if (activeSection === 'materials') {
    return <ShowerBaseMaterialsSection />;
  }

  return null;
}
