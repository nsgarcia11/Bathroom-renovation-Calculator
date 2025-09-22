import { useEffect, useRef } from 'react';
import { useShowerWallsCalculations } from './use-shower-walls-calculations';
import type { Wall, ShowerWallsDesign } from '@/lib/shower-walls-calculator';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  color?: string;
  scope?: string;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  color?: string;
  scope?: string;
}

interface UseShowerWallsAutoUpdateProps {
  walls: Wall[];
  design: ShowerWallsDesign;
  currentLaborItems: LaborItem[];
  currentMaterialItems: MaterialItem[];
  onUpdateLabor: (items: LaborItem[]) => void;
  onUpdateMaterials: (items: MaterialItem[]) => void;
}

export function useShowerWallsAutoUpdate({
  walls,
  design,
  currentLaborItems,
  currentMaterialItems,
  onUpdateLabor,
  onUpdateMaterials,
}: UseShowerWallsAutoUpdateProps) {
  const { autoLaborItems, autoMaterialItems } = useShowerWallsCalculations({
    walls,
    design,
  });

  // Use refs to store the latest callback functions to avoid dependency issues
  const onUpdateLaborRef = useRef(onUpdateLabor);
  const onUpdateMaterialsRef = useRef(onUpdateMaterials);

  // Update refs when callbacks change
  onUpdateLaborRef.current = onUpdateLabor;
  onUpdateMaterialsRef.current = onUpdateMaterials;

  useEffect(() => {
    // Convert auto labor items to the format expected by the UI
    const formattedAutoLabor: LaborItem[] = autoLaborItems.map((item) => ({
      id: item.id,
      name: item.name,
      hours: item.hours.toString(),
      rate: item.rate.toString(),
      color: undefined,
      scope: item.scope, // Preserve the scope property
    }));

    // Convert auto material items to the format expected by the UI
    const formattedAutoMaterials: MaterialItem[] = autoMaterialItems.map(
      (item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        unit: item.unit,
        color: undefined,
        scope: item.scope, // Preserve the scope property
      })
    );

    // Reconciliation logic for labor items
    const reconciledLaborItems = [...currentLaborItems];

    // Update or add auto-calculated labor items
    formattedAutoLabor.forEach((autoItem) => {
      const existingIndex = reconciledLaborItems.findIndex(
        (item) => item.id === autoItem.id
      );

      if (existingIndex >= 0) {
        // Update existing item, preserving user-edited rate but updating hours and name
        const existingItem = reconciledLaborItems[existingIndex];
        reconciledLaborItems[existingIndex] = {
          ...existingItem,
          name: autoItem.name,
          hours: autoItem.hours,
          scope: autoItem.scope, // Update scope
          // Keep existing rate if it was user-edited (not the default)
          rate: existingItem.rate !== '85' ? existingItem.rate : autoItem.rate,
        };
      } else {
        // Add new auto-calculated item
        reconciledLaborItems.push(autoItem);
      }
    });

    // Remove auto-calculated items that are no longer needed
    const currentAutoIds = new Set(formattedAutoLabor.map((item) => item.id));
    const filteredLaborItems = reconciledLaborItems.filter((item) => {
      // Keep all custom items (not starting with 'sw-')
      if (!item.id.startsWith('sw-')) {
        return true;
      }
      // Keep auto items that are still needed
      return currentAutoIds.has(item.id);
    });

    // Only update if there are changes

    if (
      JSON.stringify(filteredLaborItems) !== JSON.stringify(currentLaborItems)
    ) {
      onUpdateLaborRef.current(filteredLaborItems);
    }

    // Reconciliation logic for material items
    const reconciledMaterialItems = [...currentMaterialItems];

    // Update or add auto-calculated material items
    formattedAutoMaterials.forEach((autoItem) => {
      const existingIndex = reconciledMaterialItems.findIndex(
        (item) => item.id === autoItem.id
      );

      if (existingIndex >= 0) {
        // Update existing item, preserving user-edited price but updating quantity and name
        const existingItem = reconciledMaterialItems[existingIndex];
        reconciledMaterialItems[existingIndex] = {
          ...existingItem,
          name: autoItem.name,
          quantity: autoItem.quantity,
          scope: autoItem.scope, // Update scope
          // Keep existing price if it was user-edited (not the default)
          price:
            existingItem.price !== autoItem.price
              ? existingItem.price
              : autoItem.price,
        };
      } else {
        // Add new auto-calculated item
        reconciledMaterialItems.push(autoItem);
      }
    });

    // Remove auto-calculated items that are no longer needed
    const currentAutoMaterialIds = new Set(
      formattedAutoMaterials.map((item) => item.id)
    );
    const filteredMaterialItems = reconciledMaterialItems.filter((item) => {
      // Keep all custom items (not starting with 'mat-')
      if (!item.id.startsWith('mat-')) {
        return true;
      }
      // Keep auto items that are still needed
      return currentAutoMaterialIds.has(item.id);
    });

    // Only update if there are changes
    if (
      JSON.stringify(filteredMaterialItems) !==
      JSON.stringify(currentMaterialItems)
    ) {
      onUpdateMaterialsRef.current(filteredMaterialItems);
    }
  }, [
    autoLaborItems,
    autoMaterialItems,
    currentLaborItems,
    currentMaterialItems,
  ]);
}
