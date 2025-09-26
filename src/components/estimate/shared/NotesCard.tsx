'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { WorkflowNotesSection } from './WorkflowNotesSection';

/**
 * NotesCard - A reusable card component for adding notes at the end of sections
 *
 * Features:
 * - Collapsible card with expand/collapse functionality
 * - Support for both contractor and client notes with tabs
 * - Customizable tags for quick note addition
 * - Visual indicators for notes presence and character count
 * - Blue border styling to match the application theme
 * - Notes content is always expanded when card is open (no double collapse)
 *
 * Usage:
 * ```tsx
 * <NotesCard
 *   contractorNotes={contractorNotes}
 *   clientNotes={clientNotes}
 *   onContractorNotesChange={setContractorNotes}
 *   onClientNotesChange={setClientNotes}
 *   title="Section Notes"
 *   placeholder="Add section-specific notes..."
 *   contractorTags={['Tag 1', 'Tag 2']}
 *   clientTags={['Client Tag 1', 'Client Tag 2']}
 *   useTabs={true}
 * />
 * ```
 */

interface NotesCardProps {
  contractorNotes: string;
  clientNotes: string;
  onContractorNotesChange: (notes: string) => void;
  onClientNotesChange: (notes: string) => void;
  title?: string;
  placeholder?: string;
  contractorTags?: string[];
  clientTags?: string[];
  useTabs?: boolean;
  className?: string;
}

export function NotesCard({
  contractorNotes,
  clientNotes,
  onContractorNotesChange,
  onClientNotesChange,
  title = 'Notes',
  placeholder = 'Add section-specific notes...',
  contractorTags = [],
  clientTags = [],
  useTabs = true,
  className = '',
}: NotesCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className={`border-blue-300 ${className}`}>
      <div
        className='cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg text-slate-700 flex items-center space-x-2'>
              <span>{title}</span>
            </CardTitle>
            {isExpanded ? (
              <ChevronUp size={20} className='text-blue-600' />
            ) : (
              <ChevronDown size={20} className='text-gray-400' />
            )}
          </div>
        </CardHeader>
      </div>

      {isExpanded && (
        <CardContent className='pt-3 border-t border-slate-200'>
          <WorkflowNotesSection
            contractorNotes={contractorNotes}
            clientNotes={clientNotes}
            onContractorNotesChange={onContractorNotesChange}
            onClientNotesChange={onClientNotesChange}
            title=''
            placeholder={placeholder}
            contractorTags={contractorTags}
            clientTags={clientTags}
            useTabs={useTabs}
            alwaysExpanded={true}
          />
        </CardContent>
      )}
    </Card>
  );
}
