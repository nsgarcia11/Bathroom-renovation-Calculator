'use client';

import { useRouter } from 'next/navigation';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, FileText, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

function ProjectsPageContent() {
  const router = useRouter();
  const { data: projects, isLoading, error } = useProjects();
  const deleteProject = useDeleteProject();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (projectId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this project? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeletingId(projectId);
    try {
      await deleteProject.mutateAsync(projectId);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <Alert>
            <AlertDescription>
              Failed to load projects. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader
        title='Projects'
        subtitle='Manage your bathroom renovation projects'
        showBackButton={true}
        backButtonText='Back to Dashboard'
      />

      <div className='py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-8 flex justify-end'>
            <Button onClick={() => router.push('/project/new')}>
              <Plus className='h-4 w-4 mr-2' />
              New Project
            </Button>
          </div>

          {!projects || projects.length === 0 ? (
            <Card>
              <CardContent className='flex flex-col items-center justify-center py-12'>
                <FileText className='h-12 w-12 text-gray-400 mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  No projects yet
                </h3>
                <p className='text-gray-600 text-center mb-6'>
                  Get started by creating your first bathroom renovation project
                </p>
                <Button onClick={() => router.push('/project/new')}>
                  <Plus className='h-4 w-4 mr-2' />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className='cursor-pointer hover:shadow-md transition-shadow'
                  onClick={() => router.push(`/project/${project.id}`)}
                >
                  <CardHeader className='pb-3'>
                    <div className='flex justify-between items-start'>
                      <CardTitle className='text-lg'>
                        {project.project_name}
                      </CardTitle>
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
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='flex items-center text-sm text-gray-600'>
                      <FileText className='h-4 w-4 mr-2' />
                      {project.client_name}
                    </div>

                    {project.client_email && (
                      <div className='flex items-center text-sm text-gray-600'>
                        <Mail className='h-4 w-4 mr-2' />
                        {project.client_email}
                      </div>
                    )}

                    {project.client_phone && (
                      <div className='flex items-center text-sm text-gray-600'>
                        <Phone className='h-4 w-4 mr-2' />
                        {project.client_phone}
                      </div>
                    )}

                    {project.project_address && (
                      <div className='flex items-center text-sm text-gray-600'>
                        <MapPin className='h-4 w-4 mr-2' />
                        {project.project_address}
                      </div>
                    )}

                    <div className='flex items-center text-sm text-gray-500'>
                      <Calendar className='h-4 w-4 mr-2' />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>

                    {project.notes && (
                      <p className='text-sm text-gray-600 line-clamp-2'>
                        {project.notes}
                      </p>
                    )}

                    <div className='flex space-x-2 pt-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/project/${project.id}`);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Layout showBottomNav={false}>
      <AuthGuard>
        <ProjectsPageContent />
      </AuthGuard>
    </Layout>
  );
}
