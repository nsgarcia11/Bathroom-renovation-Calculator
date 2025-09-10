'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useSaveWorkflowData } from '@/hooks/use-workflow-data';
import { AppHeader } from '@/components/AppHeader';
import { WorkflowNavigation } from '@/components/WorkflowNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';

const scopeItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  description: z.string(),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  notes: z.string(),
});

const scopeCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Category name is required'),
  items: z.array(scopeItemSchema),
  expanded: z.boolean(),
});

const scopeSchema = z.object({
  categories: z.array(scopeCategorySchema),
});

type ScopeFormData = z.infer<typeof scopeSchema>;

export function ScopePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const form = useForm<ScopeFormData>({
    resolver: zodResolver(scopeSchema),
    defaultValues: {
      categories: [
        {
          id: '1',
          name: 'Demolition',
          items: [
            {
              id: '1',
              name: 'Remove existing fixtures',
              description: 'Remove toilet, vanity, mirror, and other fixtures',
              quantity: 1,
              unit: 'room',
              notes: 'Dispose of materials properly',
            },
          ],
          expanded: true,
        },
        {
          id: '2',
          name: 'Shower Area',
          items: [
            {
              id: '2',
              name: 'Shower base installation',
              description: 'Install new shower base and waterproofing',
              quantity: 1,
              unit: 'unit',
              notes: 'Ensure proper slope for drainage',
            },
          ],
          expanded: false,
        },
        {
          id: '3',
          name: 'Flooring',
          items: [
            {
              id: '3',
              name: 'Tile installation',
              description: 'Install bathroom floor tiles',
              quantity: 1,
              unit: 'room',
              notes: 'Use waterproof grout and sealant',
            },
          ],
          expanded: false,
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'categories',
  });

  const watchedCategories = form.watch('categories');

  const saveWorkflowData = useSaveWorkflowData('scope');

  useEffect(() => {
    const loadScopeData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Load scope data from database
        // This would typically fetch from your API
        console.log('Loading scope data for user:', user.id);
      } catch (error) {
        console.error('Error loading scope data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadScopeData();
    }
  }, [user]);

  const toggleCategory = (categoryIndex: number) => {
    const updatedCategories = [...watchedCategories];
    updatedCategories[categoryIndex].expanded =
      !updatedCategories[categoryIndex].expanded;
    form.setValue('categories', updatedCategories);
  };

  const addItem = (categoryIndex: number) => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      unit: 'ea',
      notes: '',
    };

    const updatedCategories = [...watchedCategories];
    updatedCategories[categoryIndex].items.push(newItem);
    form.setValue('categories', updatedCategories);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const updatedCategories = [...watchedCategories];
    updatedCategories[categoryIndex].items.splice(itemIndex, 1);
    form.setValue('categories', updatedCategories);
  };

  const updateItem = (
    categoryIndex: number,
    itemIndex: number,
    field: 'quantity' | 'unit',
    value: string | number
  ) => {
    const updatedCategories = [...watchedCategories];
    updatedCategories[categoryIndex].items[itemIndex] = {
      ...updatedCategories[categoryIndex].items[itemIndex],
      [field]: value,
    };
    form.setValue('categories', updatedCategories);
  };

  const onSubmit = async (data: ScopeFormData) => {
    try {
      await saveWorkflowData.mutateAsync({
        categories: data.categories,
      } as Record<string, unknown>);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader
        title='Scope'
        subtitle='Define project scope and requirements'
        showBackButton={true}
        backButtonText='Back to Dashboard'
      />

      {/* Workflow Navigation - Top Icons */}
      <WorkflowNavigation />

      {/* Main Content */}
      <div className='py-6 px-4 pb-20'>
        <div className='max-w-4xl mx-auto'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {fields.map((field, categoryIndex) => (
                <Card key={field.id}>
                  <CardHeader
                    className='cursor-pointer'
                    onClick={() => toggleCategory(categoryIndex)}
                  >
                    <div className='flex items-center justify-between'>
                      <CardTitle>
                        {watchedCategories[categoryIndex]?.name}
                      </CardTitle>
                      <div className='flex items-center space-x-4'>
                        {watchedCategories[categoryIndex]?.expanded ? (
                          <ChevronUp className='h-5 w-5' />
                        ) : (
                          <ChevronDown className='h-5 w-5' />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {watchedCategories[categoryIndex]?.expanded && (
                    <CardContent>
                      <div className='space-y-4'>
                        {watchedCategories[categoryIndex]?.items.map(
                          (item, itemIndex) => (
                            <div
                              key={item.id}
                              className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg'
                            >
                              <div className='flex-1 space-y-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                  <div>
                                    <Label className='text-xs text-gray-500 mb-1 block'>
                                      Item Name
                                    </Label>
                                    <FormField
                                      control={form.control}
                                      name={`categories.${categoryIndex}.items.${itemIndex}.name`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              className='text-sm'
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div>
                                    <Label className='text-xs text-gray-500 mb-1 block'>
                                      Quantity & Unit
                                    </Label>
                                    <div className='flex space-x-2'>
                                      <Input
                                        type='number'
                                        step='0.1'
                                        value={item.quantity}
                                        onChange={(e) =>
                                          updateItem(
                                            categoryIndex,
                                            itemIndex,
                                            'quantity',
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        className='w-20'
                                      />
                                      <Input
                                        value={item.unit}
                                        onChange={(e) =>
                                          updateItem(
                                            categoryIndex,
                                            itemIndex,
                                            'unit',
                                            e.target.value
                                          )
                                        }
                                        className='flex-1'
                                        placeholder='Unit'
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label className='text-xs text-gray-500 mb-1 block'>
                                    Description
                                  </Label>
                                  <FormField
                                    control={form.control}
                                    name={`categories.${categoryIndex}.items.${itemIndex}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Textarea
                                            {...field}
                                            placeholder='Describe the work to be done'
                                            className='text-sm'
                                            rows={2}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div>
                                  <Label className='text-xs text-gray-500 mb-1 block'>
                                    Notes
                                  </Label>
                                  <FormField
                                    control={form.control}
                                    name={`categories.${categoryIndex}.items.${itemIndex}.notes`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Textarea
                                            {...field}
                                            placeholder='Additional notes or special requirements'
                                            className='text-sm'
                                            rows={2}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <div className='flex justify-end'>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                      removeItem(categoryIndex, itemIndex)
                                    }
                                    className='text-red-600 hover:text-red-700'
                                  >
                                    <Trash2 className='h-4 w-4' />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        )}

                        <Button
                          type='button'
                          onClick={() => addItem(categoryIndex)}
                          className='w-full'
                        >
                          <Plus className='h-4 w-4 mr-2' />+ Add Item
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}

              {/* Save Button */}
              <div className='flex justify-end mt-6'>
                <Button type='submit' disabled={saveWorkflowData.isPending}>
                  {saveWorkflowData.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
