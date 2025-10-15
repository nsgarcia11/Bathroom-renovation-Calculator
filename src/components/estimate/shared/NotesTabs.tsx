'use client';

import { useState } from 'react';
import { User, UserCheck } from 'lucide-react';

interface NotesTabsProps {
  contractorNotes: string;
  clientNotes: string;
  hasContractorNotes: boolean;
  hasClientNotes: boolean;
  onContractorNotesChange?: (notes: string) => void;
  onClientNotesChange?: (notes: string) => void;
  contractorTags?: string[];
  clientTags?: string[];
  readOnly?: boolean;
}

export function NotesTabs({
  contractorNotes,
  clientNotes,
  hasContractorNotes,
  hasClientNotes,
  onContractorNotesChange,
  onClientNotesChange,
  contractorTags = [],
  clientTags = [],
  readOnly = false,
}: NotesTabsProps) {
  const [activeTab, setActiveTab] = useState<'contractor' | 'client'>(
    'contractor'
  );

  const handleTagClick = (tag: string, noteType: 'contractor' | 'client') => {
    const currentNotes =
      noteType === 'contractor' ? contractorNotes : clientNotes;
    const onChange =
      noteType === 'contractor' ? onContractorNotesChange : onClientNotesChange;

    if (!onChange) return;

    const noteText = `- ${tag}: `;

    // Check if this tag already exists
    if (currentNotes.includes(noteText)) {
      return; // Don't add if already exists
    }

    const newNotes = currentNotes ? `${currentNotes}\n${noteText}` : noteText;

    onChange(newNotes);
  };

  const tabs = [
    {
      id: 'contractor' as const,
      label: 'Contractor Notes',
      icon: User,
      notes: contractorNotes,
      hasNotes: hasContractorNotes,
      onChange: onContractorNotesChange,
      tags: contractorTags,
    },
    {
      id: 'client' as const,
      label: 'Client Notes',
      icon: UserCheck,
      notes: clientNotes,
      hasNotes: hasClientNotes,
      onChange: onClientNotesChange,
      tags: clientTags,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className='space-y-4'>
      {/* Tab Navigation */}
      <div className='flex space-x-1 bg-slate-100 p-1 rounded-lg'>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon size={16} />
              <div className='flex flex-col'>
                <span>{tab.label}</span>
                <p className='text-[12px] text-slate-500'>
                  {tab.id === 'contractor'
                    ? 'Internal use only'
                    : 'Appears on estimate'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className='min-h-[200px]'>
        {activeTabData && (
          <div className='space-y-4'>
            {/* Notes Display/Editor */}
            <div className='bg-slate-50 rounded-lg p-4'>
              {readOnly ? (
                <div className='space-y-2'>
                  <div className='space-y-1'>
                    <h4 className='text-sm font-medium text-slate-700'>
                      {activeTabData.label}
                    </h4>
                  </div>
                  {activeTabData.notes ? (
                    <pre className='whitespace-pre-wrap text-sm text-slate-700 font-mono leading-relaxed'>
                      {activeTabData.notes}
                    </pre>
                  ) : (
                    <p className='text-sm text-slate-500 italic'>
                      No {activeTabData.label.toLowerCase()} added
                    </p>
                  )}
                </div>
              ) : (
                <div className='space-y-2'>
                  <div className='space-y-1'>
                    <label className='block text-sm font-medium text-slate-700'>
                      {activeTabData.label}
                    </label>
                  </div>
                  <textarea
                    value={activeTabData.notes}
                    onChange={(e) => activeTabData.onChange?.(e.target.value)}
                    placeholder={`Add ${activeTabData.label.toLowerCase()}...`}
                    className='w-full h-32 px-3 py-2 border border-blue-300 rounded-md text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none'
                  />
                  {/* <div className='text-xs text-slate-500'>
                    {activeTabData.notes.length} characters
                  </div> */}

                  {/* Tags Section */}
                  {activeTabData.tags && activeTabData.tags.length > 0 && (
                    <div className='mt-3'>
                      <div className='text-xs font-medium text-slate-600 mb-2'>
                        Quick Add Tags:
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {activeTabData.tags.map((tag) => {
                          const noteText = `- ${tag}: `;
                          const isAlreadyAdded =
                            activeTabData.notes.includes(noteText);

                          return (
                            <button
                              key={tag}
                              onClick={() =>
                                handleTagClick(tag, activeTabData.id)
                              }
                              disabled={isAlreadyAdded || readOnly}
                              className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                                isAlreadyAdded
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : readOnly
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                              }`}
                            >
                              + {tag}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
