/**
 * Floor Business Logic Calculator
 * Implements the complete business logic for floor calculations
 * including measurements, tile patterns, waste factors, and auto-generation of labor and materials
 */

export interface FloorMeasurements {
  width: number; // in inches
  length: number; // in inches
  extraMeasurements: Array<{
    id: number;
    label: string;
    width: number;
    length: number;
  }>;
}

export interface FloorDesign {
  tilePattern: string;
  customPattern: string;
  selectedTileSizeOption: string;
  tileSize: {
    width: string;
    length: string;
  };
  notes: string;
  constructionNotes: string;
}

export interface FloorConstruction {
  clientSuppliesTiles: boolean;
  selectedPrepTasks: string[];
  plywoodThickness: string;
  isHeatedFloor: boolean;
  heatedFloorType: string;
  customHeatedFloorName: string;
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

export interface FloorCalculationResult {
  totalSqft: number;
  wasteFactor: number;
  laborItems: LaborItem[];
  materialItems: MaterialItem[];
}

export class FloorCalculator {
  private static readonly DEFAULT_HOURLY_RATE = 95.0;
  private static readonly DEFAULT_PRICES = {
    tile: 5.0, // per sq/ft
    grout: 30.0, // per 25lb bag
    thinset: 30.0, // per 50lb bag
    ditra: 165.0, // per roll
    ditraXL: 462.0, // per roll
    selfLeveler: 45.0, // per 50lb bag
    plywood: {
      '1/2': 70.0,
      '5/8': 86.0,
      '3/4': 103.0,
    },
    screws: 18.0, // per box
    heatedFloor: {
      schluter: 400.0, // per kit
      nuheat: 350.0, // per kit
    },
    thermostat: 220.0, // per each
  };

  /**
   * Calculate total square footage including extra measurements
   */
  static calculateTotalSqft(measurements: FloorMeasurements): number {
    let totalArea = 0;
    const mainWidth = measurements.width || 0;
    const mainLength = measurements.length || 0;

    if (mainWidth > 0 && mainLength > 0) {
      totalArea += (mainWidth * mainLength) / 144; // Convert sq inches to sq feet
    }

    (measurements.extraMeasurements || []).forEach((m) => {
      const sideWidth = m.width || 0;
      const sideLength = m.length || 0;
      if (sideWidth > 0 && sideLength > 0) {
        totalArea += (sideWidth * sideLength) / 144;
      }
    });

    return totalArea;
  }

  /**
   * Calculate waste factor based on tile pattern
   */
  static calculateWasteFactor(tilePattern: string): number {
    switch (tilePattern) {
      case 'herringbone':
        return 1.25; // 25%
      case '1/2_offset':
      case '1/3_offset':
        return 1.2; // 20%
      case 'stacked':
      default:
        return 1.1; // 10%
    }
  }

