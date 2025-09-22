import { useMemo } from 'react';
import { ShowerBaseCalculator } from '@/lib/shower-base-calculator';
import type {
  ShowerBaseMeasurements,
  ShowerBaseDesign,
  ShowerBaseConstruction,
} from '@/lib/shower-base-calculator';

export function useShowerBaseCalculations(
  measurements: ShowerBaseMeasurements,
  design: ShowerBaseDesign,
  construction: ShowerBaseConstruction
) {
  return useMemo(() => {
    return ShowerBaseCalculator.calculate(measurements, design, construction);
  }, [measurements, design, construction]);
}
