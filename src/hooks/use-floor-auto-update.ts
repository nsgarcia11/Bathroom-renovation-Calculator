import { useEffect, useRef } from 'react';
import { FloorCalculator } from '@/lib/floor-calculator';
import type {
  FloorMeasurements,
  FloorDesign,
  FloorConstruction,
} from '@/lib/floor-calculator';

interface LaborItem {
  id: string;
  name: string;
  hours: string;
  rate: string;
  scope?: string;
}

interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  unit: string;
  scope?: string;
}

interface UseFloorAutoUpdateProps {
  measurements: FloorMeasurements;
  design: FloorDesign;
  construction: FloorConstruction;
  currentLaborItems: LaborItem[];
  currentMaterialItems: MaterialItem[];
  onUpdateLabor: (items: LaborItem[]) => void;
  onUpdateMaterials: (items: MaterialItem[]) => void;
}

export function useFloorAutoUpdate({
  measurements,
  design,
  construction,
  currentLaborItems,
  currentMaterialItems,
  onUpdateLabor,
  onUpdateMaterials,
}: UseFloorAutoUpdateProps) {
  // Generate auto labor and materials
  const autoLaborItems = FloorCalculator.generateAutoLabor(
    measurements,
    design,
    construction
  );
  const autoMaterialItems = FloorCalculator.generateAutoMaterials(
    measurements,
    design,
    construction
  );

  // Use refs to store the latest callback functions to avoid dependency issues
  const onUpdateLaborRef = useRef(onUpdateLabor);
  const onUpdateMaterialsRef = useRef(onUpdateMaterials);

  // Update refs when callbacks change
  useEffect(() => {
    onUpdateLaborRef.current = onUpdateLabor;
    onUpdateMaterialsRef.current = onUpdateMaterials;
  }, [onUpdateLabor, onUpdateMaterials]);

  // Auto-update labor items
  useEffect(() => {
    if (autoLaborItems.length === 0) return;

    // Convert auto labor items to the format expected by the UI
    const formattedAutoLabor = autoLaborItems.map((item) => ({
      id: item.id,
      name: item.name,
      hours: item.hours.toString(),
      rate: item.rate.toString(),
      scope: item.scope,
    }));

    // Merge with existing items, preserving user-edited prices/rates
    const updatedLaborItems = [...currentLaborItems];

    formattedAutoLabor.forEach((autoItem) => {
      const existingIndex = updatedLaborItems.findIndex(
        (item) => item.id === autoItem.id
      );

      if (existingIndex >= 0) {
        // Update existing item, preserving user-edited rate
        updatedLaborItems[existingIndex] = {
          ...updatedLaborItems[existingIndex],
          name: autoItem.name,
          hours: autoItem.hours,
          scope: autoItem.scope,
        };
      } else {
        // Add new item
        updatedLaborItems.push(autoItem);
      }
    });

    // Remove auto-generated items that are no longer relevant
    const relevantIds = new Set(formattedAutoLabor.map((item) => item.id));
    const filteredLaborItems = updatedLaborItems.filter(
      (item) => !item.id.startsWith('fl-') || relevantIds.has(item.id)
    );

    onUpdateLaborRef.current(filteredLaborItems);
  }, [autoLaborItems, currentLaborItems, measurements, design, construction]);

  // Auto-update material items
  useEffect(() => {
    if (autoMaterialItems.length === 0) return;

    // Convert auto material items to the format expected by the UI
    const formattedAutoMaterials = autoMaterialItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      unit: item.unit,
      scope: item.scope,
    }));

    // Merge with existing items, preserving user-edited prices
    const updatedMaterialItems = [...currentMaterialItems];

    formattedAutoMaterials.forEach((autoItem) => {
      const existingIndex = updatedMaterialItems.findIndex(
        (item) => item.id === autoItem.id
      );

      if (existingIndex >= 0) {
        // Update existing item, preserving user-edited price
        updatedMaterialItems[existingIndex] = {
          ...updatedMaterialItems[existingIndex],
          name: autoItem.name,
          quantity: autoItem.quantity,
          unit: autoItem.unit,
          scope: autoItem.scope,
        };
      } else {
        // Add new item
        updatedMaterialItems.push(autoItem);
      }
    });

    // Remove auto-generated items that are no longer relevant
    const relevantIds = new Set(formattedAutoMaterials.map((item) => item.id));
    const filteredMaterialItems = updatedMaterialItems.filter(
      (item) => !item.id.startsWith('mat-') || relevantIds.has(item.id)
    );

    onUpdateMaterialsRef.current(filteredMaterialItems);
  }, [
    autoMaterialItems,
    currentMaterialItems,
    measurements,
    design,
    construction,
  ]);
}
