import { useFloorAutoUpdate } from '@/hooks/use-floor-auto-update';
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

interface FloorAutoUpdateProps {
  measurements: FloorMeasurements;
  design: FloorDesign;
  construction: FloorConstruction;
  currentLaborItems: LaborItem[];
  currentMaterialItems: MaterialItem[];
  onUpdateLabor: (items: LaborItem[]) => void;
  onUpdateMaterials: (items: MaterialItem[]) => void;
}

export function FloorAutoUpdate({
  measurements,
  design,
  construction,
  currentLaborItems,
  currentMaterialItems,
  onUpdateLabor,
  onUpdateMaterials,
}: FloorAutoUpdateProps) {
  useFloorAutoUpdate({
    measurements,
    design,
    construction,
    currentLaborItems,
    currentMaterialItems,
    onUpdateLabor,
    onUpdateMaterials,
  });

  return null;
}
