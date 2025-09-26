'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { Hammer, ShowerHead } from 'lucide-react';
import { ShowerBaseIcon } from '@/components/icons/ShowerBaseIcon';

export default function NotesOverview() {
  const { getDesignData, getNotes } = useEstimateWorkflowContext();

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
    return workflowList;
  }, [demolitionNotes, showerWallsNotes, showerBaseNotes]);

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

      {/* Workflows Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            className='border-blue-200 hover:shadow-lg transition-shadow'
          >
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center space-x-3'>
                <div
                  className={`w-10 h-10 ${workflow.color} rounded-lg flex items-center justify-center`}
                >
                  {workflow.icon}
                </div>
                <div>
                  <h3 className='text-lg font-semibold'>{workflow.name}</h3>
                  <Badge variant='outline' className='text-xs'>
                    {workflow.constructionNotes.contractorNotes.trim() ||
                    workflow.constructionNotes.clientNotes.trim() ||
                    (workflow.designNotes &&
                      (workflow.designNotes.contractorNotes.trim() ||
                        workflow.designNotes.clientNotes.trim()))
                      ? 'Has Notes'
                      : 'No Notes'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Design Notes Section (only for Shower Walls) */}
              {workflow.designNotes &&
                (workflow.designNotes.contractorNotes.trim() ||
                  workflow.designNotes.clientNotes.trim()) && (
                  <div className='space-y-4'>
                    <h4 className='font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                      Design Notes
                    </h4>

                    {/* Design Contractor Notes */}
                    <div className='space-y-2'>
                      <h5 className='font-medium text-gray-700 flex items-center justify-between'>
                        <span>Contractor Notes</span>
                        <span className='text-blue-600 text-sm'>
                          {workflow.designNotes.contractorNotes.trim()
                            ? 'Available'
                            : 'None'}
                        </span>
                      </h5>
                      <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]'>
                        {workflow.designNotes.contractorNotes.trim() ? (
                          <p className='whitespace-pre-wrap'>
                            {workflow.designNotes.contractorNotes}
                          </p>
                        ) : (
                          <p className='text-gray-400 italic'>
                            No design contractor notes added
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Design Client Notes */}
                    <div className='space-y-2'>
                      <h5 className='font-medium text-gray-700 flex items-center justify-between'>
                        <span>Client Notes</span>
                        <span className='text-green-600 text-sm'>
                          {workflow.designNotes.clientNotes.trim()
                            ? 'Available'
                            : 'None'}
                        </span>
                      </h5>
                      <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]'>
                        {workflow.designNotes.clientNotes.trim() ? (
                          <p className='whitespace-pre-wrap'>
                            {workflow.designNotes.clientNotes}
                          </p>
                        ) : (
                          <p className='text-gray-400 italic'>
                            No design client notes added
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Construction Notes Section */}
              <div className='space-y-4'>
                <h4 className='font-semibold text-gray-900 border-b border-gray-200 pb-2'>
                  Construction Notes
                </h4>

                {/* Construction Contractor Notes */}
                <div className='space-y-2'>
                  <h5 className='font-medium text-gray-700 flex items-center justify-between'>
                    <span>Contractor Notes</span>
                    <span className='text-blue-600 text-sm'>
                      {workflow.constructionNotes.contractorNotes.trim()
                        ? 'Available'
                        : 'None'}
                    </span>
                  </h5>
                  <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]'>
                    {workflow.constructionNotes.contractorNotes.trim() ? (
                      <p className='whitespace-pre-wrap'>
                        {workflow.constructionNotes.contractorNotes}
                      </p>
                    ) : (
                      <p className='text-gray-400 italic'>
                        No construction contractor notes added
                      </p>
                    )}
                  </div>
                </div>

                {/* Construction Client Notes */}
                <div className='space-y-2'>
                  <h5 className='font-medium text-gray-700 flex items-center justify-between'>
                    <span>Client Notes</span>
                    <span className='text-green-600 text-sm'>
                      {workflow.constructionNotes.clientNotes.trim()
                        ? 'Available'
                        : 'None'}
                    </span>
                  </h5>
                  <div className='text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]'>
                    {workflow.constructionNotes.clientNotes.trim() ? (
                      <p className='whitespace-pre-wrap'>
                        {workflow.constructionNotes.clientNotes}
                      </p>
                    ) : (
                      <p className='text-gray-400 italic'>
                        No construction client notes added
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='border-blue-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-blue-900'>
              Design Contractor Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>
              {
                workflows.filter(
                  (w) => w.designNotes && w.designNotes.contractorNotes.trim()
                ).length
              }
            </div>
            <p className='text-sm text-gray-600 mt-1'>
              Workflows with design contractor notes
            </p>
          </CardContent>
        </Card>

        <Card className='border-green-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-green-900'>
              Design Client Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {
                workflows.filter(
                  (w) => w.designNotes && w.designNotes.clientNotes.trim()
                ).length
              }
            </div>
            <p className='text-sm text-gray-600 mt-1'>
              Workflows with design client notes
            </p>
          </CardContent>
        </Card>

        <Card className='border-orange-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-orange-900'>
              Construction Contractor Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>
              {
                workflows.filter((w) =>
                  w.constructionNotes.contractorNotes.trim()
                ).length
              }
            </div>
            <p className='text-sm text-gray-600 mt-1'>
              Workflows with construction contractor notes
            </p>
          </CardContent>
        </Card>

        <Card className='border-purple-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-purple-900'>
              Construction Client Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-purple-600'>
              {
                workflows.filter((w) => w.constructionNotes.clientNotes.trim())
                  .length
              }
            </div>
            <p className='text-sm text-gray-600 mt-1'>
              Workflows with construction client notes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
