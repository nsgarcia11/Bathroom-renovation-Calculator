import React from 'react';
import { FloorSection } from './design/FloorSection';
import { FloorLaborSection } from './labor/FloorLaborSection';
import { FloorMaterialsSection } from './materials/FloorMaterialsSection';
import { useEstimateWorkflow } from '@/hooks/useEstimateWorkflow';
import { WorkflowData } from '@/types/estimate';

interface FloorWorkflowSectionProps {
  activeSection: 'design' | 'labor' | 'materials';
  contractorHourlyRate?: number;
  onDataChange?: (data: WorkflowData) => void;
  initialData?: WorkflowData;
}

export default function FloorWorkflowSection({
  activeSection,
  contractorHourlyRate,
  onDataChange,
  initialData,
}: FloorWorkflowSectionProps) {
  const { workflow, actions } = useEstimateWorkflow(initialData);

  // Notify parent of data changes
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(workflow);
    }
  }, [workflow, onDataChange]);

  if (activeSection === 'design') {
    return (
      <FloorSection
        floorData={workflow.design || {}}
        setFloorData={(design) => actions.updateDesign(design)}
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
      <FloorLaborSection
        laborItems={workflow.labor?.laborItems || []}
        onAddLaborItem={() => {
          actions.addLaborItem({
            name: 'Custom Labor Task',
            hours: '1',
            rate: contractorHourlyRate?.toString() || '75',
          });
        }}
        onLaborItemChange={(id, field, value) => {
          actions.updateLaborItem(id, field, value);
        }}
        onDeleteLaborItem={(id) => {
          actions.deleteLaborItem(id);
        }}
      />
    );
  }

  if (activeSection === 'materials') {
    return (
      <FloorMaterialsSection
        materialItems={workflow.materials?.items || []}
        onAddMaterialItem={() => {
          actions.addMaterialItem({
            name: 'Custom Material',
            quantity: '1',
            price: '0',
            unit: 'each',
          });
        }}
        onMaterialItemChange={(id, field, value) => {
          actions.updateMaterialItem(id, field, value);
        }}
        onDeleteMaterialItem={(id) => {
          actions.deleteMaterialItem(id);
        }}
      />
    );
  }

  return null;
}
