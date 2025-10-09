'use client';

import React from 'react';
import { TradeSection } from './design/TradeSection';
import TradeLaborSection from './labor/TradeLaborSection';
import TradeMaterialsSection from './materials/TradeMaterialsSection';

interface TradeWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
}

export default function TradeWorkflowSection({
  activeSection,
}: TradeWorkflowSectionProps) {
  if (activeSection === 'design') {
    return <TradeSection />;
  }

  if (activeSection === 'labor') {
    return <TradeLaborSection />;
  }

  if (activeSection === 'materials') {
    return <TradeMaterialsSection />;
  }

  return null;
}
