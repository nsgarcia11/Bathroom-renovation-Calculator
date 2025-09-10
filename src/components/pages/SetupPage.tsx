'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useContractor, useUpdateContractor } from '@/hooks/use-contractor';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const setupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please enter a valid email address'),
  province: z.string().min(1, 'Province is required'),
  tax_rate: z.number().min(0).max(1),
});

type SetupFormData = z.infer<typeof setupSchema>;

const provinces = [
  { code: 'AB', name: 'Alberta', tax: 0.05 },
  { code: 'BC', name: 'British Columbia', tax: 0.12 },
  { code: 'MB', name: 'Manitoba', tax: 0.12 },
  { code: 'NB', name: 'New Brunswick', tax: 0.15 },
  { code: 'NL', name: 'Newfoundland and Labrador', tax: 0.15 },
  { code: 'NS', name: 'Nova Scotia', tax: 0.15 },
  { code: 'ON', name: 'Ontario', tax: 0.13 },
  { code: 'PE', name: 'Prince Edward Island', tax: 0.15 },
  { code: 'QC', name: 'Quebec', tax: 0.14975 },
  { code: 'SK', name: 'Saskatchewan', tax: 0.11 },
  { code: 'NT', name: 'Northwest Territories', tax: 0.05 },
  { code: 'NU', name: 'Nunavut', tax: 0.05 },
  { code: 'YT', name: 'Yukon', tax: 0.05 },
];

export function SetupPage() {
  const router = useRouter();
  const { data: existingContractor } = useContractor();
  const updateContractor = useUpdateContractor();

  const form = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      tax_rate: 0.13,
    },
  });

  const selectedProvince = form.watch('province');

  useEffect(() => {
    if (existingContractor) {
      form.reset({
        name: existingContractor.name,
        address: existingContractor.address,
        postal_code: existingContractor.postal_code,
        phone: existingContractor.phone,
        email: existingContractor.email,
        province: existingContractor.province,
        tax_rate: existingContractor.tax_rate,
      });
    }
  }, [existingContractor, form]);

  useEffect(() => {
    if (selectedProvince) {
      const province = provinces.find((p) => p.code === selectedProvince);
      if (province) {
        form.setValue('tax_rate', province.tax);
      }
    }
  }, [selectedProvince, form]);

  // Update tax rate when province changes from existing contractor data
  useEffect(() => {
    if (existingContractor?.province) {
      const province = provinces.find(
        (p) => p.code === existingContractor.province
      );
      if (province && existingContractor.tax_rate !== province.tax) {
        form.setValue('tax_rate', province.tax);
      }
    }
  }, [existingContractor, form]);

  const onSubmit = async (data: SetupFormData) => {
    try {
      console.log('💾 Saving contractor data:', data);
      await updateContractor.mutateAsync(data);
      console.log('✅ Contractor data saved successfully');
      
      // Redirect immediately after successful save
      console.log('🔄 Redirecting to home page...');
      router.push('/');
    } catch (error) {
      console.error('❌ Setup error:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>
              {existingContractor
                ? 'Update Contractor Information'
                : 'Set Up Contractor Information'}
            </CardTitle>
            <p className='text-center text-gray-600'>
              This information will be used in your estimates and PDF exports
            </p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder='Your company name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='your@email.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='address'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address *</FormLabel>
                      <FormControl>
                        <Input placeholder='123 Main Street, City' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='postal_code'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder='K1A 0A6' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder='(555) 123-4567' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='province'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Province' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.code}
                              >
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tax_rate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.0001'
                            min='0'
                            max='1'
                            placeholder='0.13'
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <p className='text-xs text-gray-500'>
                          Automatically set based on province selection
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {updateContractor.isError && (
                  <Alert>
                    <AlertDescription>
                      Failed to save contractor information. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                {updateContractor.isSuccess && (
                  <Alert>
                    <AlertDescription>
                      ✅ Contractor information saved successfully! Redirecting
                      to dashboard...
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
                    disabled={updateContractor.isPending}
                    className='flex-1'
                  >
                    {updateContractor.isPending
                      ? 'Saving...'
                      : existingContractor
                      ? 'Update'
                      : 'Save'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
