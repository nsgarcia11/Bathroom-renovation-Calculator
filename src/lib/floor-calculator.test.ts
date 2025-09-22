import { FloorCalculator } from './floor-calculator';
import type {
  FloorMeasurements,
  FloorDesign,
  FloorConstruction,
} from './floor-calculator';

describe('FloorCalculator', () => {
  const measurements: FloorMeasurements = {
    width: 60, // 5 feet
    length: 96, // 8 feet
    extraMeasurements: [],
  };

  const design: FloorDesign = {
    tilePattern: 'stacked',
    customPattern: '',
    selectedTileSizeOption: '12x24',
    tileSize: {
      width: '12',
      length: '24',
    },
    notes: '',
    constructionNotes: '',
  };

  const construction: FloorConstruction = {
    clientSuppliesTiles: false,
    selectedPrepTasks: ['ditra'],
    plywoodThickness: '3/4',
    isHeatedFloor: false,
    heatedFloorType: 'schluter',
    customHeatedFloorName: '',
  };

  describe('calculateTotalSqft', () => {
    it('should calculate square footage correctly', () => {
      const result = FloorCalculator.calculateTotalSqft(measurements);
      expect(result).toBeCloseTo(40, 2); // 60 * 96 / 144 = 40 sq ft
    });

    it('should include extra measurements', () => {
      const measurementsWithExtra = {
        ...measurements,
        extraMeasurements: [{ id: 1, label: 'Closet', width: 24, length: 36 }],
      };
      const result = FloorCalculator.calculateTotalSqft(measurementsWithExtra);
      expect(result).toBeCloseTo(46, 2); // 40 + (24 * 36 / 144) = 46 sq ft
    });
  });

  describe('calculateWasteFactor', () => {
    it('should return correct waste factor for stacked pattern', () => {
      const result = FloorCalculator.calculateWasteFactor('stacked');
      expect(result).toBe(1.1);
    });

    it('should return correct waste factor for herringbone pattern', () => {
      const result = FloorCalculator.calculateWasteFactor('herringbone');
      expect(result).toBe(1.25);
    });

    it('should return correct waste factor for offset patterns', () => {
      expect(FloorCalculator.calculateWasteFactor('1/2_offset')).toBe(1.2);
      expect(FloorCalculator.calculateWasteFactor('1/3_offset')).toBe(1.2);
    });
  });

  describe('generateAutoLabor', () => {
    it('should generate labor items for tiling', () => {
      const result = FloorCalculator.generateAutoLabor(
        measurements,
        design,
        construction
      );

      expect(result).toHaveLength(3); // Tile, Grout, Ditra

      const tileItem = result.find((item) => item.id === 'fl-tile');
      expect(tileItem).toBeDefined();
      expect(tileItem?.name).toBe('Tile Installation');
      expect(tileItem?.scope).toBe('floor_design');

      const groutItem = result.find((item) => item.id === 'fl-grout');
      expect(groutItem).toBeDefined();
      expect(groutItem?.name).toBe('Grout Installation');
      expect(groutItem?.scope).toBe('floor_design');

      const ditraItem = result.find((item) => item.id === 'fl-prep-ditra');
      expect(ditraItem).toBeDefined();
      expect(ditraItem?.name).toBe('Lay Ditra');
      expect(ditraItem?.scope).toBe('floor_construction');
    });

    it('should not generate tile labor when client supplies tiles', () => {
      const clientSuppliesConstruction = {
        ...construction,
        clientSuppliesTiles: true,
      };

      const result = FloorCalculator.generateAutoLabor(
        measurements,
        design,
        clientSuppliesConstruction
      );

      const tileItem = result.find((item) => item.id === 'fl-tile');
      expect(tileItem).toBeUndefined();
    });

    it('should generate heated floor labor when enabled', () => {
      const heatedFloorConstruction = {
        ...construction,
        isHeatedFloor: true,
      };

      const result = FloorCalculator.generateAutoLabor(
        measurements,
        design,
        heatedFloorConstruction
      );

      const heatedFloorItem = result.find(
        (item) => item.id === 'fl-heated-floor'
      );
      expect(heatedFloorItem).toBeDefined();
      expect(heatedFloorItem?.name).toBe('Install Heated Floor System');
      expect(heatedFloorItem?.scope).toBe('floor_construction');
    });
  });

  describe('generateAutoMaterials', () => {
    it('should generate material items for tiling', () => {
      const result = FloorCalculator.generateAutoMaterials(
        measurements,
        design,
        construction
      );

      expect(result.length).toBeGreaterThan(0);

      const tileItem = result.find((item) => item.id === 'mat-tile');
      expect(tileItem).toBeDefined();
      expect(tileItem?.name).toBe('Floor Tile (12"x24")');
      expect(tileItem?.scope).toBe('floor_design');
      expect(tileItem?.quantity).toBeCloseTo(44, 2); // 40 * 1.10 waste factor

      const groutItem = result.find((item) => item.id === 'mat-grout');
      expect(groutItem).toBeDefined();
      expect(groutItem?.name).toBe('Sanded Grout (25lb bag)');
      expect(groutItem?.scope).toBe('floor_construction');

      const ditraItem = result.find((item) => item.id === 'mat-ditra');
      expect(ditraItem).toBeDefined();
      expect(ditraItem?.name).toBe('Ditra Uncoupling Membrane');
      expect(ditraItem?.scope).toBe('floor_construction');
    });

    it('should not generate tile materials when client supplies tiles', () => {
      const clientSuppliesConstruction = {
        ...construction,
        clientSuppliesTiles: true,
      };

      const result = FloorCalculator.generateAutoMaterials(
        measurements,
        design,
        clientSuppliesConstruction
      );

      const tileItem = result.find((item) => item.id === 'mat-tile');
      expect(tileItem).toBeUndefined();
    });

    it('should generate heated floor materials when enabled', () => {
      const heatedFloorConstruction = {
        ...construction,
        isHeatedFloor: true,
      };

      const result = FloorCalculator.generateAutoMaterials(
        measurements,
        design,
        heatedFloorConstruction
      );

      const heatedFloorItem = result.find(
        (item) => item.id === 'mat-heated-floor'
      );
      expect(heatedFloorItem).toBeDefined();
      expect(heatedFloorItem?.name).toBe('Schluter-DITRA-HEAT Kit');
      expect(heatedFloorItem?.scope).toBe('floor_construction');

      const thermostatItem = result.find(
        (item) => item.id === 'mat-thermostat'
      );
      expect(thermostatItem).toBeDefined();
      expect(thermostatItem?.name).toBe('Heated Floor Thermostat');
      expect(thermostatItem?.scope).toBe('floor_construction');
    });
  });

  describe('calculate', () => {
    it('should calculate complete estimate', () => {
      const result = FloorCalculator.calculate(
        measurements,
        design,
        construction
      );

      expect(result.totalSqft).toBeCloseTo(40, 2);
      expect(result.wasteFactor).toBe(1.1);
      expect(result.laborItems).toHaveLength(3);
      expect(result.materialItems.length).toBeGreaterThan(0);
    });
  });
});
