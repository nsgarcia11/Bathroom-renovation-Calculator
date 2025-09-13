'use client';

import { useState } from 'react';
import { useProject } from '@/hooks/use-projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Hammer,
  ShowerHead,
  Square,
  Layers,
  Paintbrush,
  Wrench,
  Users,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EstimatePageProps {
  projectId: string;
}

const CATEGORIES = [
  {
    id: 'demolition',
    name: 'Demolition',
    icon: Hammer,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'shower-walls',
    name: 'Shower Walls',
    icon: ShowerHead,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'shower-base',
    name: 'Shower Base',
    icon: Square,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'floors',
    name: 'Floors',
    icon: Layers,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'finishings',
    name: 'Finishings',
    icon: Paintbrush,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'structural',
    name: 'Structural',
    icon: Wrench,
    color: 'bg-gray-100 text-gray-600',
  },
  {
    id: 'trades',
    name: 'Trades',
    icon: Users,
    color: 'bg-gray-100 text-gray-600',
  },
];

const DEMOLITION_TASKS = [
  'Remove existing tub/shower base',
  'Remove existing tile',
  'Remove drywall to studs',
  'Remove existing plumbing fixtures',
  'Haul away debris',
];

export function EstimatePage({ projectId }: EstimatePageProps) {
  const router = useRouter();
  const { data: project, isLoading } = useProject(projectId);
  const [selectedCategory, setSelectedCategory] = useState('demolition');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['demolition-tasks'])
  );
  const [taskStates, setTaskStates] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleTask = (taskId: string) => {
    setTaskStates((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!project) {
    router.push('/');
    return null;
  }

  return (
    <div className='bg-white min-h-screen'>
      {/* Project Header */}
      <div className='p-4 sm:p-6 lg:p-8 border-b border-slate-200 max-w-7xl mx-auto'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <h1 className='text-xl font-bold text-slate-800'>
              {project.project_name}
            </h1>
          </div>
          <Button
            onClick={() => router.back()}
            variant='ghost'
            size='sm'
            title='Back'
            aria-label='Go back'
          >
            <ArrowLeft size={24} className='sm:w-[20px] sm:h-[20px]' />
          </Button>
        </div>
        <p className='text-sm text-slate-600 ml-8'>{project.client_name}</p>
      </div>

      {/* Category Navigation */}
      <div className='p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto'>
        <div className='flex space-x-4 overflow-x-auto pb-2'>
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
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
        <h2 className='text-2xl font-bold text-slate-800 capitalize'>
          {CATEGORIES.find((cat) => cat.id === selectedCategory)?.name}
        </h2>

        {/* Demolition Tasks Section */}
        {selectedCategory === 'demolition' && (
          <Card>
            <div
              className='cursor-pointer'
              onClick={() => toggleSection('demolition-tasks')}
            >
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>Demolition Tasks</CardTitle>
                  {expandedSections.has('demolition-tasks') ? (
                    <ChevronUp size={20} className='text-blue-600' />
                  ) : (
                    <ChevronDown size={20} className='text-gray-400' />
                  )}
                </div>
              </CardHeader>
            </div>
            {expandedSections.has('demolition-tasks') && (
              <CardContent className='space-y-3'>
                {DEMOLITION_TASKS.map((task, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between py-2'
                  >
                    <span className='text-slate-700'>{task}</span>
                    <Toggle
                      checked={taskStates[`demolition-${index}`] || false}
                      onChange={() => toggleTask(`demolition-${index}`)}
                      title={`Toggle ${task}`}
                      aria-label={`Toggle ${task}`}
                    />
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        )}

        {/* Placeholder for other categories */}
        {selectedCategory !== 'demolition' && (
          <Card>
            <CardContent className='p-6 text-center'>
              <p className='text-slate-500'>
                {CATEGORIES.find((cat) => cat.id === selectedCategory)?.name}{' '}
                tasks coming soon...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