  /**
   * Generate auto labor items based on design and construction choices
   */
  static generateAutoLabor(
    measurements: FloorMeasurements,
    design: FloorDesign,
    construction: FloorConstruction
  ): LaborItem[] {
    const laborItems: LaborItem[] = [];
    const totalSqft = this.calculateTotalSqft(measurements);

    if (totalSqft > 0) {
      // Tiling labor
      if (
        design.selectedTileSizeOption !== 'select_option' &&
        !construction.clientSuppliesTiles
      ) {
        // Estimate: 1 hour per 4 sq/ft
        const tilingHours = Math.max(1, totalSqft / 4);
        laborItems.push({
          id: 'fl-tile',
          name: 'Tile Installation',
          hours: tilingHours,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'floor_design',
          source: 'calculated',
        });

        // Grout labor
        // Estimate: 1 hour per 20 sq/ft
        const groutHours = Math.max(1, totalSqft / 20);
        laborItems.push({
          id: 'fl-grout',
          name: 'Grout Installation',
          hours: groutHours,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'floor_design',
          source: 'calculated',
        });
      }

      // Prep and structural work
      construction.selectedPrepTasks.forEach((taskKey) => {
        const plywoodHours = Math.max(1, totalSqft / 32); // 1 hr per sheet
        const ditraHours = Math.max(1, totalSqft / 30); // 1 hr per 30 sqft

        const prepTaskMap: Record<
          string,
          { name: string; hours: number; scope: string }
        > = {
          self_leveling: {
            name: 'Self-Leveling',
            hours: Math.max(1, totalSqft / 50),
            scope: 'floor_construction',
          },
          repair_subfloor: {
            name: 'Repair portion of subfloor',
            hours: 2,
            scope: 'floor_construction',
          },
          repair_joist: {
            name: 'Repair Floor Joist',
            hours: 4,
            scope: 'floor_construction',
          },
          add_plywood: {
            name: `Install ${construction.plywoodThickness}" Plywood`,
            hours: plywoodHours,
            scope: 'floor_construction',
          },
          ditra: {
            name: 'Lay Ditra',
            hours: ditraHours,
            scope: 'floor_construction',
          },
          ditra_xl: {
            name: 'Lay Ditra XL',
            hours: ditraHours,
            scope: 'floor_construction',
          },
        };

        const task = prepTaskMap[taskKey];
        if (task) {
          laborItems.push({
            id: `fl-prep-${taskKey}`,
            name: task.name,
            hours: task.hours,
            rate: this.DEFAULT_HOURLY_RATE,
            scope: task.scope,
            source: 'calculated',
          });
        }
      });

      // Heated floor labor
      if (construction.isHeatedFloor) {
        const heatedFloorHours = 2 + totalSqft / 20; // 2hr base + 1hr/20sqft
        laborItems.push({
          id: 'fl-heated-floor',
          name: 'Install Heated Floor System',
          hours: heatedFloorHours,
          rate: this.DEFAULT_HOURLY_RATE,
          scope: 'floor_construction',
          source: 'calculated',
        });
      }
    }

    return laborItems;
  }

