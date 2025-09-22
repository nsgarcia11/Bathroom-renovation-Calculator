/**
 * Shower Base Business Logic Calculator
 * Implements the complete business logic for shower base calculations
 * including measurements, design choices, auto labor, and auto materials generation
 */

export interface ShowerBaseMeasurements {
  width: number; // in inches
  length: number; // in inches
}

export interface ShowerBaseDesign {
  baseType: string;
  clientSuppliesBase: string;
  baseInstallationBy: string;
  entryType: string;
  drainType: string;
  drainLocation: string;
  notes: string;
}

export interface ShowerBaseConstruction {
  tiledBaseSystem: string;
  repairSubfloor: boolean;
  modifyJoists: boolean;
  notes: string;
}

export interface LaborItem {
  id: string;
  name: string;
  hours: number;
  rate: number;
  scope: string;
  source: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
  scope: string;
  source: string;
}

export interface ShowerBaseCalculationResult {
  totalSqft: number;
  laborItems: LaborItem[];
  materialItems: MaterialItem[];
}

export class ShowerBaseCalculator {
  private static readonly DEFAULT_HOURLY_RATE = 85.0;
  private static readonly DEFAULT_PRICES = {
    tub: 550.0,
    acrylicBase: 500.0,
    schluterKit: 800.0,
    mortarMix: 10.0,
    waterproofingMembrane: 115.0,
    plywood: 70.0,
    lumber: 100.0,
    linearDrain: 350.0,
    standardDrain: 50.0,
  };

  /**
   * Calculate square footage for shower base
   */
  static calculateSqft(measurements: ShowerBaseMeasurements): number {
    return (measurements.width * measurements.length) / 144; // Convert sq inches to sq feet
  }

  /**
   * Generate auto labor items based on design and construction choices
   */
  static generateAutoLabor(
    measurements: ShowerBaseMeasurements,
    design: ShowerBaseDesign,
    construction: ShowerBaseConstruction
  ): LaborItem[] {
    const laborItems: LaborItem[] = [];

    // Base installation labor
    if (design.baseType === 'Tub' || design.baseType === 'Acrylic Base') {
      if (design.baseInstallationBy === 'me') {
        laborItems.push({
          id: 'sb-install-base',
          name: `Install ${design.baseType}`,
          hours: 4,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'showerBase_design',
          source: 'calculated',
        });
      } else {
        // Installation by trade - add note item
        laborItems.push({
          id: 'sb-trade-install',
          name: `Install ${design.baseType} by Trade`,
          hours: 0,
          rate: 0,
          scope: 'showerBase_design',
          source: 'note',
        });
      }
    } else if (design.baseType === 'Tiled Base') {
      // Design labor for tiled base
      laborItems.push({
        id: 'sb-tile-base',
        name: 'Tile Shower Base',
        hours: 4,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerBase_design',
        source: 'calculated',
      });

      if (design.entryType === 'curbless') {
        laborItems.push({
          id: 'sb-curbless-entry',
          name: 'Create Curbless Entry',
          hours: 8,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'showerBase_design',
          source: 'calculated',
        });
      } else {
        laborItems.push({
          id: 'sb-build-curb',
          name: 'Build Curb',
          hours: 2,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'showerBase_design',
          source: 'calculated',
        });
      }

      // Drain installation
      if (design.drainType === 'linear') {
        laborItems.push({
          id: 'sb-linear-drain',
          name: 'Install Linear Drain',
          hours: 3,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'showerBase_design',
          source: 'calculated',
        });
      } else {
        laborItems.push({
          id: 'sb-regular-drain',
          name: 'Install Regular Drain',
          hours: 1.5,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'showerBase_design',
          source: 'calculated',
        });
      }

      // Construction labor for waterproofing system
      if (construction.tiledBaseSystem === 'Schluter') {
        laborItems.push({
          id: 'sb-schluter-system',
          name: 'Install Schluter Base System',
          hours: 4,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'showerBase_construction',
          source: 'calculated',
        });
      } else if (construction.tiledBaseSystem === 'Mortar Bed') {
        laborItems.push({
          id: 'sb-mortar-bed',
          name: 'Float Mortar Bed & Waterproof',
          hours: 8,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'showerBase_construction',
          source: 'calculated',
        });
      }
    }

    // Construction labor for subfloor and joists
    if (construction.repairSubfloor) {
      laborItems.push({
        id: 'sb-repair-subfloor',
        name: 'Repair Subfloor',
        hours: 4,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerBase_construction',
        source: 'calculated',
      });
    }

    if (construction.modifyJoists) {
      laborItems.push({
        id: 'sb-modify-joists',
        name: 'Modify Floor Joists',
        hours: 6,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerBase_construction',
        source: 'calculated',
      });
    }

    return laborItems;
  }

