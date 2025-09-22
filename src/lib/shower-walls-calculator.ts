/**
 * Shower Walls Business Logic Calculator
 * Implements the complete business logic for shower walls calculations
 * including waste factors, auto labor, and auto materials generation
 */

export interface Wall {
  id: string;
  name: string;
  height: { ft: number; inch: number };
  width: { ft: number; inch: number };
}

export interface ShowerWallsDesign {
  tileSize: string;
  customTileWidth: string;
  customTileLength: string;
  tilePattern: string;
  customTilePatternName: string;
  niche: string;
  showerDoor: string;
  waterproofingSystem: string;
  customWaterproofingName: string;
  grabBar: string;
  notes: string;
  constructionNotes: string;
  clientSuppliesBase: string;
  repairWalls: boolean;
  reinsulateWalls: boolean;
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

export interface ShowerWallsCalculationResult {
  totalSqft: number;
  wasteFactor: number;
  tileNeeded: number;
  laborItems: LaborItem[];
  materialItems: MaterialItem[];
  wasteNote?: string | null;
}

export class ShowerWallsCalculator {
  private static readonly DEFAULT_HOURLY_RATE = 85.0;
  private static readonly DEFAULT_PRICES = {
    wallTile: 5.0,
    thinset: 30.0,
    grout: 40.0,
    tileEdge: 35.0,
    kerdiBoard: 100.0,
    kerdiBand: 50.0,
    kerdiScrews: 35.0,
    liquidWaterproofing: 120.0,
    reinforcingFabric: 20.0,
    drywall: 25.0,
    kerdiMembrane: 2.5,
    otherWaterproofing: 150.0,
    insulation: 75.0,
    niche: 100.0,
    showerDoor: 800.0,
    doorBlocking: 50.0,
    grabBar: 50.0,
  };

  /**
   * Calculate square footage for a single wall
   */
  static calculateWallSqft(wall: Wall): number {
    const heightInFeet = wall.height.ft + wall.height.inch / 12;
    const widthInFeet = wall.width.ft + wall.width.inch / 12;
    return heightInFeet * widthInFeet;
  }

  /**
   * Calculate total square footage for all walls
   */
  static calculateTotalSqft(walls: Wall[]): number {
    return walls.reduce(
      (total, wall) => total + this.calculateWallSqft(wall),
      0
    );
  }

  /**
   * Calculate waste factor based on tile pattern
   */
  static calculateWasteFactor(tilePattern: string): number {
    switch (tilePattern) {
      case 'Herringbone':
        return 1.25;
      case '1/2 Offset':
      case '1/3 Offset':
        return 1.15;
      default:
        return 1.1;
    }
  }

  /**
   * Calculate tile needed including waste factor
   */
  static calculateTileNeeded(totalSqft: number, tilePattern: string): number {
    const wasteFactor = this.calculateWasteFactor(tilePattern);
    return totalSqft * wasteFactor;
  }

  /**
   * Calculate tiling hours based on tile size and pattern
   */
  static calculateTilingHours(
    totalSqft: number,
    tileSize: string,
    tilePattern: string
  ): number {
    // Base tiling speed
    const baseRate = tileSize.includes('Subway') ? 7 : 10; // sq/ft/hr

    // Pattern modifier
    let patternModifier = 1.0;
    if (tilePattern === '1/2 Offset' || tilePattern === '1/3 Offset') {
      patternModifier = 1.15;
    } else if (tilePattern === 'Herringbone') {
      patternModifier = 1.3;
    }

    return (totalSqft / baseRate) * patternModifier;
  }

  /**
   * Generate waste note text for UI display
   */
  static generateWasteNote(
    tileSize: string,
    tilePattern: string
  ): string | null {
    if (
      tileSize === 'Select tile size' ||
      tilePattern === 'Select Tile Pattern'
    ) {
      return null;
    }

    const wasteFactor = this.calculateWasteFactor(tilePattern);
    const wastePercentage = Math.round((wasteFactor - 1) * 100);

    return `A ${wastePercentage}% waste factor has been applied for ${tilePattern} pattern.`;
  }