  /**
   * Generate auto materials based on design and construction choices
   */
  static generateAutoMaterials(
    measurements: FloorMeasurements,
    design: FloorDesign,
    construction: FloorConstruction
  ): MaterialItem[] {
    const materialItems: MaterialItem[] = [];
    const totalSqft = this.calculateTotalSqft(measurements);
    const wasteFactor = this.calculateWasteFactor(design.tilePattern);

    if (totalSqft > 0) {
      // Design materials
      if (
        design.selectedTileSizeOption !== 'select_option' &&
        !construction.clientSuppliesTiles
      ) {
        const tileSqFt = totalSqft * wasteFactor;
        materialItems.push({
          id: 'mat-tile',
          name: `Floor Tile (${design.tileSize.width}"x${design.tileSize.length}")`,
          quantity: tileSqFt,
          price: this.DEFAULT_PRICES.tile,
          unit: 'sq/ft',
          scope: 'floor_design',
          source: 'calculated',
        });
      }

      // Construction materials
      const groutBags = Math.ceil(totalSqft / 125);
      if (groutBags > 0) {
        materialItems.push({
          id: 'mat-grout',
          name: 'Sanded Grout (25lb bag)',
          quantity: groutBags,
          price: this.DEFAULT_PRICES.grout,
          unit: 'bag',
          scope: 'floor_construction',
          source: 'calculated',
        });
      }

      // Thinset calculation
      const thinsetForTiles = Math.ceil(totalSqft / 45);
      let thinsetForDitra = 0;

      if (
        construction.selectedPrepTasks.includes('ditra') ||
        construction.selectedPrepTasks.includes('ditra_xl')
      ) {
        const isDitraXL = construction.selectedPrepTasks.includes('ditra_xl');
        const membraneName = isDitraXL ? 'Ditra XL' : 'Ditra';
        const rollCoverage = isDitraXL ? 175 : 54;
        const price = isDitraXL
          ? this.DEFAULT_PRICES.ditraXL
          : this.DEFAULT_PRICES.ditra;
        const membraneId = isDitraXL ? 'mat-ditra_xl' : 'mat-ditra';

        materialItems.push({
          id: membraneId,
          name: `${membraneName} Uncoupling Membrane`,
          quantity: Math.ceil(totalSqft / rollCoverage),
          price: price,
          unit: 'roll',
          scope: 'floor_construction',
          source: 'calculated',
        });
        thinsetForDitra = Math.ceil(totalSqft / 175);
      }

      const totalThinset = thinsetForTiles + thinsetForDitra;
      if (totalThinset > 0) {
        materialItems.push({
          id: 'mat-thinset',
          name: 'Thinset Mortar (50lb bag)',
          quantity: totalThinset,
          price: this.DEFAULT_PRICES.thinset,
          unit: 'bag',
          scope: 'floor_construction',
          source: 'calculated',
        });
      }

      // Heated floor materials
      if (construction.isHeatedFloor) {
        const heatedFloorSystemQty = Math.ceil(totalSqft / 40);
        let systemName, systemPrice;
        if (construction.heatedFloorType === 'custom') {
          systemName =
            construction.customHeatedFloorName || 'Custom Heated Floor System';
          systemPrice = 0;
        } else if (construction.heatedFloorType === 'nuheat') {
          systemName = 'Nuheat Cable System';
          systemPrice = this.DEFAULT_PRICES.heatedFloor.nuheat;
        } else {
          systemName = 'Schluter-DITRA-HEAT Kit';
          systemPrice = this.DEFAULT_PRICES.heatedFloor.schluter;
        }

        materialItems.push({
          id: 'mat-heated-floor',
          name: systemName,
          quantity: heatedFloorSystemQty,
          price: systemPrice,
          unit: 'kit',
          scope: 'floor_construction',
          source: 'calculated',
        });

        materialItems.push({
          id: 'mat-thermostat',
          name: 'Heated Floor Thermostat',
          quantity: 1,
          price: this.DEFAULT_PRICES.thermostat,
          unit: 'each',
          scope: 'floor_construction',
          source: 'calculated',
        });
      }

      // Structural materials
      if (construction.selectedPrepTasks.includes('self_leveling')) {
        const levelerBags = Math.ceil(totalSqft / 50);
        materialItems.push({
          id: 'mat-leveler',
          name: 'Self-Leveling Compound (50lb bag)',
          quantity: levelerBags,
          price: this.DEFAULT_PRICES.selfLeveler,
          unit: 'bag',
          scope: 'floor_structural',
          source: 'calculated',
        });
      }

      if (construction.selectedPrepTasks.includes('add_plywood')) {
        const plywoodSheets = Math.ceil(totalSqft / 32);
        const price =
          this.DEFAULT_PRICES.plywood[
            construction.plywoodThickness as keyof typeof this.DEFAULT_PRICES.plywood
          ] || this.DEFAULT_PRICES.plywood['3/4'];
        materialItems.push({
          id: 'mat-plywood',
          name: `${construction.plywoodThickness}" Plywood`,
          quantity: plywoodSheets,
          price: price,
          unit: 'sheet',
          scope: 'floor_structural',
          source: 'calculated',
        });

        materialItems.push({
          id: 'mat-screws',
          name: 'Floor Screws',
          quantity: 1,
          price: this.DEFAULT_PRICES.screws,
          unit: 'box',
          scope: 'floor_structural',
          source: 'calculated',
        });
      }
    }

    return materialItems;
  }

  /**
   * Calculate complete floor estimate
   */
  static calculate(
    measurements: FloorMeasurements,
    design: FloorDesign,
    construction: FloorConstruction
  ): FloorCalculationResult {
    const totalSqft = this.calculateTotalSqft(measurements);
    const wasteFactor = this.calculateWasteFactor(design.tilePattern);
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
      wasteFactor,
      laborItems,
      materialItems,
    };
  }
}
