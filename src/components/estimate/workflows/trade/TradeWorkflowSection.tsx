import React from 'react';
import { TradeSection } from './design/TradeSection';
import TradeLaborSection from './labor/TradeLaborSection';
import TradeMaterialsSection from './materials/TradeMaterialsSection';

interface TradeWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
  contractorHourlyRate?: number;
}

export default function TradeWorkflowSection({
  activeSection,
  contractorHourlyRate = 85,
}: TradeWorkflowSectionProps) {
  if (activeSection === 'design') {
    return <TradeSection />;
  }

  if (activeSection === 'labor') {
    return <TradeLaborSection contractorHourlyRate={contractorHourlyRate} />;
  }

  if (activeSection === 'materials') {
    return <TradeMaterialsSection />;
  }

  return null;
}
