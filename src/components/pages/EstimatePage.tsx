'use client';

import { useCallback } from 'react';
import { useProject } from '@/hooks/use-projects';
import { useContractor } from '@/hooks/use-contractor';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Hammer,
  ShowerHead,
  Layers,
  Paintbrush,
  Save,
} from 'lucide-react';
import { ShowerBaseIcon } from '@/components/icons/ShowerBaseIcon';
import { TradeIcon } from '@/components/icons/TradeIcon';
import { StructuralIcon } from '@/components/icons/StructuralIcon';
import { useRouter } from 'next/navigation';
import { useEstimate } from '@/contexts/EstimateContext';
import type { ConstructionCategory } from '@/contexts/EstimateContext';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
// Removed unused imports

// Unified Workflow Sections
import DemolitionWorkflowSection from '@/components/estimate/workflows/demolition/DemolitionWorkflowSection';
import ShowerWallsWorkflowSection from '@/components/estimate/workflows/shower-walls/ShowerWallsWorkflowSection';
import ShowerBaseWorkflowSection from '@/components/estimate/workflows/shower-base/ShowerBaseWorkflowSection';
import FloorWorkflowSection from '@/components/estimate/workflows/floors/FloorsWorkflowSection';
import FinishingsWorkflowSection from '@/components/estimate/workflows/finishings/FinishingsWorkflowSection';
import StructuralWorkflowSection from '@/components/estimate/workflows/structural/StructuralWorkflowSection';
import TradesWorkflowSection from '@/components/estimate/workflows/trade/TradeWorkflowSection';
import EstimatesOverview from '@/components/estimate/shared/EstimatesOverview';
import NotesOverview from '@/components/estimate/shared/NotesOverview';

interface EstimatePageProps {
  projectId: string;
}

const CATEGORIES = [
  {
    id: 'demolition',
    name: 'Demolition',
    accronym: 'DM',
    icon: Hammer,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'shower-walls',
    name: 'Shower Walls',
    accronym: 'SW',
    icon: ShowerHead,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'shower-base',
    name: 'Shower Base',
    accronym: 'SB',
    icon: ShowerBaseIcon,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'floors',
    name: 'Floors',
    accronym: 'FL',
    icon: Layers,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'finishings',
    name: 'Finishings',
    accronym: 'FN',
    icon: Paintbrush,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'structural',
    name: 'Structural',
    accronym: 'ST',
    icon: StructuralIcon,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'trades',
    name: 'Trades',
    accronym: 'TR',
    icon: TradeIcon,
    color: 'bg-gray-100 text-gray-600',
  },
];

export default function EstimatePage({ projectId }: EstimatePageProps) {
  const router = useRouter();
  const { data: project, isLoading: isProjectLoading } = useProject(projectId);
  const { data: contractor } = useContractor();
  const {
    selectedCategory,
    activeSection,
    setSelectedCategory,
    setActiveSection,
  } = useEstimate();

  // Estimate workflow context
  const {
    saveData,
    isLoading: isWorkflowLoading,
    isSaving,
    error,
    lastSaved,
  } = useEstimateWorkflowContext();

  // Memoized save function
  const handleSave = useCallback(async () => {
    try {
      await saveData();
    } catch (error) {
      console.error('Save failed:', error);
    }
  }, [saveData]);

  // Render workflow section based on selected category
  const renderWorkflowSection = () => {
    const workflowProps = {
      activeSection: activeSection as 'design' | 'labor' | 'materials',
      contractorHourlyRate: contractor?.hourly_rate || 95,
    };

    switch (selectedCategory) {
      case 'demolition':
        return <DemolitionWorkflowSection {...workflowProps} />;

      case 'shower-walls':
        return <ShowerWallsWorkflowSection {...workflowProps} />;

      case 'shower-base':
        return <ShowerBaseWorkflowSection {...workflowProps} />;

      case 'floors':
        return <FloorWorkflowSection {...workflowProps} />;

      case 'finishings':
        return <FinishingsWorkflowSection {...workflowProps} />;

      case 'structural':
        return <StructuralWorkflowSection {...workflowProps} />;

      case 'trades':
        return <TradesWorkflowSection {...workflowProps} />;

      default:
        return (
          <div className='text-center py-8 text-slate-500'>
            Select a workflow to begin
          </div>
        );
    }
  };

  if (isProjectLoading || isWorkflowLoading) {
    return <LoadingSpinner />;
  }

  if (!project) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-slate-800 mb-4'>
            Project Not Found
          </h2>
          <Button onClick={() => router.back()} variant='outline'>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='bg-white border-b border-slate-200 px-4 py-3 sm:px-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button
              onClick={() => router.back()}
              variant='ghost'
              size='sm'
              className='p-3 sm:p-2'
            >
              <ArrowLeft size={28} className='sm:w-[20px] sm:h-[20px]' />
            </Button>
            <div>
              <h1 className='text-xl font-bold text-slate-900'>
                {project.project_name}
              </h1>
              <p className='text-sm text-slate-600'>{project.client_name}</p>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            {/* Autosave Indicator */}
            {lastSaved && (
              <div className='text-xs text-slate-500 hidden sm:block'>
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size='sm'
              className={`${
                error
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSaving ? (
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
              ) : (
                <Save size={16} className='sm:hidden inline' />
              )}
              <span className='sm:ml-0 ml-2 hidden sm:inline'>
                {isSaving ? 'Saving...' : 'Save'}
              </span>
            </Button>
          </div>
        </div>

        {error && <div className='mt-2 text-sm text-red-600'>{error}</div>}
      </div>

      {/* Top Navigation for Construction Categories */}
      <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
        <div className='flex space-x-4 overflow-x-auto pb-2'>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id as ConstructionCategory);
                  setActiveSection('design');
                }}
                className={`flex-shrink-0 w-24 h-20 rounded-lg border-2 flex flex-col items-center justify-center space-y-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Icon
                  size={24}
                  className={isSelected ? 'text-blue-600' : 'text-gray-600'}
                />
                <span
                  className={`text-xs font-medium ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className='p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto'>
        {activeSection === 'estimate' ? (
          <EstimatesOverview projectId={projectId} />
        ) : activeSection === 'notes' ? (
          <NotesOverview />
        ) : (
          renderWorkflowSection()
        )}
      </div>
    </div>
  );
}
