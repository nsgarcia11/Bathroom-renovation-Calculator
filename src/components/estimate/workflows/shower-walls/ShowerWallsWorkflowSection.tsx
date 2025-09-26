import React from 'react';
import { ShowerWallsSection } from './design/ShowerWallsSection';
import ShowerWallsLaborSection from './labor/ShowerWallsLaborSection';
import ShowerWallsMaterialsSection from './materials/ShowerWallsMaterialsSection';

interface ShowerWallsWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
}

export default function ShowerWallsWorkflowSection({
  activeSection,
}: ShowerWallsWorkflowSectionProps) {
  if (activeSection === 'design') {
    return <ShowerWallsSection />;
  }

  if (activeSection === 'labor') {
    return <ShowerWallsLaborSection />;
  }

  if (activeSection === 'materials') {
    return <ShowerWallsMaterialsSection />;
  }

  return null;
}
