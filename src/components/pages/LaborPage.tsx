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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { ChevronUp, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const laborItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  description: z.string(),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  rate: z.number().min(0, 'Rate must be positive'),
  total: z.number().min(0, 'Total must be positive'),
});

const laborCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Category name is required'),
  items: z.array(laborItemSchema),
  total_hours: z.number().min(0),
  total_cost: z.number().min(0),
  expanded: z.boolean(),
});

const laborSchema = z.object({
  categories: z.array(laborCategorySchema),
});

type LaborFormData = z.infer<typeof laborSchema>;

export function LaborPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const saveWorkflowData = useSaveWorkflowData('labor');

  const form = useForm<LaborFormData>({
    resolver: zodResolver(laborSchema),
    defaultValues: {
      categories: [
        {
          id: '1',
          name: 'Demolition',
          items: [
            {
              id: '1-1',
              name: 'Remove existing shower',
              description: 'Includes tile, pan, glass enclosure',
              quantity: 2.2,
              unit: 'hrs',
              rate: 85,
              total: 187.0,
            },
            {
              id: '1-2',
              name: 'Remove vanity & toilet',
              description: '',
              quantity: 1.5,
              unit: 'hrs',
              rate: 85,
              total: 127.5,
            },
          ],
          total_hours: 3.7,
          total_cost: 314.5,
          expanded: true,
        },
        {
          id: '2',
          name: 'Framing & Rough-in',
          items: [
            {
              id: '2-1',
              name: 'Framing for new shower',
              description: '',
              quantity: 8.8,
              unit: 'hrs',
              rate: 85,
              total: 748.0,
            },
            {
              id: '2-2',
              name: 'Plumbing rough-in',
              description: '',
              quantity: 2.2,
              unit: 'hrs',
              rate: 85,
              total: 187.0,
            },
          ],
          total_hours: 11.0,
          total_cost: 935.0,
          expanded: true,
        },
      ],
    },
  });

  const { fields, update } = useFieldArray({
    control: form.control,
    name: 'categories',
  });

  const watchedCategories = form.watch('categories');
  const grandTotal = watchedCategories.reduce(
    (sum, category) => sum + category.total_cost,
    0
  );
  const grandTotalHours = watchedCategories.reduce(
    (sum, category) => sum + category.total_hours,
    0
  );

  useEffect(() => {
    if (user) {
      loadLaborData();
    }
  }, [user]);

  const loadLaborData = async () => {
    setLoading(false);
  };

  const updateItem = (
    categoryIndex: number,
    itemIndex: number,
    field: 'quantity' | 'rate',
    value: number
  ) => {
    const category = watchedCategories[categoryIndex];
    const updatedItems = category.items.map((item, idx) => {
      if (idx === itemIndex) {
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.rate;
        return updated;
      }
      return item;
    });

    const total_hours = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const total_cost = updatedItems.reduce((sum, item) => sum + item.total, 0);

    update(categoryIndex, {
      ...category,
      items: updatedItems,
      total_hours,
      total_cost,
    });
  };

  const addItem = (categoryIndex: number) => {
    const category = watchedCategories[categoryIndex];
    const newItem = {
      id: `${category.id}-${category.items.length + 1}`,
      name: 'New Labor Item',
      description: '',
      quantity: 0,
      unit: 'hrs',
      rate: 0,
      total: 0,
    };

    const updatedItems = [...category.items, newItem];
    const total_hours = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const total_cost = updatedItems.reduce((sum, item) => sum + item.total, 0);

    update(categoryIndex, {
      ...category,
      items: updatedItems,
      total_hours,
      total_cost,
    });
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const category = watchedCategories[categoryIndex];
    const updatedItems = category.items.filter((_, idx) => idx !== itemIndex);
    const total_hours = updatedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const total_cost = updatedItems.reduce((sum, item) => sum + item.total, 0);

    update(categoryIndex, {
      ...category,
      items: updatedItems,
      total_hours,
      total_cost,
    });
  };

  const toggleCategory = (categoryIndex: number) => {
    const category = watchedCategories[categoryIndex];
    update(categoryIndex, {
      ...category,
      expanded: !category.expanded,
    });
  };

  const onSubmit = async (data: LaborFormData) => {
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
        title='Labor Estimate'
        subtitle='Manage labor costs and time estimates'
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
                        <div className='text-right'>
                          <div className='text-sm text-gray-600'>
                            {watchedCategories[
                              categoryIndex
                            ]?.total_hours.toFixed(2)}{' '}
                            hrs
                          </div>
                          <div className='text-lg font-semibold text-gray-900'>
                            {formatCurrency(
                              watchedCategories[categoryIndex]?.total_cost || 0
                            )}
                          </div>
                        </div>
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
                              className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg'
                            >
                              <div className='flex-1'>
                                <div className='flex items-center space-x-4'>
                                  <div className='w-32'>
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
                                  <div className='flex-1 grid grid-cols-2 gap-4'>
                                    <div>
                                      <Label className='text-xs text-gray-500 mb-1 block'>
                                        Hours
                                      </Label>
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
                                      />
                                    </div>
                                    <div>
                                      <Label className='text-xs text-gray-500 mb-1 block'>
                                        Rate
                                      </Label>
                                      <div className='flex'>
                                        <span className='inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg'>
                                          $
                                        </span>
                                        <Input
                                          type='number'
                                          step='0.01'
                                          value={item.rate}
                                          onChange={(e) =>
                                            updateItem(
                                              categoryIndex,
                                              itemIndex,
                                              'rate',
                                              parseFloat(e.target.value) || 0
                                            )
                                          }
                                          className='rounded-l-none'
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className='w-24 text-right'>
                                    <Label className='text-xs text-gray-500 mb-1 block'>
                                      Total
                                    </Label>
                                    <div className='text-sm font-medium text-gray-900'>
                                      {formatCurrency(item.total)}
                                    </div>
                                  </div>
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

              {/* Grand Total */}
              <Card className='bg-gray-100'>
                <CardContent className='py-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-semibold text-gray-900'>
                      Total Labor Cost
                    </span>
                    <div className='text-right'>
                      <div className='text-sm text-gray-600'>
                        {grandTotalHours.toFixed(2)} hrs
                      </div>
                      <div className='text-xl font-bold text-gray-900'>
                        CAD{formatCurrency(grandTotal).replace('CA$', '')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
