import React from 'react';
import { FinishingsSection } from './design/FinishingsSection';
import { useEstimateWorkflow } from '@/hooks/useEstimateWorkflow';
import { WorkflowData } from '@/types/estimate';

interface FinishingsWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
  contractorHourlyRate?: number;
  onDataChange?: (data: WorkflowData) => void;
  initialData?: WorkflowData;
}

export default function FinishingsWorkflowSection({
  activeSection,
  contractorHourlyRate,
  onDataChange,
  initialData,
}: FinishingsWorkflowSectionProps) {
  const { workflow, actions } = useEstimateWorkflow(initialData);

  // Notify parent of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(workflow);
    }
  }, [workflow, onDataChange]);

  if (activeSection === 'design') {
    return (
      <FinishingsSection
        finishingsData={workflow.design || {}}
        setFinishingsData={(design) => actions.updateDesign(design)}
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
      <div className='p-6 text-center text-slate-500'>
        <h3 className='text-lg font-semibold mb-2'>Finishings Labor</h3>
        <p>Labor section for finishings workflow - to be implemented</p>
      </div>
    );
  }

  if (activeSection === 'materials') {
    return (
      <div className='p-6 text-center text-slate-500'>
        <h3 className='text-lg font-semibold mb-2'>Finishings Materials</h3>
        <p>Materials section for finishings workflow - to be implemented</p>
      </div>
    );
  }

  return null;
}
