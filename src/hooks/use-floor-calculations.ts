import { useMemo } from 'react';
import { FloorCalculator } from '@/lib/floor-calculator';
import type {
  FloorMeasurements,
  FloorDesign,
} from '@/lib/floor-calculator';

export function useFloorCalculations(
  measurements: FloorMeasurements,
  design: FloorDesign
) {
  return useMemo(() => {
    const totalSqft = FloorCalculator.calculateTotalSqft(measurements);
    const wasteFactor = FloorCalculator.calculateWasteFactor(
      design.tilePattern
    );

    return {
      totalSqft,
      wasteFactor,
    };
  }, [measurements, design]);
}
