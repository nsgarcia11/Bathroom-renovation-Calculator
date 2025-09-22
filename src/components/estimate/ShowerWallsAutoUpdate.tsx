'use client';

import { useShowerWallsAutoUpdate } from '@/hooks/use-shower-walls-auto-update';
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

interface ShowerWallsAutoUpdateProps {
  walls: Wall[];
  design: ShowerWallsDesign;
  currentLaborItems: LaborItem[];
  currentMaterialItems: MaterialItem[];
  onUpdateLabor: (items: LaborItem[]) => void;
  onUpdateMaterials: (items: MaterialItem[]) => void;
}

export function ShowerWallsAutoUpdate({
  walls,
  design,
  currentLaborItems,
  currentMaterialItems,
  onUpdateLabor,
  onUpdateMaterials,
}: ShowerWallsAutoUpdateProps) {
  useShowerWallsAutoUpdate({
    walls,
    design,
    currentLaborItems,
    currentMaterialItems,
    onUpdateLabor,
    onUpdateMaterials,
  });

  // This component doesn't render anything - it just handles the auto-update logic
  return null;
}
