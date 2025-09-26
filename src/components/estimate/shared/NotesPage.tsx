'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, StickyNote, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotesTabs } from './NotesTabs';
import { useNotes } from '@/contexts/NotesContext';
import type { ConstructionCategory } from '@/contexts/EstimateContext';

export function NotesPage() {
  const { workflowNotes, closeNotes } = useNotes();
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ConstructionCategory>
  >(new Set());

  const toggleCategory = (category: ConstructionCategory) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const categoriesWithNotes = useMemo(() => {
    return workflowNotes.filter((workflow) => workflow.hasNotes);
  }, [workflowNotes]);

  const categoriesWithoutNotes = useMemo(() => {
    return workflowNotes.filter((workflow) => !workflow.hasNotes);
  }, [workflowNotes]);

  return (
    <div className='bg-white min-h-screen'>
      {/* Header */}
      <div className='p-4 sm:p-6 lg:p-8 border-b border-slate-200 max-w-7xl mx-auto'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <button
              onClick={closeNotes}
              className='p-2 hover:bg-slate-100 rounded-md transition-colors'
              title='Go back'
              aria-label='Go back to estimate'
            >
              <ArrowLeft size={20} />
            </button>
            <div className='flex items-center space-x-3'>
              <StickyNote className='h-6 w-6 text-blue-600' />
              <h1 className='text-xl font-bold text-slate-800'>
                Project Notes
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
        {workflowNotes.length === 0 ? (
          <div className='text-center py-12'>
            <StickyNote className='h-16 w-16 text-slate-300 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-slate-600 mb-2'>
              No notes available
            </h2>
            <p className='text-slate-500'>
              Add notes to any workflow section to see them here
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Categories with notes */}
            {categoriesWithNotes.length > 0 && (
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold text-slate-700'>
                  Workflows with Notes ({categoriesWithNotes.length})
                </h2>
                {categoriesWithNotes.map((workflow) => (
                  <Card
                    key={workflow.category}
                    className='border-l-4 border-l-blue-500'
                  >
                    <button
                      className='w-full text-left'
                      onClick={() => toggleCategory(workflow.category)}
                    >
                      <CardHeader className='pb-3 hover:bg-slate-50 transition-colors'>
                        <CardTitle className='flex items-center justify-between text-base'>
                          <span className='text-slate-700'>
                            {workflow.categoryName}
                          </span>
                          <div className='flex items-center space-x-3'>
                            <span className='text-xs text-slate-500 bg-blue-100 px-2 py-1 rounded-full'>
                              {workflow.contractorNotes.length +
                                workflow.clientNotes.length}{' '}
                              chars
                            </span>
                            {expandedCategories.has(workflow.category) ? (
                              <ChevronDown className='h-4 w-4 text-slate-400' />
                            ) : (
                              <ChevronRight className='h-4 w-4 text-slate-400' />
                            )}
                          </div>
                        </CardTitle>
                      </CardHeader>
                    </button>
                    {expandedCategories.has(workflow.category) && (
                      <CardContent className='pt-0'>
                        <NotesTabs
                          contractorNotes={workflow.contractorNotes}
                          clientNotes={workflow.clientNotes}
                          hasContractorNotes={workflow.hasContractorNotes}
                          hasClientNotes={workflow.hasClientNotes}
                          readOnly={true}
                        />
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Categories without notes */}
            {categoriesWithoutNotes.length > 0 && (
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold text-slate-700'>
                  Workflows without Notes ({categoriesWithoutNotes.length})
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {categoriesWithoutNotes.map((workflow) => (
                    <Card
                      key={workflow.category}
                      className='border border-slate-200 hover:border-slate-300 transition-colors'
                    >
                      <CardContent className='p-6 text-center'>
                        <StickyNote className='h-8 w-8 text-slate-300 mx-auto mb-3' />
                        <p className='text-sm font-medium text-slate-600 mb-1'>
                          {workflow.categoryName}
                        </p>
                        <p className='text-xs text-slate-400'>No notes added</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
