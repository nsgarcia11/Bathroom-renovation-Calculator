'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContractor } from '@/hooks/use-contractor';
import { useProjects, useDeleteProject } from '@/hooks/use-projects';
import { Project } from '@/types';
import { DashboardCard } from '@/components/ui/card';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import {
  Plus,
  Briefcase,
  BarChart2,
  Users,
  Pencil,
  Trash2,
} from 'lucide-react';

export function HomePage() {
  const router = useRouter();
  const {
    data: contractor,
    isLoading: contractorLoading,
    refetch: refetchContractor,
  } = useContractor();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const deleteProject = useDeleteProject();

  // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const loading = contractorLoading || projectsLoading;

  // Calculate total project value (placeholder - you may need to implement this based on your project structure)
  const totalProjectValue = useMemo(() => {
    // This is a placeholder calculation - adjust based on your actual project data structure
    return (projects || []).length * 5000; // Example: $5000 per project
  }, [projects]);

  // Refetch contractor data when component mounts to ensure fresh data
  useEffect(() => {
    refetchContractor();
  }, [refetchContractor]);

  const handleNewProject = () => {
    router.push('/project/new');
  };

  const handleEditProject = (project: Project) => {
    router.push(`/project/${project.id}/edit`);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject.mutateAsync(projectToDelete.id);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Failed to delete project:', error);
      // You could add a toast notification here instead of alert
      alert('Failed to delete project. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!contractor) {
    router.push('/setup');
    return null;
  }

  return (
    <div className='p-4 space-y-6'>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl sm:text-3xl font-bold text-slate-800'>
            Overview
          </h2>
        </div>
        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4'>
          <DashboardCard
            icon={<Briefcase className='w-5 h-5 text-blue-500' />}
            title='Active Projects'
            value={projects?.length || 0}
            color='bg-blue-100'
          />
          <DashboardCard
            icon={<BarChart2 className='w-5 h-5 text-green-500' />}
            title='Total Value'
            value={`$${totalProjectValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            color='bg-green-100'
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl sm:text-3xl font-bold text-slate-800'>
            Projects
          </h2>
          <button
            onClick={handleNewProject}
            className='flex items-center space-x-2 text-base sm:text-sm bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus size={18} />
            <span>Add Project</span>
          </button>
        </div>
        {(projects?.length || 0) === 0 ? (
          <div className='text-center py-10 px-4 bg-white rounded-lg shadow-sm'>
            <Users className='mx-auto text-slate-400 w-12 h-12' />
            <h3 className='text-lg sm:text-xl font-semibold text-slate-700 mt-4'>
              No Projects Yet
            </h3>
            <p className='text-slate-500 text-base sm:text-sm mt-1'>
              Tap the &apos;Add Project&apos; button to create your first
              estimate.
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {(projects || []).map((project) => (
              <div
                key={project.id}
                className='bg-white rounded-lg shadow-sm flex items-center transition-all hover:shadow-md'
              >
                <button
                  onClick={() => router.push(`/project/${project.id}/estimate`)}
                  className='flex-grow p-4 text-left'
                >
                  <h3 className='font-bold text-slate-800 text-base sm:text-sm'>
                    {project.project_name || 'Untitled Project'}
                  </h3>
                  <p className='text-base sm:text-sm text-slate-500'>
                    {project.client_name || 'No customer name'}
                  </p>
                </button>
                <button
                  title='Edit Project'
                  onClick={() => handleEditProject(project)}
                  className='p-4 text-slate-500 hover:text-blue-700'
                >
                  <Pencil size={22} />
                </button>
                <button
                  title='Delete Project'
                  onClick={() => handleDeleteProject(project)}
                  className='p-4 text-red-500 hover:text-red-700'
                >
                  <Trash2 size={22} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title='Delete Project'
        message={`Are you sure you want to delete "${
          projectToDelete?.project_name || 'this project'
        }"? This action cannot be undone.`}
        confirmText='Delete'
        cancelText='Cancel'
        variant='danger'
        isLoading={deleteProject.isPending}
      />
    </div>
  );
}
