'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContractor } from '@/hooks/use-contractor';
import { useUpdateContractor } from '@/hooks/use-contractor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PROVINCES, CURRENCIES } from '@/lib/constants';
import { Plus, Save, Trash2 } from 'lucide-react';

export function SettingsPage() {
  const router = useRouter();
  const { data: contractor } = useContractor();
  const updateContractor = useUpdateContractor();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    companyEmails: [''],
    companyPhones: [''],
    address: '',
    postalCode: '',
    province: 'ON',
    hourlyRate: '75',
    taxRate: '13',
    currency: 'CAD',
  });

  // Load contractor data into form
  useEffect(() => {
    if (contractor) {
      // Split comma-separated emails and phones into arrays
      const emails = contractor.email
        ? contractor.email
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [''];
      const phones = contractor.phone
        ? contractor.phone
            .split(',')
            .map((phone) => phone.trim())
            .filter((phone) => phone)
        : [''];

      setFormData({
        companyName: contractor.name || '',
        companyEmails: emails.length > 0 ? emails : [''],
        companyPhones: phones.length > 0 ? phones : [''],
        address: contractor.address || '',
        postalCode: contractor.postal_code || '',
        province: contractor.province || 'ON',
        hourlyRate: contractor.hourly_rate?.toString() || '75',
        taxRate: ((contractor.tax_rate || 0.13) * 100).toString(),
        currency: contractor.currency || 'CAD',
      });
    }
  }, [contractor]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (
    field: 'companyEmails' | 'companyPhones',
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addEmail = () => {
    setFormData((prev) => ({
      ...prev,
      companyEmails: [...prev.companyEmails, ''],
    }));
  };

  const removeEmail = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      companyEmails: prev.companyEmails.filter((_, i) => i !== index),
    }));
  };

  const addPhone = () => {
    setFormData((prev) => ({
      ...prev,
      companyPhones: [...prev.companyPhones, ''],
    }));
  };

  const removePhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      companyPhones: prev.companyPhones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const contractorData = {
        name: formData.companyName,
        address: formData.address,
        postal_code: formData.postalCode,
        phone: formData.companyPhones
          .filter((phone) => phone.trim() !== '')
          .join(', '),
        email: formData.companyEmails
          .filter((email) => email.trim() !== '')
          .join(', '),
        province: formData.province,
        tax_rate: parseFloat(formData.taxRate) / 100,
        hourly_rate: parseFloat(formData.hourlyRate),
        currency: formData.currency,
      };

      await updateContractor.mutateAsync(contractorData);
      setMessage('Settings updated successfully!');

      // Redirect to home page after successful save
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Settings update error:', error);
      setMessage('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-6'>
      {/* Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <Input
                id='companyName'
                label='Company Name'
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange('companyName', e.target.value)
                }
                placeholder='Enter company name'
              />
            </div>

            {/* Emails Section */}
            <div className='space-y-2'>
              <label className='flex justify-between text-sm font-medium text-slate-600'>
                Email Addresses
                <button
                  type='button'
                  onClick={addEmail}
                  className='p-1 text-blue-600 hover:bg-blue-50 rounded-md ml-1'
                  title='Add email'
                >
                  <Plus size={22} />
                </button>
              </label>
              {formData.companyEmails.map((email, index) => (
                <div
                  key={`settings-email-${index}`}
                  className='flex items-center -mx-7 px-7'
                >
                  <input
                    type='email'
                    value={email}
                    onChange={(e) =>
                      handleArrayInputChange(
                        'companyEmails',
                        index,
                        e.target.value
                      )
                    }
                    placeholder='Enter email address'
                    className='w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400'
                  />
                  {formData.companyEmails.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeEmail(index)}
                      className='p-1 text-red-600 hover:bg-red-50 rounded-md flex-shrink-0 ml-1'
                      title='Remove email'
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
                  onClick={addPhone}
                  className='p-1 text-blue-600 hover:bg-blue-50 rounded-md ml-1'
                  title='Add phone'
                >
                  <Plus size={22} />
                </button>
              </label>
              {formData.companyPhones.map((phone, index) => (
                <div
                  key={`settings-phone-${index}`}
                  className='flex items-center -mx-7 px-7'
                >
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) =>
                      handleArrayInputChange(
                        'companyPhones',
                        index,
                        e.target.value
                      )
                    }
                    placeholder='Enter phone number'
                    className='w-full text-sm border border-slate-300 rounded-md px-3 py-2 text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400'
                  />
                  {formData.companyPhones.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removePhone(index)}
                      className='p-1 text-red-600 hover:bg-red-50 rounded-md flex-shrink-0 ml-1'
                      title='Remove phone'
                    >
                      <Trash2 size={22} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className='grid grid-cols-1 gap-4'>
              <Input
                id='address'
                label='Address'
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder='Enter address'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Input
                id='postalCode'
                label='Postal Code'
                value={formData.postalCode}
                onChange={(e) =>
                  handleInputChange('postalCode', e.target.value)
                }
                placeholder='Enter postal code'
              />
              <Select
                id='province'
                label='Province'
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
              >
                {Object.entries(PROVINCES).map(([code, data]) => (
                  <option key={code} value={code}>
                    {data.name}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Input
                id='hourlyRate'
                label='Hourly Rate ($)'
                type='number'
                value={formData.hourlyRate}
                onChange={(e) =>
                  handleInputChange('hourlyRate', e.target.value)
                }
                placeholder='Enter hourly rate'
              />
              <Input
                id='taxRate'
                label='Tax Rate (%)'
                type='number'
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
                placeholder='Enter tax rate'
              />
              <Select
                id='currency'
                label='Currency'
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              >
                {Object.entries(CURRENCIES).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {message && (
          <Alert
            variant={
              message.includes('success') ? 'informative' : 'destructive'
            }
          >
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {!message && (
          <div className='flex justify-between space-x-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading}
              className='flex items-center space-x-2'
            >
              <Save size={16} />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
