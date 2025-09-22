import { useMemo } from 'react';
import {
  ShowerWallsCalculator,
  type Wall,
  type ShowerWallsDesign,
} from '@/lib/shower-walls-calculator';

export interface UseShowerWallsCalculationsProps {
  walls: Wall[];
  design: ShowerWallsDesign;
}

export function useShowerWallsCalculations({
  walls,
  design,
}: UseShowerWallsCalculationsProps) {
  const calculations = useMemo(() => {
    return ShowerWallsCalculator.calculate(walls, design);
  }, [walls, design]);

  return {
    totalSqft: calculations.totalSqft,
    wasteFactor: calculations.wasteFactor,
    tileNeeded: calculations.tileNeeded,
    wasteNote: calculations.wasteNote,
    autoLaborItems: calculations.laborItems,
    autoMaterialItems: calculations.materialItems,
  };
}
