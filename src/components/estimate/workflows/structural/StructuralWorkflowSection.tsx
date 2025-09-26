import React from 'react';
import { StructuralSection } from './design/StructuralSection';
import StructuralLaborSection from './labor/StructuralLaborSection';
import StructuralMaterialsSection from './materials/StructuralMaterialsSection';

interface StructuralWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
}

export default function StructuralWorkflowSection({
  activeSection,
}: StructuralWorkflowSectionProps) {
  if (activeSection === 'design') {
    return <StructuralSection />;
  }

  if (activeSection === 'labor') {
    return <StructuralLaborSection />;
  }

  if (activeSection === 'materials') {
    return <StructuralMaterialsSection />;
  }

  return null;
}
