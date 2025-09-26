/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, {
  useMemo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { DEMOLITION_MATERIALS_ITEMS } from '@/lib/constants';

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  color?: string;
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

export default function DemolitionMaterialsSection() {
  const { getDesignData, getMaterialItems, setMaterialItems, isReloading } =
    useEstimateWorkflowContext();

  // Ref to track if we're in the middle of a user action
  const isUserActionRef = useRef(false);
  // Ref to track if we've already processed the current demolition choices
  const processedChoicesRef = useRef<string>('');

  // Local state for materials to handle input changes
  const [localMaterials, setLocalMaterials] = useState<MaterialItem[]>([]);

  // Get current data from context
  const design = getDesignData<{
    demolitionChoices: DemolitionChoices;
    isDemolitionFlatFee: 'yes' | 'no';
    debrisDisposal: 'yes' | 'no';
  }>('demolition');

  const demolitionChoices = design?.demolitionChoices || {
    removeFlooring: 'no',
    removeShowerWall: 'no',
    removeShowerBase: 'no',
    removeTub: 'no',
    removeVanity: 'no',
    removeToilet: 'no',
    removeAccessories: 'no',
    removeWall: 'no',
  };
  const isDemolitionFlatFee = design?.isDemolitionFlatFee || 'no';
  const debrisDisposal = design?.debrisDisposal || 'no';

  // Get current materials from context
  const contextMaterials = getMaterialItems('demolition');

  // Sync local state with context data
  useEffect(() => {
    // Always sync with context data, even if arrays are empty
    setLocalMaterials(contextMaterials || []);
  }, [contextMaterials]);

  // Use local state for display and editing
  const materials = localMaterials;

  // Helper function to generate materials based on business rules
  const generateMaterials = useCallback(
    (
      choices: DemolitionChoices,
      isFlatFee: boolean,
      disposal: string
    ): MaterialItem[] => {
      const materials: MaterialItem[] = [];
      const hasAnyDemolitionTask = choices
        ? Object.values(choices).some((choice) => choice === 'yes')
        : false;

      if (isFlatFee) {
        // Flat-fee = YES: Skip Bags & Masks (assumed included in flat-fee)
        // Only add Disposal Fee if toggle = YES
        if (disposal === 'yes') {
          materials.push(DEMOLITION_MATERIALS_ITEMS.debrisDisposal);
        }
      } else {
        // Flat-fee = NO: If any demolition task is selected → auto add bags + masks
        if (hasAnyDemolitionTask) {
          materials.push(DEMOLITION_MATERIALS_ITEMS.contractorBags);
          materials.push(DEMOLITION_MATERIALS_ITEMS.dustMasks);
        }

        // Debris disposal = YES (applies in both flat-fee and hourly)
        if (disposal === 'yes') {
          materials.push(DEMOLITION_MATERIALS_ITEMS.debrisDisposal);
        }
      }

      return materials;
    },
    []
  );

  // Initialize materials only on first load - DISABLED to prevent overwriting saved data
  // useEffect(() => {
  //   if ((!materials || materials.length === 0) && !isReloading) {
  //     const autoMaterials = generateMaterials(
  //       demolitionChoices,
  //       isDemolitionFlatFee === 'yes',
  //       debrisDisposal
  //     );
  //     setMaterialItems('demolition', autoMaterials);
  //   }
  // }, []); // Only run once on mount - intentionally empty dependency array

  // Update auto-generated materials when demolition choices change (separate from user actions)
  useEffect(() => {
    // Don't run if user is currently making changes or if we're reloading data
    if (isUserActionRef.current || isReloading) return;

    // If we have data from context (Supabase), never override it with defaults
    if (contextMaterials && contextMaterials.length > 0) {
      return;
    }

    // Create a key for the current choices to prevent reprocessing
    const choicesKey = JSON.stringify({
      demolitionChoices,
      isDemolitionFlatFee,
      debrisDisposal,
    });
    if (processedChoicesRef.current === choicesKey) return;

    const currentMaterials = materials || [];
    const existingAutoMaterials = currentMaterials.filter(
      (material) => !material.id.startsWith('mat-custom-')
    );

    // If there are already auto-generated materials, don't regenerate them
    // This preserves user modifications
    if (existingAutoMaterials.length > 0) {
      processedChoicesRef.current = choicesKey;
      return;
    }

    // Only generate new materials if we have no materials at all (initial load)
    if (currentMaterials.length === 0) {
      const newAutoMaterials = generateMaterials(
        demolitionChoices,
        isDemolitionFlatFee === 'yes',
        debrisDisposal
      );

      if (newAutoMaterials.length > 0) {
        setMaterialItems('demolition', newAutoMaterials);
        processedChoicesRef.current = choicesKey;
      }
    }
  }, [
    demolitionChoices,
    isDemolitionFlatFee,
    debrisDisposal,
    generateMaterials,
    materials,
    contextMaterials,
  ]); // Added contextMaterials to prevent overriding Supabase data

  // Handlers for materials
  const handleAddCustomSupply = useCallback(() => {
    const newMaterial: MaterialItem = {
      id: `mat-custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Custom Material',
      quantity: '1',
      price: '',
      unit: 'each',
    };

    // Update local state immediately
    const updatedMaterials = [...localMaterials, newMaterial];
    setLocalMaterials(updatedMaterials);

    // Update context
    setMaterialItems('demolition', updatedMaterials);
  }, [localMaterials, setMaterialItems]);

  const handleConstructionMaterialChange = useCallback(
    (id: string, field: keyof MaterialItem, value: string) => {
      // Set flag to prevent auto-generation from interfering
      isUserActionRef.current = true;

      // Update local state immediately for responsive UI
      const updatedMaterials = localMaterials.map((material) =>
        material.id === id ? { ...material, [field]: value } : material
      );
      setLocalMaterials(updatedMaterials);

      // Update context after a short delay to avoid conflicts
      setTimeout(() => {
        setMaterialItems('demolition', updatedMaterials);
        isUserActionRef.current = false;
      }, 100);
    },
    [localMaterials, setMaterialItems]
  );

  const handleDeleteMaterial = useCallback(
    (id: string) => {
      // Set flag to prevent auto-generation from interfering
      isUserActionRef.current = true;

      // Update local state immediately for responsive UI
      const updatedMaterials = localMaterials.filter(
        (material) => material.id !== id
      );
      setLocalMaterials(updatedMaterials);

      // Update context after a short delay to avoid conflicts
      setTimeout(() => {
        setMaterialItems('demolition', updatedMaterials);
        isUserActionRef.current = false;
      }, 100);
    },
    [localMaterials, setMaterialItems]
  );

  const total = useMemo(
    () =>
      materials.reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      ),
    [materials]
  );

  const renderMaterialItem = useCallback(
    (material: MaterialItem) => {
      return (
        <div
          key={material.id}
          className={`p-3 bg-white rounded-lg border ${
            material.color || 'border-slate-300'
          }`}
        >
          <div className='flex items-center gap-2 mb-2'>
            <Input
              type='text'
              value={material.name}
              onChange={(e) =>
                handleConstructionMaterialChange(
                  material.id,
                  'name',
                  e.target.value
                )
              }
              placeholder='Supply Name'
              className={`border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent border-blue-300 focus:border-blue-500 focus:outline-none`}
            />
            <Button
              onClick={() => handleDeleteMaterial(material.id)}
              variant='ghost'
              size='sm'
              className='text-red-500 hover:text-red-700 p-1 h-auto'
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <label className='text-xs text-slate-500'>Quantity</label>
              <Input
                type='number'
                value={material.quantity}
                onChange={(e) =>
                  handleConstructionMaterialChange(
                    material.id,
                    'quantity',
                    e.target.value
                  )
                }
                placeholder='0'
                className={`text-center border-blue-300 focus:border-blue-500`}
              />
            </div>
            <div>
              <label className='text-xs text-slate-500'>Price/Unit ($)</label>
              <Input
                type='number'
                value={material.price}
                onChange={(e) =>
                  handleConstructionMaterialChange(
                    material.id,
                    'price',
                    e.target.value
                  )
                }
                placeholder='0.00'
                className={`text-center border-blue-300 focus:border-blue-500`}
              />
            </div>
            <div>
              <label className='text-xs text-slate-500'>Total</label>
              <div className='w-full p-2 text-center font-semibold text-slate-800 bg-slate-50 rounded-md'>
                $
                {(
                  (parseFloat(material.quantity) || 0) *
                  (parseFloat(material.price) || 0)
                ).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      );
    },
    [handleConstructionMaterialChange]
  );

  return (
    <div className='space-y-5'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-slate-800'>
          Materials & Supplies
        </h2>
        <p className='font-bold text-blue-600 text-lg'>${total.toFixed(2)}</p>
      </div>

      <Card>
        <CardContent className='p-3 space-y-3'>
          {materials.length > 0 ? (
            materials.map((m) => renderMaterialItem(m))
          ) : (
            <p className='text-sm text-slate-500 text-center py-4'>
              No supplies or disposal fees needed.
            </p>
          )}
          <div className='flex justify-center'>
            <Button
              onClick={handleAddCustomSupply}
              variant='default'
              className='w-auto mt-2 flex items-center justify-center gap-2 py-2.5 px-4  text-white font-semibold border-blue-200'
            >
              <Plus size={16} />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
