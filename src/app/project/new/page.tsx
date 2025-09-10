'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProject } from '@/hooks/use-projects';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const projectSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  client_name: z.string().min(1, 'Client name is required'),
  client_email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  client_phone: z.string().optional(),
  project_address: z.string().optional(),
  notes: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

function NewProjectPageContent() {
  const router = useRouter();
  const createProject = useCreateProject();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: '',
      client_name: '',
      client_email: '',
      client_phone: '',
      project_address: '',
      notes: '',
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const project = await createProject.mutateAsync({
        ...data,
        status: 'draft',
      });

      // Redirect to the project detail page
      router.push(`/project/${project.id}`);
    } catch (error) {
      console.error('Project creation error:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader
        title='Create New Project'
        subtitle='Enter the project details to get started'
        showBackButton={true}
        backButtonText='Back to Projects'
        onBackClick={() => router.push('/projects')}
      />

      <div className='py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-2xl mx-auto'>
          <Card>
            <CardHeader>
              <CardTitle className='text-center'>Project Details</CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <FormField
                    control={form.control}
                    name='project_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g., Master Bathroom Renovation'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='client_name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name *</FormLabel>
                        <FormControl>
                          <Input placeholder='Client full name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <FormField
                      control={form.control}
                      name='client_email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email</FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='client@email.com'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='client_phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Phone</FormLabel>
                          <FormControl>
                            <Input placeholder='(555) 123-4567' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='project_address'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='123 Main Street, City, Province'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='notes'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Any additional notes about this project...'
                            className='min-h-[100px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {createProject.isError && (
                    <Alert>
                      <AlertDescription>
                        Failed to create project. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className='flex space-x-4'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => router.push('/')}
                      className='flex-1'
                    >
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      disabled={createProject.isPending}
                      className='flex-1'
                    >
                      {createProject.isPending
                        ? 'Creating...'
                        : 'Create Project'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Layout showBottomNav={false}>
      <AuthGuard>
        <NewProjectPageContent />
      </AuthGuard>
    </Layout>
  );
}
