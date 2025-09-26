'use client';

import { useMemo, useState } from 'react';
import { CollapsibleNotesSection } from './CollapsibleNotesSection';
import { NotesTabs } from './NotesTabs';

interface WorkflowNotesSectionProps {
  contractorNotes: string;
  clientNotes: string;
  onContractorNotesChange: (notes: string) => void;
  onClientNotesChange: (notes: string) => void;
  title?: string;
  placeholder?: string;
  helpers?: string[];
  contractorTags?: string[];
  clientTags?: string[];
  useTabs?: boolean;
  alwaysExpanded?: boolean;
}

export function WorkflowNotesSection({
  contractorNotes,
  clientNotes,
  onContractorNotesChange,
  onClientNotesChange,
  title = 'Notes',
  placeholder = 'Add any project-specific notes here...',
  helpers = [],
  contractorTags = [],
  clientTags = [],
  useTabs = true,
  alwaysExpanded = false,
}: WorkflowNotesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);

  const hasContractorNotes = useMemo(
    () => contractorNotes.trim().length > 0,
    [contractorNotes]
  );
  const hasClientNotes = useMemo(
    () => clientNotes.trim().length > 0,
    [clientNotes]
  );

  if (useTabs) {
    return (
      <div className={alwaysExpanded ? '' : 'border-t border-slate-200 pt-4'}>
        {!alwaysExpanded && (
          <div
            className='flex justify-between items-center cursor-pointer'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <h3 className='text-blue-700 font-bold text-lg'>{title}</h3>
          </div>
        )}
        {(isExpanded || alwaysExpanded) && (
          <div className={alwaysExpanded ? '' : 'mt-4'}>
            <NotesTabs
              contractorNotes={contractorNotes}
              clientNotes={clientNotes}
              hasContractorNotes={hasContractorNotes}
              hasClientNotes={hasClientNotes}
              onContractorNotesChange={onContractorNotesChange}
              onClientNotesChange={onClientNotesChange}
              contractorTags={contractorTags}
              clientTags={clientTags}
              readOnly={false}
            />
          </div>
        )}
      </div>
    );
  }

  // Fallback to single notes section for backward compatibility
  return (
    <CollapsibleNotesSection
      title={title}
      value={contractorNotes}
      onChange={onContractorNotesChange}
      placeholder={placeholder}
      helpers={helpers}
    />
  );
}
