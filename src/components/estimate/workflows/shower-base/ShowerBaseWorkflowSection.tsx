import React from 'react';
import { ShowerBaseSection } from './design/ShowerBaseSection';
import ShowerBaseLaborSection from './labor/ShowerBaseLaborSection';
import ShowerBaseMaterialsSection from './materials/ShowerBaseMaterialsSection';
import { useEstimateWorkflow } from '@/hooks/useEstimateWorkflow';
import { WorkflowData } from '@/types/estimate';

interface ShowerBaseWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
  contractorHourlyRate?: number;
  onDataChange?: (data: WorkflowData) => void;
  initialData?: WorkflowData;
}

export default function ShowerBaseWorkflowSection({
  activeSection,
  contractorHourlyRate,
  onDataChange,
  initialData,
}: ShowerBaseWorkflowSectionProps) {
  const { workflow, actions } = useEstimateWorkflow(initialData);

  // Notify parent of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(workflow);
    }
  }, [workflow, onDataChange]);

  if (activeSection === 'design') {
    return (
      <ShowerBaseSection
        showerBase={workflow.design || {}}
        setShowerBase={(design) => actions.updateDesign(design)}
        contractorNotes={workflow.notes?.contractorNotes || ''}
        setContractorNotes={(notes) =>
          actions.updateNotes({ contractorNotes: notes })
        }
        clientNotes={workflow.notes?.clientNotes || ''}
        setClientNotes={(notes) => actions.updateNotes({ clientNotes: notes })}
      />
    );
  }

  if (activeSection === 'labor') {
    return (
      <ShowerBaseLaborSection
        initialData={workflow}
        contractorHourlyRate={contractorHourlyRate}
        onDataChange={onDataChange}
      />
    );
  }

  if (activeSection === 'materials') {
    return (
      <ShowerBaseMaterialsSection
        initialData={workflow}
        onDataChange={onDataChange}
      />
    );
  }

  return null;
}
