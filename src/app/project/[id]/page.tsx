'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useProject,
  useUpdateProject,
  useDeleteProject,
} from '@/hooks/use-projects';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Edit,
  Trash2,
  Calculator,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

function ProjectDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const { data: project, isLoading, error } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this project? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deleteProject.mutateAsync(projectId);
      router.push('/projects');
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateProject.mutateAsync({
        id: projectId,
        status: newStatus as 'draft' | 'active' | 'completed',
      });
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <Alert>
            <AlertDescription>
              Project not found or failed to load.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/projects')} className='mt-4'>
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader
        title={project.project_name}
        subtitle={`Client: ${project.client_name}`}
        showBackButton={true}
        backButtonText='Back to Projects'
        onBackClick={() => router.push('/projects')}
      />

      <div className='py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-8'>
            <div className='flex justify-end mb-6'>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className='h-4 w-4 mr-2' />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>

                <Button
                  variant='destructive'
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  {deleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Project Details */}
            <div className='lg:col-span-2 space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Project Name
                      </label>
                      <p className='text-gray-900'>{project.project_name}</p>
                    </div>

                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Status
                      </label>
                      <div className='flex items-center space-x-2'>
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
                        {isEditing && (
                          <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className='text-sm border rounded px-2 py-1'
                            aria-label='Change project status'
                          >
                            <option value='draft'>Draft</option>
                            <option value='active'>Active</option>
                            <option value='completed'>Completed</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>

                  {project.project_address && (
                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Project Address
                      </label>
                      <p className='text-gray-900 flex items-center'>
                        <MapPin className='h-4 w-4 mr-2' />
                        {project.project_address}
                      </p>
                    </div>
                  )}

                  {project.notes && (
                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Notes
                      </label>
                      <p className='text-gray-900'>{project.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-700'>
                      Client Name
                    </label>
                    <p className='text-gray-900 flex items-center'>
                      <FileText className='h-4 w-4 mr-2' />
                      {project.client_name}
                    </p>
                  </div>

                  {project.client_email && (
                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Email
                      </label>
                      <p className='text-gray-900 flex items-center'>
                        <Mail className='h-4 w-4 mr-2' />
                        {project.client_email}
                      </p>
                    </div>
                  )}

                  {project.client_phone && (
                    <div>
                      <label className='text-sm font-medium text-gray-700'>
                        Phone
                      </label>
                      <p className='text-gray-900 flex items-center'>
                        <Phone className='h-4 w-4 mr-2' />
                        {project.client_phone}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Actions Sidebar */}
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <Button
                    className='w-full justify-start'
                    onClick={() =>
                      router.push(`/estimate?project=${projectId}`)
                    }
                  >
                    <Calculator className='h-4 w-4 mr-2' />
                    View Estimate
                  </Button>

                  <Button
                    variant='outline'
                    className='w-full justify-start'
                    onClick={() => router.push('/settings')}
                  >
                    <Settings className='h-4 w-4 mr-2' />
                    Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Calendar className='h-4 w-4 mr-2' />
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Calendar className='h-4 w-4 mr-2' />
                    Updated: {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <Layout showBottomNav={false}>
      <AuthGuard>
        <ProjectDetailPageContent />
      </AuthGuard>
    </Layout>
  );
}