  /**
   * Generate auto labor items based on design choices
   */
  static generateAutoLabor(
    walls: Wall[],
    design: ShowerWallsDesign
  ): LaborItem[] {
    const totalSqft = this.calculateTotalSqft(walls);
    const laborItems: LaborItem[] = [];

    // Only generate tiling labor if tile size is selected
    if (design.tileSize !== 'Select tile size') {
      // Boarding
      laborItems.push({
        id: 'sw-boarding',
        name: 'Boarding',
        hours: Math.round((totalSqft / 30) * 100) / 100,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });

      // Tiling
      const tilingHours = this.calculateTilingHours(
        totalSqft,
        design.tileSize,
        design.tilePattern
      );
      const patternName =
        design.tilePattern === 'Custom'
          ? design.customTilePatternName
          : design.tilePattern;
      laborItems.push({
        id: 'sw-tiling',
        name: `Tiling Walls (${patternName})`,
        hours: Math.round(tilingHours * 100) / 100,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_design',
        source: 'calculated',
      });

      // Grouting
      laborItems.push({
        id: 'sw-grouting',
        name: 'Grouting',
        hours: Math.round((totalSqft / 40) * 100) / 100,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_design',
        source: 'calculated',
      });

      // Silicone
      laborItems.push({
        id: 'sw-silicone',
        name: 'Silicone',
        hours: 1.5,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    // Features & conditions
    if (design.niche !== 'None') {
      laborItems.push({
        id: 'sw-niche',
        name: 'Niche Installation',
        hours: 2.5,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    if (design.showerDoor !== 'None') {
      laborItems.push({
        id: 'sw-door',
        name: 'Shower Door Installation',
        hours: 3.0,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });

      laborItems.push({
        id: 'sw-door-blocking',
        name: 'Install Blocking for Shower Door',
        hours: 2.0,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    const grabBarCount = parseInt(design.grabBar) || 0;
    if (grabBarCount > 0) {
      laborItems.push({
        id: 'sw-grabbar',
        name: `Install ${grabBarCount} Grab Bar(s)`,
        hours: 1.5 * grabBarCount,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    if (design.repairWalls) {
      laborItems.push({
        id: 'sw-repair',
        name: 'Wall Repair',
        hours: 8.0,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    if (design.reinsulateWalls) {
      laborItems.push({
        id: 'sw-reinsulate',
        name: 'Re-insulate exterior walls',
        hours: 2.0,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    // Waterproofing labor
    if (design.waterproofingSystem !== 'None / Select System...') {
      const wpName =
        design.waterproofingSystem === 'Other' && design.customWaterproofingName
          ? design.customWaterproofingName
          : design.waterproofingSystem;

      let wpHours: number;
      switch (design.waterproofingSystem) {
        case 'Schluter®-KERDI System':
          wpHours = totalSqft / 40;
          break;
        case 'RedGard® Waterproofing Membrane':
        case 'LATICRETE® HYDRO BAN':
          wpHours = totalSqft / 60;
          break;
        case 'Drywall and Kerdi membrane':
          wpHours = totalSqft / 25;
          break;
        default:
          wpHours = totalSqft / 40;
      }

      laborItems.push({
        id: 'sw-wp',
        name: `Waterproofing: ${wpName}`,
        hours: Math.round(wpHours * 100) / 100,
        rate: this.DEFAULT_HOURLY_RATE,
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    return laborItems;
  }

  /**
   * Generate auto materials based on design choices
   */
  static generateAutoMaterials(
    walls: Wall[],
    design: ShowerWallsDesign
  ): MaterialItem[] {
    const totalSqft = this.calculateTotalSqft(walls);
    const materialItems: MaterialItem[] = [];

    // Only generate tile materials if tile size is selected
    if (design.tileSize !== 'Select tile size') {
      // Wall tiles (only if client doesn't supply)
      if (design.clientSuppliesBase === 'No') {
        const tileNeeded = this.calculateTileNeeded(
          totalSqft,
          design.tilePattern
        );
        const tileSizeLabel =
          design.tileSize === 'Custom'
            ? `Custom ${design.customTileWidth}x${design.customTileLength}"`
            : design.tileSize;

        materialItems.push({
          id: 'mat-walltile',
          name: `Wall Tile (${tileSizeLabel})`,
          quantity: tileNeeded,
          price: this.DEFAULT_PRICES.wallTile,
          unit: 'sq/ft',
          scope: 'showerWalls_design',
          source: 'calculated',
        });
      }

      // Setting materials (always added)
      materialItems.push({
        id: 'mat-thinset',
        name: 'Thinset Mortar',
        quantity: Math.ceil(totalSqft / 50),
        price: this.DEFAULT_PRICES.thinset,
        unit: 'bag',
        scope: 'showerWalls_construction',
        source: 'calculated',
      });

      materialItems.push({
        id: 'mat-grout',
        name: 'Grout',
        quantity: Math.max(1, Math.ceil(totalSqft / 100)),
        price: this.DEFAULT_PRICES.grout,
        unit: 'bag',
        scope: 'showerWalls_design',
        source: 'calculated',
      });

      materialItems.push({
        id: 'mat-tile-edge',
        name: 'Tile Edge',
        quantity: 2,
        price: this.DEFAULT_PRICES.tileEdge,
        unit: 'piece',
        scope: 'showerWalls_design',
        source: 'calculated',
      });
    }

    // Waterproofing materials
    if (design.waterproofingSystem !== 'None / Select System...') {
      switch (design.waterproofingSystem) {
        case 'Schluter®-KERDI System':
          materialItems.push({
            id: 'mat-wp-board',
            name: 'Kerdi Board',
            quantity: Math.ceil(totalSqft / 32),
            price: this.DEFAULT_PRICES.kerdiBoard,
            unit: 'sheet',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
          materialItems.push({
            id: 'mat-wp-band',
            name: 'Kerdi Band',
            quantity: 1,
            price: this.DEFAULT_PRICES.kerdiBand,
            unit: 'roll',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
          materialItems.push({
            id: 'mat-wp-screws',
            name: 'Kerdi Screws/Washers',
            quantity: 1,
            price: this.DEFAULT_PRICES.kerdiScrews,
            unit: 'box',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
          break;

        case 'RedGard® Waterproofing Membrane':
        case 'LATICRETE® HYDRO BAN':
          materialItems.push({
            id: 'mat-wp-liquid',
            name: design.waterproofingSystem,
            quantity: Math.ceil(totalSqft / 100),
            price: this.DEFAULT_PRICES.liquidWaterproofing,
            unit: 'gallon',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
          materialItems.push({
            id: 'mat-wp-fabric',
            name: 'Reinforcing Fabric',
            quantity: 1,
            price: this.DEFAULT_PRICES.reinforcingFabric,
            unit: 'roll',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
          break;

        case 'Drywall and Kerdi membrane':
          materialItems.push({
            id: 'mat-wp-drywall',
            name: 'Moisture-Resistant Drywall',
            quantity: Math.ceil(totalSqft / 32),
            price: this.DEFAULT_PRICES.drywall,
            unit: 'sheet',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
          materialItems.push({
            id: 'mat-wp-membrane',
            name: 'Kerdi Membrane',
            quantity: totalSqft,
            price: this.DEFAULT_PRICES.kerdiMembrane,
            unit: 'sq/ft',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
          break;

        default:
          const customName =
            design.customWaterproofingName || design.waterproofingSystem;
          materialItems.push({
            id: 'mat-wp-other',
            name: customName,
            quantity: 1,
            price: this.DEFAULT_PRICES.otherWaterproofing,
            unit: 'kit',
            scope: 'showerWalls_construction',
            source: 'calculated',
          });
      }
    }

    // Other feature materials
    if (design.reinsulateWalls) {
      materialItems.push({
        id: 'mat-insulation',
        name: 'Exterior Wall Insulation',
        quantity: 1,
        price: this.DEFAULT_PRICES.insulation,
        unit: 'bundle',
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    if (design.niche !== 'None') {
      materialItems.push({
        id: 'mat-niche',
        name: `Niche: ${design.niche}`,
        quantity: 1,
        price: this.DEFAULT_PRICES.niche,
        unit: 'piece',
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    if (design.showerDoor !== 'None') {
      materialItems.push({
        id: 'mat-door',
        name: `Shower Door: ${design.showerDoor}`,
        quantity: 1,
        price: this.DEFAULT_PRICES.showerDoor,
        unit: 'door',
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
      materialItems.push({
        id: 'mat-door-blocking',
        name: 'Blocking for Shower Glass Door',
        quantity: 1,
        price: this.DEFAULT_PRICES.doorBlocking,
        unit: 'piece',
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    const grabBarCount = parseInt(design.grabBar) || 0;
    if (grabBarCount > 0) {
      materialItems.push({
        id: 'mat-grabbar',
        name: 'Grab Bar & Blocking',
        quantity: grabBarCount,
        price: this.DEFAULT_PRICES.grabBar,
        unit: 'piece',
        scope: 'showerWalls_construction',
        source: 'calculated',
      });
    }

    return materialItems;
  }

  /**
   * Calculate complete shower walls estimate
   */
  static calculate(
    walls: Wall[],
    design: ShowerWallsDesign
  ): ShowerWallsCalculationResult {
    const totalSqft = this.calculateTotalSqft(walls);
    const wasteFactor = this.calculateWasteFactor(design.tilePattern);
    const tileNeeded = this.calculateTileNeeded(totalSqft, design.tilePattern);
    const laborItems = this.generateAutoLabor(walls, design);
    const materialItems = this.generateAutoMaterials(walls, design);
    const wasteNote = this.generateWasteNote(
      design.tileSize,
      design.tilePattern
    );

    return {
      totalSqft,
      wasteFactor,
      tileNeeded,
      laborItems,
      materialItems,
      wasteNote,
    };
  }
}