  /**
   * Generate auto materials based on design and construction choices
   */
  static generateAutoMaterials(
    measurements: ShowerBaseMeasurements,
    design: ShowerBaseDesign,
    construction: ShowerBaseConstruction
  ): MaterialItem[] {
    const materialItems: MaterialItem[] = [];

    // Base materials
    if (design.baseType === 'Tub' || design.baseType === 'Acrylic Base') {
      if (design.clientSuppliesBase === 'no') {
        const basePrice =
          design.baseType === 'Tub'
            ? this.DEFAULT_PRICES.tub
            : this.DEFAULT_PRICES.acrylicBase;
        materialItems.push({
          id: 'mat-base',
          name: design.baseType,
          quantity: 1,
          price: basePrice,
          unit: 'each',
          scope: 'showerBase_design',
          source: 'calculated',
        });
      } else {
        // Client supplies base - add note item
        materialItems.push({
          id: 'mat-client-supplies',
          name: `${design.baseType} supplied by client`,
          quantity: 1,
          price: 0,
          unit: 'note',
          scope: 'showerBase_design',
          source: 'note',
        });
      }
    } else if (design.baseType === 'Tiled Base') {
      // Drain materials
      if (design.drainType === 'linear') {
        materialItems.push({
          id: 'mat-linear-drain',
          name: 'Linear Shower Drain',
          quantity: 1,
          price: this.DEFAULT_PRICES.linearDrain,
          unit: 'each',
          scope: 'showerBase_design',
          source: 'calculated',
        });
      } else {
        materialItems.push({
          id: 'mat-standard-drain',
          name: 'Standard Shower Drain',
          quantity: 1,
          price: this.DEFAULT_PRICES.standardDrain,
          unit: 'each',
          scope: 'showerBase_design',
          source: 'calculated',
        });
      }

      // Waterproofing system materials
      if (construction.tiledBaseSystem === 'Schluter') {
        materialItems.push({
          id: 'mat-schluter-kit',
          name: 'Schluter-Kerdi Kit',
          quantity: 1,
          price: this.DEFAULT_PRICES.schluterKit,
          unit: 'kit',
          scope: 'showerBase_construction',
          source: 'calculated',
        });
      } else if (construction.tiledBaseSystem === 'Mortar Bed') {
        materialItems.push({
          id: 'mat-mortar-mix',
          name: 'Mortar Mix',
          quantity: 3,
          price: this.DEFAULT_PRICES.mortarMix,
          unit: 'bag',
          scope: 'showerBase_construction',
          source: 'calculated',
        });
        materialItems.push({
          id: 'mat-waterproofing-membrane',
          name: 'Waterproofing Membrane/Liner',
          quantity: 1,
          price: this.DEFAULT_PRICES.waterproofingMembrane,
          unit: 'roll',
          scope: 'showerBase_construction',
          source: 'calculated',
        });
      }
    }

    // Construction materials
    if (construction.repairSubfloor) {
      materialItems.push({
        id: 'mat-plywood',
        name: 'Plywood/OSB Sheathing',
        quantity: 1,
        price: this.DEFAULT_PRICES.plywood,
        unit: 'sheet',
        scope: 'showerBase_construction',
        source: 'calculated',
      });
    }

    if (construction.modifyJoists) {
      materialItems.push({
        id: 'mat-lumber',
        name: 'Lumber & Hangers',
        quantity: 1,
        price: this.DEFAULT_PRICES.lumber,
        unit: 'bundle',
        scope: 'showerBase_construction',
        source: 'calculated',
      });
    }

    return materialItems;
  }

  /**
   * Calculate complete shower base estimate
   */
  static calculate(
    measurements: ShowerBaseMeasurements,
    design: ShowerBaseDesign,
    construction: ShowerBaseConstruction
  ): ShowerBaseCalculationResult {
    const totalSqft = this.calculateSqft(measurements);
    const laborItems = this.generateAutoLabor(
      measurements,
      design,
      construction
    );
    const materialItems = this.generateAutoMaterials(
      measurements,
      design,
      construction
    );

    return {
      totalSqft,
      laborItems,
      materialItems,
    };
  }
}
