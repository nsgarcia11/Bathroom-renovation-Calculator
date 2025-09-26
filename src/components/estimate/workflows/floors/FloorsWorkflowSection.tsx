import React from 'react';
import { FloorsSection } from './design/FloorsSection';
import FloorsLaborSection from './labor/FloorsLaborSection';
import FloorsMaterialsSection from './materials/FloorsMaterialsSection';

interface FloorsWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
}

export default function FloorsWorkflowSection({
  activeSection,
}: FloorsWorkflowSectionProps) {
  if (activeSection === 'design') {
    return <FloorsSection />;
  }

  if (activeSection === 'labor') {
    return <FloorsLaborSection />;
  }

  if (activeSection === 'materials') {
    return <FloorsMaterialsSection />;
  }

  return null;
}
