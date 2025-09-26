'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { WorkflowNotesSection } from '@/components/estimate/shared/WorkflowNotesSection';
import { CollapsibleSection } from '@/components/estimate/shared/CollapsibleSection';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { TRADE_CATEGORIES, TRADE_TASKS } from '@/lib/constants';
import { DollarSign, Clock } from 'lucide-react';

interface TradeDesignData {
  // Selected trades
  selectedTrades: string[];

  // Trade rates
  tradeRates: Record<string, number>;

  // Selected tasks for each trade
  projectChoices: Record<string, Array<{ id: string; quantity: number }>>;

  // Task customizations
  taskInfo: Record<
    string,
    {
      pricingModel: 'flat' | 'hourly';
      price: number;
      hours: number;
      quantity: number;
    }
  >;

  // Notes
  designContractorNotes: string;
  designClientNotes: string;
  constructionContractorNotes: string;
  constructionClientNotes: string;

  [key: string]: unknown;
}

export function TradeSection() {
  const { getDesignData, updateDesign } = useEstimateWorkflowContext();

  const designData = getDesignData('trade') as TradeDesignData | null;
  const design = useMemo(
    () =>
      designData || {
        selectedTrades: [],
        tradeRates: Object.fromEntries(
          Object.entries(TRADE_CATEGORIES).map(([key, category]) => [
            key,
            category.defaultRate,
          ])
        ),
        projectChoices: {},
        taskInfo: {},
        designContractorNotes: '',
        designClientNotes: '',
        constructionContractorNotes: '',
        constructionClientNotes: '',
      },
    [designData]
  );

  // Local state for immediate UI updates
  const [localDesign, setLocalDesign] = useState<TradeDesignData>(design);

  // Sync local state with context
  useEffect(() => {
    setLocalDesign(design);
  }, [design]);

  const setDesign = useCallback(
    (updates: Partial<TradeDesignData>) => {
      setLocalDesign((prev) => ({ ...prev, ...updates }));
      updateDesign('trade', updates);
    },
    [updateDesign]
  );

  const handleTradeToggle = useCallback(
    (tradeId: string, enabled: boolean) => {
      const newSelectedTrades = enabled
        ? [...localDesign.selectedTrades, tradeId]
        : localDesign.selectedTrades.filter((id) => id !== tradeId);

      setDesign({ selectedTrades: newSelectedTrades });
    },
    [localDesign.selectedTrades, setDesign]
  );

  const handleTaskToggle = useCallback(
    (tradeId: string, taskId: string, enabled: boolean) => {
      const currentChoices = localDesign.projectChoices?.[tradeId] || [];
      const newChoices = enabled
        ? [...currentChoices, { id: taskId, quantity: 1 }]
        : currentChoices.filter((choice) => choice.id !== taskId);

      setDesign({
        projectChoices: {
          ...localDesign.projectChoices,
          [tradeId]: newChoices,
        },
      });
    },
    [localDesign.projectChoices, setDesign]
  );

  const handleTaskQuantityChange = useCallback(
    (tradeId: string, taskId: string, quantity: number) => {
      const currentChoices = localDesign.projectChoices?.[tradeId] || [];
      const updatedChoices = currentChoices.map((choice) =>
        choice.id === taskId ? { ...choice, quantity } : choice
      );

      setDesign({
        projectChoices: {
          ...localDesign.projectChoices,
          [tradeId]: updatedChoices,
        },
      });
    },
    [localDesign.projectChoices, setDesign]
  );

  const handleRateChange = useCallback(
    (tradeId: string, rate: number) => {
      setDesign({
        tradeRates: {
          ...localDesign.tradeRates,
          [tradeId]: rate,
        },
      });
    },
    [localDesign.tradeRates, setDesign]
  );

  const handleTaskInfoChange = useCallback(
    (taskId: string, field: string, value: string | number) => {
      const currentTaskInfo = localDesign.taskInfo[taskId] || {
        pricingModel: 'flat' as const,
        price: 0,
        hours: 0,
        quantity: 1,
      };

      setDesign({
        taskInfo: {
          ...localDesign.taskInfo,
          [taskId]: {
            ...currentTaskInfo,
            [field]: value,
          },
        },
      });
    },
    [localDesign.taskInfo, setDesign]
  );

  return (
    <div className='space-y-6'>
      <div className='pt-2'>
        <h1 className='text-4xl font-bold text-slate-800 text-left'>Trade</h1>
      </div>

      {/* Trade Selection Card */}
      <CollapsibleSection
        title='Trade Selection'
        colorScheme='neutral'
        summary={
          <span className='text-blue-900 font-bold text-lg'>
            {localDesign.selectedTrades.length} trades selected
          </span>
        }
      >
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {Object.entries(TRADE_CATEGORIES).map(([tradeId, category]) => (
            <div
              key={tradeId}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                localDesign.selectedTrades.includes(tradeId)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() =>
                handleTradeToggle(
                  tradeId,
                  !localDesign.selectedTrades.includes(tradeId)
                )
              }
            >
              <div className='flex flex-col items-center text-center'>
                <div className='text-2xl mb-2'>{category.icon}</div>
                <h3 className={`font-semibold ${category.color}`}>
                  {category.name}
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  ${localDesign.tradeRates?.[tradeId] || category.defaultRate}
                  /hr
                </p>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Trade Rates Card */}
      <CollapsibleSection title='Trade Rates' colorScheme='design'>
        <div className='space-y-4'>
          {localDesign.selectedTrades.map((tradeId) => {
            const category =
              TRADE_CATEGORIES[tradeId as keyof typeof TRADE_CATEGORIES];
            return (
              <div
                key={tradeId}
                className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <span className='text-xl'>{category.icon}</span>
                  <span className={`font-semibold ${category.color}`}>
                    {category.name}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <DollarSign className='h-4 w-4 text-gray-500' />
                  <Input
                    type='number'
                    value={(
                      localDesign.tradeRates?.[tradeId] || category.defaultRate
                    ).toString()}
                    onChange={(e) =>
                      handleRateChange(tradeId, parseFloat(e.target.value) || 0)
                    }
                    className='w-20 text-center'
                    aria-label={`${category.name} hourly rate`}
                  />
                  <span className='text-sm text-gray-600'>/hr</span>
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Task Selection Card */}
      <CollapsibleSection title='Task Selection' colorScheme='construction'>
        <div className='space-y-6'>
          {localDesign.selectedTrades.map((tradeId) => {
            const category =
              TRADE_CATEGORIES[tradeId as keyof typeof TRADE_CATEGORIES];
            const tasks =
              TRADE_TASKS[tradeId as keyof typeof TRADE_TASKS] || [];
            const selectedTasks = localDesign.projectChoices?.[tradeId] || [];

            return (
              <div
                key={tradeId}
                className='border border-gray-200 rounded-lg p-4'
              >
                <div className='flex items-center gap-2 mb-4'>
                  <span className='text-lg'>{category.icon}</span>
                  <h3 className={`font-semibold text-lg ${category.color}`}>
                    {category.name} Tasks
                  </h3>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {tasks.map((task) => {
                    const isSelected = selectedTasks.some(
                      (choice) => choice.id === task.id
                    );
                    const selectedChoice = selectedTasks.find(
                      (choice) => choice.id === task.id
                    );
                    const taskInfo = localDesign.taskInfo?.[task.id];

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center gap-2'>
                            <input
                              type='checkbox'
                              id={`task-${task.id}`}
                              checked={isSelected}
                              onChange={(e) =>
                                handleTaskToggle(
                                  tradeId,
                                  task.id,
                                  e.target.checked
                                )
                              }
                              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                            />
                            <label
                              htmlFor={`task-${task.id}`}
                              className='font-medium'
                            >
                              {task.name}
                            </label>
                          </div>
                          <div className='flex items-center gap-1 text-sm text-gray-500'>
                            {task.pricingModel === 'flat' ? (
                              <DollarSign className='h-3 w-3' />
                            ) : (
                              <Clock className='h-3 w-3' />
                            )}
                            <span>{task.pricingModel}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <Label className='text-xs text-gray-600'>
                                Quantity:
                              </Label>
                              <Input
                                type='number'
                                value={(
                                  selectedChoice?.quantity || 1
                                ).toString()}
                                onChange={(e) =>
                                  handleTaskQuantityChange(
                                    tradeId,
                                    task.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className='w-16 h-8 text-center text-sm'
                              />
                            </div>

                            <div className='flex items-center gap-2'>
                              <Label className='text-xs text-gray-600'>
                                Pricing:
                              </Label>
                              <Select
                                id={`pricing-${task.id}`}
                                label=''
                                value={
                                  taskInfo?.pricingModel || task.pricingModel
                                }
                                onChange={(e) =>
                                  handleTaskInfoChange(
                                    task.id,
                                    'pricingModel',
                                    e.target.value as 'flat' | 'hourly'
                                  )
                                }
                                className='text-xs border border-gray-300 rounded px-2 py-1'
                              >
                                <option value='flat'>Flat Rate</option>
                                <option value='hourly'>Hourly</option>
                              </Select>
                            </div>

                            {taskInfo?.pricingModel === 'flat' ||
                            task.pricingModel === 'flat' ? (
                              <div className='flex items-center gap-2'>
                                <Label className='text-xs text-gray-600'>
                                  Price:
                                </Label>
                                <div className='flex items-center gap-1'>
                                  <DollarSign className='h-3 w-3 text-gray-500' />
                                  <Input
                                    type='number'
                                    value={(
                                      taskInfo?.price || task.defaultPrice
                                    ).toString()}
                                    onChange={(e) =>
                                      handleTaskInfoChange(
                                        task.id,
                                        'price',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className='w-20 h-8 text-center text-sm'
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className='flex items-center gap-2'>
                                <Label className='text-xs text-gray-600'>
                                  Hours:
                                </Label>
                                <div className='flex items-center gap-1'>
                                  <Clock className='h-3 w-3 text-gray-500' />
                                  <Input
                                    type='number'
                                    value={(
                                      taskInfo?.hours || task.defaultHours
                                    ).toString()}
                                    onChange={(e) =>
                                      handleTaskInfoChange(
                                        task.id,
                                        'hours',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className='w-16 h-8 text-center text-sm'
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Design Notes */}
      <CollapsibleSection title='Design Notes' colorScheme='design'>
        <WorkflowNotesSection
          contractorNotes={localDesign.designContractorNotes || ''}
          clientNotes={localDesign.designClientNotes || ''}
          onContractorNotesChange={(notes) => {
            setDesign({ designContractorNotes: notes });
          }}
          onClientNotesChange={(notes) => {
            setDesign({ designClientNotes: notes });
          }}
          title='Design Notes'
          placeholder='Add design-specific notes here...'
          contractorTags={[
            'Trade Selection',
            'Rate Negotiations',
            'Task Specifications',
            'Timeline Requirements',
            'Quality Standards',
          ]}
          clientTags={[
            'Trade Preferences',
            'Budget Considerations',
            'Timeline Requirements',
            'Quality Expectations',
            'Communication Preferences',
          ]}
          useTabs={true}
          alwaysExpanded={true}
        />
      </CollapsibleSection>

      {/* Construction Notes */}
      <CollapsibleSection title='Construction Notes' colorScheme='construction'>
        <WorkflowNotesSection
          contractorNotes={localDesign.constructionContractorNotes || ''}
          clientNotes={localDesign.constructionClientNotes || ''}
          onContractorNotesChange={(notes) => {
            setDesign({ constructionContractorNotes: notes });
          }}
          onClientNotesChange={(notes) => {
            setDesign({ constructionClientNotes: notes });
          }}
          title='Construction Notes'
          placeholder='Add construction-specific notes here...'
          contractorTags={[
            'Coordination Requirements',
            'Access Constraints',
            'Safety Considerations',
            'Quality Standards',
            'Warranty Information',
          ]}
          clientTags={[
            'Timeline Requirements',
            'Access Constraints',
            'Noise Restrictions',
            'Quality Standards',
            'Warranty Information',
          ]}
          useTabs={true}
          alwaysExpanded={true}
        />
      </CollapsibleSection>
    </div>
  );
}
