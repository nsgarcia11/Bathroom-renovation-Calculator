'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateProject } from '@/hooks/use-projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2 } from 'lucide-react';

export function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [projectData, setProjectData] = useState({
    projectName: '',
    clientName: '',
    projectAddress: '',
    clientEmails: [''],
    clientPhones: [''],
    notes: '',
  });

  const handleFieldChange = (field: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: 'clientEmails' | 'clientPhones',
    index: number,
    value: string
  ) => {
    const newArr = [...projectData[field]];
    newArr[index] = value;
    setProjectData((prev) => ({ ...prev, [field]: newArr }));
  };

  const addArrayField = (field: 'clientEmails' | 'clientPhones') => {
    setProjectData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (
    field: 'clientEmails' | 'clientPhones',
    index: number
  ) => {
    if (projectData[field].length <= 1) return;
    const newArr = [...projectData[field]];
    newArr.splice(index, 1);
    setProjectData((prev) => ({ ...prev, [field]: newArr }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // Filter out empty emails and phones
      const filteredEmails = projectData.clientEmails.filter(
        (email) => email.trim() !== ''
      );
      const filteredPhones = projectData.clientPhones.filter(
        (phone) => phone.trim() !== ''
      );

      const projectPayload = {
        project_name: projectData.projectName,
        client_name: projectData.clientName,
        project_address: projectData.projectAddress || undefined,
        client_email:
          filteredEmails.length > 0 ? filteredEmails.join(', ') : undefined,
        client_phone:
          filteredPhones.length > 0 ? filteredPhones.join(', ') : undefined,
        notes: projectData.notes || undefined,
        status: 'draft' as const,
      };

      await createProject.mutateAsync(projectPayload);

      setMessage('Project created successfully!');

      // Redirect to home page after successful creation
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('❌ Project creation error:', error);
      setMessage('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className='p-4 space-y-6'>
      <form onSubmit={handleSave} className='space-y-6'>
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Input
              id='projectName'
              label='Project Name'
              value={projectData.projectName}
              onChange={(e) => handleFieldChange('projectName', e.target.value)}
              placeholder='e.g., Main Floor Bathroom Reno'
            />
            <Textarea
              id='notes'
              label='Internal Notes'
              value={projectData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder='Add any private notes for this project...'
              helperText='Notes are for you only and will not be displayed on the estimate.'
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Input
              id='clientName'
              label='Full Name'
              value={projectData.clientName}
              onChange={(e) => handleFieldChange('clientName', e.target.value)}
              placeholder='e.g., John Doe'
            />
            <Input
              id='projectAddress'
              label='Property Address'
              value={projectData.projectAddress}
              onChange={(e) =>
                handleFieldChange('projectAddress', e.target.value)
              }
              placeholder='e.g., 123 Main St, Anytown'
            />

            {/* Emails Section */}
            <div className='space-y-2'>
              <label className='flex justify-between text-sm font-medium text-slate-600'>
                <span>Email Addresses</span>
                <button
                  type='button'
                  onClick={() => addArrayField('clientEmails')}
                  className='p-1 text-blue-600 hover:bg-blue-50 rounded-md ml-1'
                  title='Add email'
                >
                  <Plus size={22} />
                </button>
              </label>
              {projectData.clientEmails.map((email, index) => (
                <div
                  key={`email-${index}`}
                  className='flex items-center -mx-7 px-7'
                >
                  <input
                    type='email'
                    value={email}
                    onChange={(e) =>
                      handleArrayChange('clientEmails', index, e.target.value)
                    }
                    placeholder={`Email ${index + 1}`}
                    className='w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400'
                  />
                  {projectData.clientEmails.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeArrayField('clientEmails', index)}
                      className='p-1 text-red-600 hover:bg-red-50 rounded-md flex-shrink-0 ml-1'
                      title='Remove email'
                      aria-label='Remove email'
                    >
                      <Trash2 size={22} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Phones Section */}
            <div className='space-y-2'>
              <label className='flex justify-between text-sm font-medium text-slate-600'>
                <span>Phone Numbers</span>
                <button
                  type='button'
                  onClick={() => addArrayField('clientPhones')}
                  className='p-1 text-blue-600 hover:bg-blue-50 rounded-md ml-1'
                  title='Add phone'
                >
                  <Plus size={22} />
                </button>
              </label>
              {projectData.clientPhones.map((phone, index) => (
                <div
                  key={`phone-${index}`}
                  className='flex items-center -mx-7 px-7'
                >
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) =>
                      handleArrayChange('clientPhones', index, e.target.value)
                    }
                    placeholder={`Phone ${index + 1}`}
                    className='w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400'
                  />
                  {projectData.clientPhones.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeArrayField('clientPhones', index)}
                      className='p-1 text-red-600 hover:bg-red-50 rounded-md flex-shrink-0 ml-1'
                      title='Remove phone'
                      aria-label='Remove phone'
                    >
                      <Trash2 size={22} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Display */}
        {message && (
          <Alert
            variant={
              message.includes('success') ? 'informative' : 'destructive'
            }
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        {!message && (
          <div className='flex justify-between space-x-4'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                isLoading ||
                !projectData.projectName.trim() ||
                !projectData.clientName.trim()
              }
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
