import { ShowerBaseCalculator } from './shower-base-calculator';
import type {
  ShowerBaseMeasurements,
  ShowerBaseDesign,
  ShowerBaseConstruction,
} from './shower-base-calculator';

describe('ShowerBaseCalculator', () => {
  const measurements: ShowerBaseMeasurements = {
    width: 32,
    length: 60,
  };

  const design: ShowerBaseDesign = {
    baseType: 'Tiled Base',
    clientSuppliesBase: 'no',
    baseInstallationBy: 'me',
    entryType: 'curb',
    drainType: 'regular',
    drainLocation: 'center',
    notes: 'Test notes',
  };

  const construction: ShowerBaseConstruction = {
    tiledBaseSystem: 'Schluter',
    repairSubfloor: false,
    modifyJoists: false,
    notes: 'Test construction notes',
  };

  describe('calculateSqft', () => {
    it('should calculate square footage correctly', () => {
      const result = ShowerBaseCalculator.calculateSqft(measurements);
      expect(result).toBeCloseTo(13.33, 2); // (32 * 60) / 144 = 13.33
    });
  });

  describe('generateAutoLabor', () => {
    it('should generate labor items for tiled base with Schluter system', () => {
      const result = ShowerBaseCalculator.generateAutoLabor(
        measurements,
        design,
        construction
      );

      expect(result).toHaveLength(4); // Tile base, build curb, install drain, install Schluter system

      const tileBaseItem = result.find((item) => item.id === 'sb-tile-base');
      expect(tileBaseItem).toBeDefined();
      expect(tileBaseItem?.name).toBe('Tile Shower Base');
      expect(tileBaseItem?.scope).toBe('showerBase_design');

      const curbItem = result.find((item) => item.id === 'sb-build-curb');
      expect(curbItem).toBeDefined();
      expect(curbItem?.name).toBe('Build Curb');
      expect(curbItem?.scope).toBe('showerBase_design');

      const drainItem = result.find((item) => item.id === 'sb-regular-drain');
      expect(drainItem).toBeDefined();
      expect(drainItem?.name).toBe('Install Regular Drain');
      expect(drainItem?.scope).toBe('showerBase_design');

      const schluterItem = result.find(
        (item) => item.id === 'sb-schluter-system'
      );
      expect(schluterItem).toBeDefined();
      expect(schluterItem?.name).toBe('Install Schluter Base System');
      expect(schluterItem?.scope).toBe('showerBase_construction');
    });

    it('should generate labor items for tub with trade installation', () => {
      const tubDesign: ShowerBaseDesign = {
        ...design,
        baseType: 'Tub',
        baseInstallationBy: 'trade',
      };

      const result = ShowerBaseCalculator.generateAutoLabor(
        measurements,
        tubDesign,
        construction
      );

      const tradeItem = result.find((item) => item.id === 'sb-trade-install');
      expect(tradeItem).toBeDefined();
      expect(tradeItem?.name).toBe('Install Tub by Trade');
      expect(tradeItem?.scope).toBe('showerBase_design');
      expect(tradeItem?.hours).toBe(0);
      expect(tradeItem?.rate).toBe(0);
    });
  });

  describe('generateAutoMaterials', () => {
    it('should generate material items for tiled base with Schluter system', () => {
      const result = ShowerBaseCalculator.generateAutoMaterials(
        measurements,
        design,
        construction
      );

      expect(result).toHaveLength(2); // Standard drain, Schluter kit

      const drainItem = result.find((item) => item.id === 'mat-standard-drain');
      expect(drainItem).toBeDefined();
      expect(drainItem?.name).toBe('Standard Shower Drain');
      expect(drainItem?.scope).toBe('showerBase_design');
      expect(drainItem?.quantity).toBe(1);

      const schluterItem = result.find(
        (item) => item.id === 'mat-schluter-kit'
      );
      expect(schluterItem).toBeDefined();
      expect(schluterItem?.name).toBe('Schluter-Kerdi Kit');
      expect(schluterItem?.scope).toBe('showerBase_construction');
      expect(schluterItem?.quantity).toBe(1);
    });

    it('should generate material items for tub with client supplies', () => {
      const tubDesign: ShowerBaseDesign = {
        ...design,
        baseType: 'Tub',
        clientSuppliesBase: 'yes',
      };

      const result = ShowerBaseCalculator.generateAutoMaterials(
        measurements,
        tubDesign,
        construction
      );

      const clientItem = result.find(
        (item) => item.id === 'mat-client-supplies'
      );
      expect(clientItem).toBeDefined();
      expect(clientItem?.name).toBe('Tub supplied by client');
      expect(clientItem?.scope).toBe('showerBase_design');
      expect(clientItem?.unit).toBe('note');
    });
  });

  describe('calculate', () => {
    it('should calculate complete estimate', () => {
      const result = ShowerBaseCalculator.calculate(
        measurements,
        design,
        construction
      );

      expect(result.totalSqft).toBeCloseTo(13.33, 2);
      expect(result.laborItems).toHaveLength(4);
      expect(result.materialItems).toHaveLength(2);
    });
  });
});
