'use client';

import React, { useMemo, useState } from 'react';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import {
  Hammer,
  ShowerHead,
  Layers,
  Paintbrush,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { ShowerBaseIcon } from '@/components/icons/ShowerBaseIcon';
import { StructuralIcon } from '@/components/icons/StructuralIcon';
import { TradeIcon } from '@/components/icons/TradeIcon';

export default function NotesOverview() {
  const { getDesignData, getNotes } = useEstimateWorkflowContext();

  // State for managing collapsed/expanded cards
  const [isClientNotesOpen, setIsClientNotesOpen] = useState(false);
  const [isContractorNotesOpen, setIsContractorNotesOpen] = useState(false);

  // Get demolition notes data (only construction notes)
  const demolitionNotes = useMemo(() => {
    const designData = getDesignData('demolition');
    const notes = getNotes('demolition');

    // Check if demolition has any notes or design data
    const hasNotes =
      (notes?.contractorNotes && notes.contractorNotes.trim()) ||
      (notes?.clientNotes && notes.clientNotes.trim()) ||
      (designData && Object.keys(designData).length > 0);

    if (!hasNotes) return null;

    return {
      id: 'demolition',
      name: 'Demolition',
      icon: <Hammer size={24} />,
      color: 'text-blue-600',
      designNotes: {
        contractorNotes: '',
        clientNotes: '',
      },
      constructionNotes: {
        contractorNotes: notes?.contractorNotes || '',
        clientNotes: notes?.clientNotes || '',
      },
      hasNotes: true,
    };
  }, [getDesignData, getNotes]);

  // Get shower walls notes data
  const showerWallsNotes = useMemo(() => {
    const designData = getDesignData('showerWalls') as {
      walls: unknown[];
      design: {
        designContractorNotes?: string;
        designClientNotes?: string;
        constructionContractorNotes?: string;
        constructionClientNotes?: string;
        [key: string]: unknown;
      };
    } | null;

    // Combine design and construction notes
    const designContractorNotes =
      designData?.design?.designContractorNotes?.trim() || '';
    const designClientNotes =
      designData?.design?.designClientNotes?.trim() || '';
    const constructionContractorNotes =
      designData?.design?.constructionContractorNotes?.trim() || '';
    const constructionClientNotes =
      designData?.design?.constructionClientNotes?.trim() || '';

    // Check if shower walls has any notes or design data
    const hasNotes =
      designContractorNotes ||
      designClientNotes ||
      constructionContractorNotes ||
      constructionClientNotes ||
      (designData && Object.keys(designData).length > 0);

    if (!hasNotes) return null;

    return {
      id: 'showerWalls',
      name: 'Shower Walls',
      icon: <ShowerHead size={24} />,
      color: 'text-blue-600',
      designNotes: {
        contractorNotes: designContractorNotes,
        clientNotes: designClientNotes,
      },
      constructionNotes: {
        contractorNotes: constructionContractorNotes,
        clientNotes: constructionClientNotes,
      },
      hasNotes: true,
    };
  }, [getDesignData]);

  // Get shower base notes data
  const showerBaseNotes = useMemo(() => {
    const designData = getDesignData('showerBase') as {
      designContractorNotes?: string;
      designClientNotes?: string;
      constructionContractorNotes?: string;
      constructionClientNotes?: string;
      [key: string]: unknown;
    } | null;

    // Combine design and construction notes
    const designContractorNotes =
      designData?.designContractorNotes?.trim() || '';
    const designClientNotes = designData?.designClientNotes?.trim() || '';
    const constructionContractorNotes =
      designData?.constructionContractorNotes?.trim() || '';
    const constructionClientNotes =
      designData?.constructionClientNotes?.trim() || '';

    // Check if shower base has any notes or design data
    const hasNotes =
      designContractorNotes ||
      designClientNotes ||
      constructionContractorNotes ||
      constructionClientNotes ||
      (designData && Object.keys(designData).length > 0);

    if (!hasNotes) return null;

    return {
      id: 'showerBase',
      name: 'Shower Base',
      icon: <ShowerBaseIcon size={24} />,
      color: 'text-blue-600',
      designNotes: {
        contractorNotes: designContractorNotes,
        clientNotes: designClientNotes,
      },
      constructionNotes: {
        contractorNotes: constructionContractorNotes,
        clientNotes: constructionClientNotes,
      },
      hasNotes: true,
    };
  }, [getDesignData]);

  // Get floors notes data
  const floorsNotes = useMemo(() => {
    const designData = getDesignData('floors') as {
      designContractorNotes?: string;
      designClientNotes?: string;
      constructionContractorNotes?: string;
      constructionClientNotes?: string;
      [key: string]: unknown;
    } | null;

    // Combine design and construction notes
    const designContractorNotes =
      designData?.designContractorNotes?.trim() || '';
    const designClientNotes = designData?.designClientNotes?.trim() || '';
    const constructionContractorNotes =
      designData?.constructionContractorNotes?.trim() || '';
    const constructionClientNotes =
      designData?.constructionClientNotes?.trim() || '';

    // Check if floors has any notes or design data
    const hasNotes =
      designContractorNotes ||
      designClientNotes ||
      constructionContractorNotes ||
      constructionClientNotes ||
      (designData && Object.keys(designData).length > 0);

    if (!hasNotes) return null;

    return {
      id: 'floors',
      name: 'Floors',
      icon: <Layers size={24} />,
      color: 'text-blue-600',
      designNotes: {
        contractorNotes: designContractorNotes,
        clientNotes: designClientNotes,
      },
      constructionNotes: {
        contractorNotes: constructionContractorNotes,
        clientNotes: constructionClientNotes,
      },
      hasNotes: true,
    };
  }, [getDesignData]);

  // Get finishings notes data
  const finishingsNotes = useMemo(() => {
    const designData = getDesignData('finishings') as {
      designContractorNotes?: string;
      designClientNotes?: string;
      constructionContractorNotes?: string;
      constructionClientNotes?: string;
      [key: string]: unknown;
    } | null;

    // Combine design and construction notes
    const designContractorNotes =
      designData?.designContractorNotes?.trim() || '';
    const designClientNotes = designData?.designClientNotes?.trim() || '';
    const constructionContractorNotes =
      designData?.constructionContractorNotes?.trim() || '';
    const constructionClientNotes =
      designData?.constructionClientNotes?.trim() || '';

    // Check if finishings has any notes or design data
    const hasNotes =
      designContractorNotes ||
      designClientNotes ||
      constructionContractorNotes ||
      constructionClientNotes ||
      (designData && Object.keys(designData).length > 0);

    if (!hasNotes) return null;

    return {
      id: 'finishings',
      name: 'Finishings',
      icon: <Paintbrush size={24} />,
      color: 'text-blue-600',
      designNotes: {
        contractorNotes: designContractorNotes,
        clientNotes: designClientNotes,
      },
      constructionNotes: {
        contractorNotes: constructionContractorNotes,
        clientNotes: constructionClientNotes,
      },
      hasNotes: true,
    };
  }, [getDesignData]);

  // Get structural notes data
  const structuralNotes = useMemo(() => {
    const designData = getDesignData('structural') as {
      designContractorNotes?: string;
      designClientNotes?: string;
      constructionContractorNotes?: string;
      constructionClientNotes?: string;
      choices?: {
        designContractorNotes?: string;
        designClientNotes?: string;
        constructionContractorNotes?: string;
        constructionClientNotes?: string;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    } | null;

    // Access notes from the correct path (either directly or from choices)
    const designContractorNotes =
      designData?.designContractorNotes?.trim() ||
      designData?.choices?.designContractorNotes?.trim() ||
      '';
    const designClientNotes =
      designData?.designClientNotes?.trim() ||
      designData?.choices?.designClientNotes?.trim() ||
      '';
    const constructionContractorNotes =
      designData?.constructionContractorNotes?.trim() ||
      designData?.choices?.constructionContractorNotes?.trim() ||
      '';
    const constructionClientNotes =
      designData?.constructionClientNotes?.trim() ||
      designData?.choices?.constructionClientNotes?.trim() ||
      '';

    // Check if structural has any notes or design data
    const hasNotes =
      designContractorNotes ||
      designClientNotes ||
      constructionContractorNotes ||
      constructionClientNotes ||
      (designData && Object.keys(designData).length > 0);

    if (!hasNotes) return null;

    return {
      id: 'structural',
      name: 'Structural',
      icon: <StructuralIcon size={24} />,
      color: 'text-blue-600',
      designNotes: {
        contractorNotes: designContractorNotes,
        clientNotes: designClientNotes,
      },
      constructionNotes: {
        contractorNotes: constructionContractorNotes,
        clientNotes: constructionClientNotes,
      },
      hasNotes: true,
    };
  }, [getDesignData]);

  // Get trade notes data
  const tradeNotes = useMemo(() => {
    const designData = getDesignData('trade') as {
      designContractorNotes?: string;
      designClientNotes?: string;
      constructionContractorNotes?: string;
      constructionClientNotes?: string;
      [key: string]: unknown;
    } | null;

    // Combine design and construction notes
    const designContractorNotes =
      designData?.designContractorNotes?.trim() || '';
    const designClientNotes = designData?.designClientNotes?.trim() || '';
    const constructionContractorNotes =
      designData?.constructionContractorNotes?.trim() || '';
    const constructionClientNotes =
      designData?.constructionClientNotes?.trim() || '';

    // Check if trade has any notes or design data
    const hasNotes =
      designContractorNotes ||
      designClientNotes ||
      constructionContractorNotes ||
      constructionClientNotes ||
      (designData && Object.keys(designData).length > 0);

    if (!hasNotes) return null;

    return {
      id: 'trade',
      name: 'Trade',
      icon: <TradeIcon size={24} />,
      color: 'text-blue-600',
      designNotes: {
        contractorNotes: designContractorNotes,
        clientNotes: designClientNotes,
      },
      constructionNotes: {
        contractorNotes: constructionContractorNotes,
        clientNotes: constructionClientNotes,
      },
      hasNotes: true,
    };
  }, [getDesignData]);

  // Create workflows array
  const workflows = useMemo(() => {
    const workflowList = [];
    if (demolitionNotes) {
      workflowList.push(demolitionNotes);
    }
    if (showerWallsNotes) {
      workflowList.push(showerWallsNotes);
    }
    if (showerBaseNotes) {
      workflowList.push(showerBaseNotes);
    }
    if (floorsNotes) {
      workflowList.push(floorsNotes);
    }
    if (finishingsNotes) {
      workflowList.push(finishingsNotes);
    }
    if (structuralNotes) {
      workflowList.push(structuralNotes);
    }
    if (tradeNotes) {
      workflowList.push(tradeNotes);
    }

    return workflowList;
  }, [
    demolitionNotes,
    showerWallsNotes,
    showerBaseNotes,
    floorsNotes,
    finishingsNotes,
    structuralNotes,
    tradeNotes,
  ]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
          Project Notes Overview
        </h2>
        <p className='text-gray-600'>
          Complete breakdown of contractor and client notes by workflow
        </p>
      </div>

      {/* Client Notes Card */}
      <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
        <div
          className='bg-blue-600 text-white px-4 py-3 rounded-t-lg cursor-pointer flex items-center justify-between'
          onClick={() => setIsClientNotesOpen(!isClientNotesOpen)}
        >
          <h3 className='text-lg font-semibold'>Client Notes</h3>
          {isClientNotesOpen ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </div>

        {isClientNotesOpen && (
          <div className='p-4 space-y-4'>
            {/* Construction Notes Section */}
            <div className='space-y-3'>
              <h4 className='text-md font-semibold text-gray-800 border-b border-gray-300 pb-2'>
                Construction Notes
              </h4>
              {workflows.map((workflow) => {
                const constructionClientNotes =
                  workflow.constructionNotes?.clientNotes?.trim() || '';

                if (!constructionClientNotes) return null;

                return (
                  <div
                    key={`construction-${workflow.id}`}
                    className='bg-gray-50 rounded-lg border border-gray-200 p-3'
                  >
                    <h5 className='font-medium text-gray-900 mb-2 text-sm'>
                      {workflow.name}
                    </h5>
                    <div className='space-y-1'>
                      {constructionClientNotes
                        .split('\n')
                        .filter((line) => line.trim())
                        .map((line, index) => (
                          <p key={index} className='text-sm text-gray-700'>
                            {line.trim().startsWith('-')
                              ? line.trim()
                              : `- ${line.trim()}`}
                          </p>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Design Notes Section */}
            <div className='space-y-3'>
              <h4 className='text-md font-semibold text-gray-800 border-b border-gray-300 pb-2'>
                Design Notes
              </h4>
              {workflows.map((workflow) => {
                const designClientNotes =
                  workflow.designNotes?.clientNotes?.trim() || '';

                if (!designClientNotes) return null;

                return (
                  <div
                    key={`design-${workflow.id}`}
                    className='bg-gray-50 rounded-lg border border-gray-200 p-3'
                  >
                    <h5 className='font-medium text-gray-900 mb-2 text-sm'>
                      {workflow.name}
                    </h5>
                    <div className='space-y-1'>
                      {designClientNotes
                        .split('\n')
                        .filter((line) => line.trim())
                        .map((line, index) => (
                          <p key={index} className='text-sm text-gray-700'>
                            {line.trim().startsWith('-')
                              ? line.trim()
                              : `- ${line.trim()}`}
                          </p>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Contractor Notes Card */}
      <div className='bg-white rounded-lg border border-gray-200 shadow-sm'>
        <div
          className='bg-blue-600 text-white px-4 py-3 rounded-t-lg cursor-pointer flex items-center justify-between'
          onClick={() => setIsContractorNotesOpen(!isContractorNotesOpen)}
        >
          <h3 className='text-lg font-semibold'>Contractor Notes</h3>
          {isContractorNotesOpen ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </div>

        {isContractorNotesOpen && (
          <div className='p-4 space-y-4'>
            {/* Construction Notes Section */}
            <div className='space-y-3'>
              <h4 className='text-md font-semibold text-gray-800 border-b border-gray-300 pb-2'>
                Construction Notes
              </h4>
              {workflows.map((workflow) => {
                const constructionContractorNotes =
                  workflow.constructionNotes?.contractorNotes?.trim() || '';

                if (!constructionContractorNotes) return null;

                return (
                  <div
                    key={`construction-contractor-${workflow.id}`}
                    className='bg-gray-50 rounded-lg border border-gray-200 p-3'
                  >
                    <h5 className='font-medium text-gray-900 mb-2 text-sm'>
                      {workflow.name}
                    </h5>
                    <div className='space-y-1'>
                      {constructionContractorNotes
                        .split('\n')
                        .filter((line) => line.trim())
                        .map((line, index) => (
                          <p key={index} className='text-sm text-gray-700'>
                            {line.trim().startsWith('-')
                              ? line.trim()
                              : `- ${line.trim()}`}
                          </p>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Design Notes Section */}
            <div className='space-y-3'>
              <h4 className='text-md font-semibold text-gray-800 border-b border-gray-300 pb-2'>
                Design Notes
              </h4>
              {workflows.map((workflow) => {
                const designContractorNotes =
                  workflow.designNotes?.contractorNotes?.trim() || '';

                if (!designContractorNotes) return null;

                return (
                  <div
                    key={`design-contractor-${workflow.id}`}
                    className='bg-gray-50 rounded-lg border border-gray-200 p-3'
                  >
                    <h5 className='font-medium text-gray-900 mb-2 text-sm'>
                      {workflow.name}
                    </h5>
                    <div className='space-y-1'>
                      {designContractorNotes
                        .split('\n')
                        .filter((line) => line.trim())
                        .map((line, index) => (
                          <p key={index} className='text-sm text-gray-700'>
                            {line.trim().startsWith('-')
                              ? line.trim()
                              : `- ${line.trim()}`}
                          </p>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
