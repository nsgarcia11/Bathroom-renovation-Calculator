'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContractor } from '@/hooks/use-contractor';
import { useProjects } from '@/hooks/use-projects';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Settings } from 'lucide-react';

export function HomePage() {
  const router = useRouter();
  const {
    data: contractor,
    isLoading: contractorLoading,
    refetch: refetchContractor,
  } = useContractor();
  const { data: projects, isLoading: projectsLoading } = useProjects();

  const loading = contractorLoading || projectsLoading;

  console.log('🏠 HomePage render:', {
    contractor: contractor ? 'Found' : 'Not found',
    loading,
    contractorLoading,
    projectsLoading,
  });

  // Refetch contractor data when component mounts to ensure fresh data
  useEffect(() => {
    console.log('🔄 HomePage mounted, refetching contractor data...');
    refetchContractor();
  }, [refetchContractor]);

  const handleNewProject = () => {
    router.push('/project/new');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='text-center'>Welcome!</CardTitle>
            </CardHeader>
            <CardContent className='text-center space-y-4'>
              <p className='text-gray-600'>
                To get started, please set up your contractor information.
              </p>
              <Button onClick={handleSettings} className='w-full'>
                <Settings className='h-4 w-4 mr-2' />
                Go to Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader
        title='Bathroom Renovation Calculator'
        subtitle={`Welcome back, ${contractor.name}`}
      />

      {/* Main Content */}
      <div className='py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={handleNewProject}
            >
              <CardContent className='flex flex-col items-center justify-center py-8'>
                <Plus className='h-12 w-12 text-blue-600 mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  New Project
                </h3>
                <p className='text-gray-600 text-center'>
                  Start a new bathroom renovation estimate
                </p>
              </CardContent>
            </Card>

            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={() => router.push('/projects')}
            >
              <CardContent className='flex flex-col items-center justify-center py-8'>
                <FileText className='h-12 w-12 text-green-600 mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Projects
                </h3>
                <p className='text-gray-600 text-center'>
                  {projects?.length || 0} project
                  {(projects?.length || 0) !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card
              className='cursor-pointer hover:shadow-md transition-shadow'
              onClick={handleSettings}
            >
              <CardContent className='flex flex-col items-center justify-center py-8'>
                <Settings className='h-12 w-12 text-purple-600 mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Settings
                </h3>
                <p className='text-gray-600 text-center'>
                  Manage contractor info & preferences
                </p>
              </CardContent>
            </Card>
          </div>

          {(projects?.length || 0) > 0 && (
            <div className='mt-8'>
              <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                Recent Projects
              </h2>
              <div className='space-y-4'>
                {(projects || []).slice(0, 5).map((project) => (
                  <Card
                    key={project.id}
                    className='cursor-pointer hover:shadow-md transition-shadow'
                    onClick={() => router.push(`/project/${project.id}`)}
                  >
                    <CardContent className='py-4'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-semibold text-gray-900'>
                            {project.project_name}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {project.client_name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
