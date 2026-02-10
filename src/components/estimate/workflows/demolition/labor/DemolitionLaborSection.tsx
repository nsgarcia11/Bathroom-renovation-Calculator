'use client';

import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { useContractorContext } from '@/contexts/ContractorContext';
import { DEMOLITION_ITEM_ORDER } from '@/lib/constants';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  color?: string;
  scope?: string;
}

interface FlatFeeItem {
  id: string;
  name: string;
  unitPrice: string;
}

interface DemolitionChoices {
  removeFlooring: 'yes' | 'no';
  removeShowerWall: 'yes' | 'no';
  removeShowerBase: 'yes' | 'no';
  removeTub: 'yes' | 'no';
  removeVanity: 'yes' | 'no';
  removeToilet: 'yes' | 'no';
  removeAccessories: 'yes' | 'no';
  removeWall: 'yes' | 'no';
}

export default function DemolitionLaborSection() {
  const {
    getDesignData,
    getLaborItems,
    getFlatFeeItems,
    setLaborItems,
    setFlatFeeItems,
    updateDesign,
    isReloading,
  } = useEstimateWorkflowContext();
  const { hourlyRate: contractorHourlyRate } = useContractorContext();

  // Ref to track if we're in the middle of a user action
  const isUserActionRef = useRef(false);

  // Local state for labor items to handle input changes
  const [localLaborItems, setLocalLaborItems] = useState<LaborItem[]>([]);
  const [localFlatFeeItems, setLocalFlatFeeItems] = useState<FlatFeeItem[]>([]);

  // Get current data from context
  const design = getDesignData<{
    demolitionChoices: DemolitionChoices;
    isDemolitionFlatFee: 'yes' | 'no';
    debrisDisposal: 'yes' | 'no';
    flatFeeAmount: string;
  }>('demolition');

  const demolitionChoices: DemolitionChoices = useMemo(
    () =>
      design?.demolitionChoices || {
        removeFlooring: 'no',
        removeShowerWall: 'no',
        removeShowerBase: 'no',
        removeTub: 'no',
        removeVanity: 'no',
        removeToilet: 'no',
        removeAccessories: 'no',
        removeWall: 'no',
      },
    [design]
  );
  const isDemolitionFlatFee = design?.isDemolitionFlatFee || 'no';
  // const debrisDisposal = design?.debrisDisposal || 'no'; // Not used in labor section

  const contextLaborItems = getLaborItems('demolition');
  const contextFlatFeeItems = getFlatFeeItems('demolition');

  // Sync local state with context data (skip during user edits)
  useEffect(() => {
    if (isUserActionRef.current) return;
    // Always sync with context data, even if arrays are empty
    setLocalLaborItems(contextLaborItems || []);
    setLocalFlatFeeItems(contextFlatFeeItems || []);
  }, [contextLaborItems, contextFlatFeeItems, isReloading]);

  // Use local state for display and editing
  const laborItems = localLaborItems;
  const flatFeeItems = localFlatFeeItems;
  const [isDemolitionOpen, setIsDemolitionOpen] = useState(true);

  // Mapping from labor item IDs to design choice fields
  const laborItemToDesignChoice = useMemo(
    () => ({
      'lab-demo-floor': 'removeFlooring',
      'lab-demo-shower': 'removeShowerWall',
      'lab-demo-shower-base': 'removeShowerBase',
      'lab-demo-tub': 'removeTub',
      'lab-demo-vanity': 'removeVanity',
      'lab-demo-toilet': 'removeToilet',
      'lab-demo-accessories': 'removeAccessories',
      'lab-demo-wall': 'removeWall',
    }),
    []
  );

  // Items are now managed centrally by the context - no useEffect needed

  // Handlers for labor items
  const handleAddLaborItem = useCallback(() => {
    const newItem: LaborItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Custom Labor Task',
      hours: '1',
      rate: contractorHourlyRate.toString(),
    };

    // Update local state immediately
    const updatedLabor = [...localLaborItems, newItem];
    setLocalLaborItems(updatedLabor);

    // Update context
    setLaborItems('demolition', updatedLabor);
  }, [localLaborItems, contractorHourlyRate, setLaborItems]);

  const handleLaborItemChange = useCallback(
    (id: string, field: keyof LaborItem, value: string) => {
      // Set flag to prevent auto-generation from interfering
      isUserActionRef.current = true;

      // Update local state immediately for responsive UI
      setLocalLaborItems((prev) => {
        const updatedLabor = prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        );

        // Update context after a short delay to avoid conflicts
        setTimeout(() => {
          setLaborItems('demolition', updatedLabor);
          isUserActionRef.current = false;
        }, 100);

        return updatedLabor;
      });
    },
    [setLaborItems]
  );

  const handleDeleteLaborItem = useCallback(
    (id: string) => {
      // Set flag to prevent auto-generation from interfering
      isUserActionRef.current = true;

      // Check if this is an auto-generated labor item that should update design choices
      const designChoiceField =
        laborItemToDesignChoice[id as keyof typeof laborItemToDesignChoice];
      if (designChoiceField && !id.startsWith('custom-')) {
        // This is an auto-generated item - update the corresponding design choice to 'no'
        updateDesign('demolition', {
          demolitionChoices: {
            ...demolitionChoices,
            [designChoiceField]: 'no' as const,
          },
        });
      }

      // Update local state immediately for responsive UI
      const updatedLabor = localLaborItems.filter((item) => item.id !== id);
      setLocalLaborItems(updatedLabor);

      // Update context after a short delay to avoid conflicts
      setTimeout(() => {
        setLaborItems('demolition', updatedLabor);
        isUserActionRef.current = false;
      }, 100);
    },
    [
      localLaborItems,
      setLaborItems,
      laborItemToDesignChoice,
      updateDesign,
      demolitionChoices,
    ]
  );

  // Handlers for flat fee items
  const handleAddFlatFeeItem = useCallback(() => {
    const newItem: FlatFeeItem = {
      id: `flat-fee-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Flat Fee Task',
      unitPrice: '0',
    };

    // Update local state immediately
    const updatedFlatFees = [...localFlatFeeItems, newItem];
    setLocalFlatFeeItems(updatedFlatFees);

    // Update context
    setFlatFeeItems('demolition', updatedFlatFees);
  }, [localFlatFeeItems, setFlatFeeItems]);

  const handleFlatFeeItemChange = useCallback(
    (id: string, field: keyof FlatFeeItem, value: string) => {
      // Update local state immediately
      const updatedFlatFees = localFlatFeeItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
      setLocalFlatFeeItems(updatedFlatFees);

      // Update context
      setFlatFeeItems('demolition', updatedFlatFees);
    },
    [localFlatFeeItems, setFlatFeeItems]
  );

  const handleDeleteFlatFeeItem = useCallback(
    (id: string) => {
      // Update local state immediately
      const updatedFlatFees = localFlatFeeItems.filter(
        (item) => item.id !== id
      );
      setLocalFlatFeeItems(updatedFlatFees);

      // Update context
      setFlatFeeItems('demolition', updatedFlatFees);
    },
    [localFlatFeeItems, setFlatFeeItems]
  );

  // Memoized calculations
  const labor = useMemo(() => laborItems || [], [laborItems]);
  const flatFees = useMemo(() => flatFeeItems || [], [flatFeeItems]);

  // Filter and sort demolition tasks according to standardized order
  const demolitionTasks = useMemo(() => {
    const filtered = labor.filter(
      (item) =>
        item && (item.id.startsWith('lab-') || item.id.startsWith('labor-'))
    );

    // Sort items according to DEMOLITION_ITEM_ORDER
    return filtered.sort((a, b) => {
      const aIndex = DEMOLITION_ITEM_ORDER.findIndex((orderKey) => {
        const laborConfigs = {
          removeFlooring: 'lab-demo-floor',
          removeShowerWall: 'lab-demo-shower',
          removeShowerBase: 'lab-demo-shower-base',
          removeTub: 'lab-demo-tub',
          removeVanity: 'lab-demo-vanity',
          removeToilet: 'lab-demo-toilet',
          removeAccessories: 'lab-demo-accessories',
          removeWall: 'lab-demo-wall',
        };
        return a.id === laborConfigs[orderKey];
      });

      const bIndex = DEMOLITION_ITEM_ORDER.findIndex((orderKey) => {
        const laborConfigs = {
          removeFlooring: 'lab-demo-floor',
          removeShowerWall: 'lab-demo-shower',
          removeShowerBase: 'lab-demo-shower-base',
          removeTub: 'lab-demo-tub',
          removeVanity: 'lab-demo-vanity',
          removeToilet: 'lab-demo-toilet',
          removeAccessories: 'lab-demo-accessories',
          removeWall: 'lab-demo-wall',
        };
        return b.id === laborConfigs[orderKey];
      });

      // If both items are in the order, sort by order
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      // If only one is in the order, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // If neither is in the order, maintain original order
      return 0;
    });
  }, [labor]);

  // Filter custom tasks
  const customTasks = useMemo(
    () => labor.filter((item) => item && item.id.startsWith('custom-')),
    [labor]
  );

  // Calculate totals
  const demolitionTotal = useMemo(
    () =>
      demolitionTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [demolitionTasks]
  );

  const customTasksTotal = useMemo(
    () =>
      customTasks.reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      ),
    [customTasks]
  );

  const hourlyTotal = useMemo(
    () => demolitionTotal + customTasksTotal,
    [demolitionTotal, customTasksTotal]
  );

  const flatFeeTotal = useMemo(
    () =>
      flatFees.reduce(
        (sum, item) => sum + (parseFloat(item.unitPrice) || 0),
        0
      ),
    [flatFees]
  );

  const total = useMemo(
    () => (isDemolitionFlatFee === 'yes' ? flatFeeTotal : hourlyTotal),
    [isDemolitionFlatFee, flatFeeTotal, hourlyTotal]
  );

  // Calculate total hours
  const totalHours = useMemo(() => {
    if (isDemolitionFlatFee === 'yes') return 0;
    return (
      demolitionTasks.reduce(
        (sum, item) => sum + (parseFloat(item.hours) || 0),
        0
      ) +
      customTasks.reduce((sum, item) => sum + (parseFloat(item.hours) || 0), 0)
    );
  }, [isDemolitionFlatFee, demolitionTasks, customTasks]);

  const renderLaborItem = useCallback(
    (item: LaborItem) => {
      if (!item) return null;
      return (
        <div
          key={item.id}
          className={`p-3 rounded-lg border bg-white shadow-sm w-full ${
            item.color || 'border-slate-200'
          }`}
        >
          <div className='flex items-center gap-2 mb-2 w-full'>
            <Input
              type='text'
              value={item.name}
              onChange={(e) =>
                handleLaborItemChange(item.id, 'name', e.target.value)
              }
              placeholder='Labor Task'
              className='border-b-2 border-t-0 border-l-0 border-r-0 border-blue-300 focus:border-blue-500 focus:outline-none bg-transparent w-44 sm:w-full'
            />
            <Button
              onClick={() => handleDeleteLaborItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto flex-shrink-0'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-2 gap-3 w-full'>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Hours</label>
              <Input
                type='number'
                value={item.hours}
                onChange={(e) =>
                  handleLaborItemChange(item.id, 'hours', e.target.value)
                }
                placeholder='0'
                className='text-center w-full border-blue-300 focus:border-blue-500'
              />
            </div>
            <div className='w-full'>
              <label className='text-xs text-slate-500'>Rate ($/hr)</label>
              <Input
                type='number'
                value={item.rate}
                onChange={(e) =>
                  handleLaborItemChange(item.id, 'rate', e.target.value)
                }
                placeholder='0'
                className='text-center w-full border-blue-300 focus:border-blue-500'
              />
            </div>
            <div className='col-span-2 w-full'>
              <label className='text-xs text-slate-500'>Total</label>
              <div className='w-full p-2 text-center font-semibold text-slate-800 bg-slate-50 rounded-md'>
                $
                {(
                  (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [handleLaborItemChange, handleDeleteLaborItem]
  );

  const renderFlatFeeItem = (item: FlatFeeItem) => {
    const isDemoFee = item.id === 'flat-fee-demolition';
    return (
      <div
        key={item.id}
        className={`p-3 rounded-lg border shadow-sm w-full ${
          isDemoFee ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'
        }`}
      >
        <div className='flex items-center gap-2 mb-2 w-full'>
          <Input
            type='text'
            value={item.name}
            onChange={(e) =>
              handleFlatFeeItemChange(item.id, 'name', e.target.value)
            }
            placeholder='Flat Fee Task'
            className={`border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent border-blue-300 focus:border-blue-500 focus:outline-none w-44 sm:w-full`}
            readOnly={isDemoFee}
          />
          {!isDemoFee && (
            <Button
              onClick={() => handleDeleteFlatFeeItem(item.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto flex-shrink-0'
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
        <div className='w-full'>
          <label className='text-xs text-slate-500'>Total ($)</label>
          <Input
            type='number'
            value={item.unitPrice}
            onChange={(e) =>
              handleFlatFeeItemChange(item.id, 'unitPrice', e.target.value)
            }
            placeholder='0.00'
            className='text-center w-full border-b-2 border-t-0 border-l-0 border-r-0 border-blue-500 focus:border-blue-500'
            readOnly={isDemoFee}
          />
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-baseline'>
        <h2 className='text-2xl font-bold text-slate-800'>Labor</h2>
        {isDemolitionFlatFee === 'no' && totalHours > 0 && (
          <div className='flex items-center gap-2 text-sm text-slate-600'>
            <span className='font-semibold text-xl text-slate-800'>
              {totalHours.toFixed(1)} hrs
            </span>
          </div>
        )}
        <div className='flex items-center gap-2 text-sm text-slate-600'>
          <span className='font-semibold text-xl text-blue-600'>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className='space-y-4'>
        {isDemolitionFlatFee === 'yes' ? (
          /* Flat Fee Mode */
          <Card>
            <CardContent className='p-3 space-y-3'>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => setIsDemolitionOpen(!isDemolitionOpen)}
              >
                <div className='flex items-center gap-2 justify-between w-full'>
                  <div className='flex items-center gap-2'>
                    {isDemolitionOpen ? (
                      <ChevronDown className='h-4 w-4 text-slate-600' />
                    ) : (
                      <ChevronRight className='h-4 w-4 text-slate-600' />
                    )}
                    <h3 className='text-lg font-semibold text-slate-700 md:text-nowrap'>
                      Demolition & Prep
                    </h3>
                  </div>
                  <span className='text-sm text-slate-500'>
                    {totalHours.toFixed(1)} hrs
                  </span>
                  <p className='font-bold text-blue-600 text-sm'>
                    ${flatFeeTotal.toFixed(2)}
                  </p>
                </div>
              </div>
              {isDemolitionOpen && (
                <>
                  {flatFees.length > 0 ? (
                    flatFees.map(renderFlatFeeItem)
                  ) : (
                    <p className='text-sm text-slate-500 text-center py-4'>
                      No flat fee tasks added.
                    </p>
                  )}
                  <div className='flex justify-center'>
                    <Button
                      onClick={handleAddFlatFeeItem}
                      variant='default'
                      className='w-auto mt-2 flex items-center justify-center gap-2 py-2.5 px-4  text-white font-semibold border-blue-200'
                    >
                      <Plus size={16} />
                      Add Item
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Hourly Mode */
          <>
            {/* Demolition & Prep Section - Always show */}
            <Card>
              <CardContent className='p-3 space-y-3'>
                <div
                  className='flex items-center cursor-pointer'
                  onClick={() => setIsDemolitionOpen(!isDemolitionOpen)}
                >
                  <div className='flex items-center gap-2 justify-between w-full'>
                    <div className='flex items-center gap-2'>
                      {isDemolitionOpen ? (
                        <ChevronDown className='h-4 w-4 text-slate-600' />
                      ) : (
                        <ChevronRight className='h-4 w-4 text-slate-600' />
                      )}
                      <h3 className='text-lg font-semibold text-slate-700 md:text-nowrap'>
                        Demolition & Prep
                      </h3>
                    </div>
                    <span className='text-sm text-slate-500'>
                      {totalHours.toFixed(1)} hrs
                    </span>
                    <p className='font-bold text-blue-600 text-sm'>
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
                {isDemolitionOpen && (
                  <>
                    {demolitionTasks.length > 0 ? (
                      <div className='space-y-2'>
                        {demolitionTasks.map(renderLaborItem)}
                      </div>
                    ) : (
                      <p className='text-sm text-slate-500 text-center py-4'>
                        No demolition tasks added.
                      </p>
                    )}

                    {/* Custom Tasks Section */}
                    {customTasks.length > 0 && (
                      <div className='mt-4 pt-4 border-t border-slate-200'>
                        <div className='space-y-2'>
                          {customTasks.map(renderLaborItem)}
                        </div>
                      </div>
                    )}

                    <div className='flex justify-center'>
                      <Button
                        onClick={handleAddLaborItem}
                        variant='default'
                        className='w-auto mt-2 flex items-center justify-center gap-2 py-2.5 px-4  text-white font-semibold border-blue-200'
                      >
                        <Plus size={16} />
                        Add Item
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
