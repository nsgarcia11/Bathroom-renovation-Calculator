import { useShowerBaseAutoUpdate } from '@/hooks/use-shower-base-auto-update';
import type {
  ShowerBaseMeasurements,
  ShowerBaseDesign,
  ShowerBaseConstruction,
} from '@/lib/shower-base-calculator';

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

interface ShowerBaseAutoUpdateProps {
  measurements: ShowerBaseMeasurements;
  design: ShowerBaseDesign;
  construction: ShowerBaseConstruction;
  currentLaborItems: LaborItem[];
  currentMaterialItems: MaterialItem[];
  onUpdateLabor: (items: LaborItem[]) => void;
  onUpdateMaterials: (items: MaterialItem[]) => void;
}

export function ShowerBaseAutoUpdate({
  measurements,
  design,
  construction,
  currentLaborItems,
  currentMaterialItems,
  onUpdateLabor,
  onUpdateMaterials,
}: ShowerBaseAutoUpdateProps) {
  useShowerBaseAutoUpdate({
    measurements,
    design,
    construction,
    currentLaborItems,
    currentMaterialItems,
    onUpdateLabor,
    onUpdateMaterials,
  });

  // This component doesn't render anything - it just handles the auto-update logic
  return null;
}
