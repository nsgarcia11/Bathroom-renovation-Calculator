// Canadian Provinces with Tax Rates
export const PROVINCES = {
  AB: { name: 'Alberta', taxRate: 5 },
  BC: { name: 'British Columbia', taxRate: 12 },
  MB: { name: 'Manitoba', taxRate: 12 },
  NB: { name: 'New Brunswick', taxRate: 15 },
  NL: { name: 'Newfoundland and Labrador', taxRate: 15 },
  NS: { name: 'Nova Scotia', taxRate: 15 },
  NT: { name: 'Northwest Territories', taxRate: 5 },
  NU: { name: 'Nunavut', taxRate: 5 },
  ON: { name: 'Ontario', taxRate: 13 },
  PE: { name: 'Prince Edward Island', taxRate: 15 },
  QC: { name: 'Quebec', taxRate: 14.975 },
  SK: { name: 'Saskatchewan', taxRate: 11 },
  YT: { name: 'Yukon', taxRate: 5 },
} as const;

// Currency options
export const CURRENCIES = {
  CAD: 'Canadian Dollar',
  USD: 'US Dollar',
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  address: '',
  postalCode: '',
  province: 'ON',
  hourlyRate: '75',
  taxRate: '13',
  currency: 'CAD',
};

// Demolition item order for consistent display across Design, Labor, and Estimate sections
export const DEMOLITION_ITEM_ORDER = [
  'removeFlooring',
  'removeShowerWall',
  'removeShowerBase',
  'removeTub',
  'removeVanity',
  'removeToilet',
  'removeAccessories',
  'removeWall',
] as const;

// Demolition labor items mapping
export const DEMOLITION_LABOR_ITEMS = (contractorHourlyRate: number) => ({
  removeFlooring: {
    id: 'lab-demo-floor',
    name: 'Remove Flooring',
    hours: '4',
    rate: contractorHourlyRate.toString(),
  },
  removeShowerWall: {
    id: 'lab-demo-shower',
    name: 'Remove Shower Wall',
    hours: '4',
    rate: contractorHourlyRate.toString(),
  },
  removeShowerBase: {
    id: 'lab-demo-shower-base',
    name: 'Remove Shower Base',
    hours: '2',
    rate: contractorHourlyRate.toString(),
  },
  removeTub: {
    id: 'lab-demo-tub',
    name: 'Remove Tub',
    hours: '3',
    rate: contractorHourlyRate.toString(),
  },
  removeVanity: {
    id: 'lab-demo-vanity',
    name: 'Remove Vanity',
    hours: '1.5',
    rate: contractorHourlyRate.toString(),
  },
  removeToilet: {
    id: 'lab-demo-toilet',
    name: 'Remove Toilet',
    hours: '0.5',
    rate: contractorHourlyRate.toString(),
  },
  removeAccessories: {
    id: 'lab-demo-accessories',
    name: 'Remove Accessories',
    hours: '1',
    rate: contractorHourlyRate.toString(),
  },
  removeWall: {
    id: 'lab-demo-wall',
    name: 'Remove Wall',
    hours: '6',
    rate: contractorHourlyRate.toString(),
  },
});

// Demolition materials items mapping
export const DEMOLITION_MATERIALS_ITEMS = {
  debrisDisposal: {
    id: 'mat-demo-disposal',
    name: 'Debris Disposal Fee',
    unit: 'service',
    price: '350.00',
    quantity: '1',
  },
  contractorBags: {
    id: 'mat-demo-bags',
    name: 'Heavy-Duty Contractor Bags',
    unit: 'box',
    price: '25.00',
    quantity: '1',
  },
  dustMasks: {
    id: 'mat-demo-masks',
    name: 'Dust Masks',
    unit: 'box',
    price: '20.00',
    quantity: '1',
  },
};

// Shower Walls labor items mapping
export const SHOWER_WALLS_LABOR_ITEMS = (contractorHourlyRate: number) => ({
  boarding: {
    id: 'sw-boarding',
    name: 'Boarding',
    hours: '0', // Will be calculated based on totalSqft
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  tiling: {
    id: 'sw-tiling',
    name: 'Tiling Walls', // Pattern name will be appended
    hours: '0', // Will be calculated based on totalSqft and pattern
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_design',
    source: 'calculated',
  },
  grouting: {
    id: 'sw-grouting',
    name: 'Grouting',
    hours: '0', // Will be calculated based on totalSqft
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_design',
    source: 'calculated',
  },
  silicone: {
    id: 'sw-silicone',
    name: 'Silicone',
    hours: '1.5',
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  waterproofing: {
    id: 'sw-wp',
    name: 'Waterproofing', // System name will be appended
    hours: '0', // Will be calculated based on totalSqft and system
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  niche: {
    id: 'sw-niche',
    name: 'Niche Installation',
    hours: '2.5',
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  door: {
    id: 'sw-door',
    name: 'Shower Door Installation',
    hours: '3.0',
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  doorBlocking: {
    id: 'sw-door-blocking',
    name: 'Install Blocking for Shower Door',
    hours: '2.0',
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  grabBar: {
    id: 'sw-grabbar',
    name: 'Install Grab Bar(s)', // Count will be appended
    hours: '0', // Will be calculated as 1.5 * count
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  repair: {
    id: 'sw-repair',
    name: 'Wall Repair',
    hours: '8.0',
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  reinsulate: {
    id: 'sw-reinsulate',
    name: 'Re-insulate exterior walls',
    hours: '2.0',
    rate: contractorHourlyRate.toString(),
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
});

// Shower Walls materials items mapping
export const SHOWER_WALLS_MATERIALS_ITEMS = {
  wallTile: {
    id: 'mat-walltile',
    name: 'Wall Tile', // Size will be appended
    unit: 'sq/ft',
    price: '5.00',
    quantity: '0', // Will be calculated as tileNeeded
    scope: 'showerWalls_design',
    source: 'calculated',
  },
  thinset: {
    id: 'mat-thinset',
    name: 'Thinset Mortar',
    unit: 'bag',
    price: '30.00',
    quantity: '0', // Will be calculated as ceil(totalSqft / 50)
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  grout: {
    id: 'mat-grout',
    name: 'Grout',
    unit: 'bag',
    price: '40.00',
    quantity: '0', // Will be calculated as max(1, ceil(totalSqft / 100))
    scope: 'showerWalls_design',
    source: 'calculated',
  },
  tileEdge: {
    id: 'mat-tile-edge',
    name: 'Tile Edge',
    unit: 'piece',
    price: '35.00',
    quantity: '2',
    scope: 'showerWalls_design',
    source: 'calculated',
  },
  // Waterproofing materials
  wpBoard: {
    id: 'mat-wp-board',
    name: 'Kerdi Board',
    unit: 'sheet',
    price: '100.00',
    quantity: '0', // Will be calculated as ceil(totalSqft / 32)
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  wpBand: {
    id: 'mat-wp-band',
    name: 'Kerdi Band',
    unit: 'roll',
    price: '50.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  wpScrews: {
    id: 'mat-wp-screws',
    name: 'Kerdi Screws/Washers',
    unit: 'box',
    price: '35.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  wpLiquid: {
    id: 'mat-wp-liquid',
    name: 'Waterproofing Liquid', // System name will be appended
    unit: 'gallon',
    price: '120.00',
    quantity: '0', // Will be calculated as ceil(totalSqft / 100)
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  wpFabric: {
    id: 'mat-wp-fabric',
    name: 'Reinforcing Fabric',
    unit: 'roll',
    price: '20.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  wpDrywall: {
    id: 'mat-wp-drywall',
    name: 'Moisture-Resistant Drywall',
    unit: 'sheet',
    price: '25.00',
    quantity: '0', // Will be calculated as ceil(totalSqft / 32)
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  wpMembrane: {
    id: 'mat-wp-membrane',
    name: 'Kerdi Membrane',
    unit: 'sq/ft',
    price: '2.50',
    quantity: '0', // Will be calculated as totalSqft
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  wpOther: {
    id: 'mat-wp-other',
    name: 'Waterproofing Other', // Custom name will be appended
    unit: 'kit',
    price: '150.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  // Other feature materials
  insulation: {
    id: 'mat-insulation',
    name: 'Exterior Wall Insulation',
    unit: 'roll',
    price: '75.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  niche: {
    id: 'mat-niche',
    name: 'Niche', // Size will be appended
    unit: 'piece',
    price: '100.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  door: {
    id: 'mat-door',
    name: 'Shower Door', // Type will be appended
    unit: 'piece',
    price: '800.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  doorBlocking: {
    id: 'mat-door-blocking',
    name: 'Blocking for Shower Glass Door',
    unit: 'piece',
    price: '50.00',
    quantity: '1',
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
  grabBar: {
    id: 'mat-grabbar',
    name: 'Grab Bar & Blocking',
    unit: 'piece',
    price: '50.00',
    quantity: '0', // Will be calculated as grabBar count
    scope: 'showerWalls_construction',
    source: 'calculated',
  },
};

// Default prices for materials
export const DEFAULT_PRICES = {
  wallTile: 5.0,
  thinset: 30.0,
  grout: 40.0,
  tileEdge: 35.0,
  kerdiBoard: 100.0,
  kerdiBand: 50.0,
  kerdiScrews: 35.0,
  waterproofingLiquid: 120.0,
  reinforcingFabric: 20.0,
  moistureResistantDrywall: 25.0,
  kerdiMembrane: 2.5,
  waterproofingOther: 150.0,
  insulation: 75.0,
  niche: 100.0,
  showerDoor: 800.0,
  doorBlocking: 50.0,
  grabBar: 50.0,
};

// Shower Base labor items mapping
export const SHOWER_BASE_LABOR_ITEMS = (contractorHourlyRate: number) => ({
  // Tub/Acrylic Base Installation
  installTub: {
    id: 'lab-base-tub',
    name: 'Install Tub',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installAcrylicBase: {
    id: 'lab-base-acrylic',
    name: 'Install Acrylic Base',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Tiled Base - Design Labor
  tileBase: {
    id: 'lab-base-tile',
    name: 'Tile Shower Base',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  buildCurb: {
    id: 'lab-base-curb',
    name: 'Build Curb',
    hours: '2',
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  buildCurblessEntry: {
    id: 'lab-base-curbless',
    name: 'Build Curbless Entry',
    hours: '8',
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  installRegularDrain: {
    id: 'lab-base-drain-reg',
    name: 'Install Regular Drain',
    hours: '1.5',
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  installLinearDrain: {
    id: 'lab-base-drain-linear',
    name: 'Install Linear Drain',
    hours: '3',
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },

  // Waterproofing Systems
  installKerdiSystem: {
    id: 'lab-base-kerdi',
    name: 'Install Schluter-Kerdi System',
    hours: '6',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installLiquidMembrane: {
    id: 'lab-base-liquid',
    name: 'Install Liquid Membrane',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installKerdiBoard: {
    id: 'lab-base-kerdi-board',
    name: 'Install Kerdi-Board',
    hours: '5',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // General Construction
  subfloorRepair: {
    id: 'lab-base-subfloor',
    name: 'Subfloor Repair',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  joistModification: {
    id: 'lab-base-joist',
    name: 'Joist Modification',
    hours: '6',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
});

// Shower Base materials items mapping
export const SHOWER_BASE_MATERIALS_ITEMS = {
  // Tub/Acrylic Base Materials
  tub: {
    id: 'mat-base-tub',
    name: 'Tub',
    quantity: '1',
    unit: 'each',
    price: '550.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  acrylicBase: {
    id: 'mat-base-acrylic',
    name: 'Acrylic Base',
    quantity: '1',
    unit: 'each',
    price: '500.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Drain Materials
  regularDrain: {
    id: 'mat-base-drain-reg',
    name: 'Regular Drain',
    quantity: '1',
    unit: 'each',
    price: '50.00',
    scope: 'design' as const,
    source: 'auto' as const,
  },
  linearDrain: {
    id: 'mat-base-drain-linear',
    name: 'Linear Drain',
    quantity: '1',
    unit: 'each',
    price: '350.00',
    scope: 'design' as const,
    source: 'auto' as const,
  },

  // Waterproofing Materials
  kerdiKit: {
    id: 'mat-base-kerdi-kit',
    name: 'Schluter-Kerdi Kit',
    quantity: '1',
    unit: 'kit',
    price: '200.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  liquidMembrane: {
    id: 'mat-base-liquid-membrane',
    name: 'Liquid Membrane',
    quantity: '1',
    unit: 'gallon',
    price: '80.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  kerdiBoard: {
    id: 'mat-base-kerdi-board',
    name: 'Kerdi-Board',
    quantity: '1',
    unit: 'sheet',
    price: '120.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // General Construction Materials
  subfloorPlywood: {
    id: 'mat-base-subfloor',
    name: 'Subfloor Plywood',
    quantity: '1',
    unit: 'sheet',
    price: '45.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  joistLumber: {
    id: 'mat-base-joist',
    name: 'Joist Lumber',
    quantity: '1',
    unit: 'board',
    price: '25.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
};

// Floors labor items mapping
export const FLOORS_LABOR_ITEMS = (contractorHourlyRate: number) => ({
  // Core Tiling Labor
  tileFloor: {
    id: 'lab-floor-tile',
    name: 'Tile Floor',
    hours: '0', // Will be calculated as totalSqFt / 3
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  groutFloor: {
    id: 'lab-floor-grout',
    name: 'Grout Floor',
    hours: '0', // Will be calculated as totalSqFt / 30
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },

  // Prep Work Labor
  selfLeveling: {
    id: 'lab-floor-leveling',
    name: 'Self-Leveling',
    hours: '0', // Will be calculated as totalSqFt / 75
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installDitra: {
    id: 'lab-floor-ditra',
    name: 'Install Ditra Membrane',
    hours: '0', // Will be calculated as totalSqFt / 100
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installDitraXL: {
    id: 'lab-floor-ditra-xl',
    name: 'Install Ditra XL Membrane',
    hours: '0', // Will be calculated as totalSqFt / 100
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installPlywood: {
    id: 'lab-floor-plywood',
    name: 'Install Plywood Subfloor',
    hours: '0', // Will be calculated as totalSqFt / 50
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installHeatedFloor: {
    id: 'lab-floor-heated',
    name: 'Install Heated Floor System',
    hours: '0', // Will be calculated as 2 + (totalSqFt / 20)
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Repair Work Labor
  repairSubfloor: {
    id: 'lab-floor-repair-subfloor',
    name: 'Repair Portion of Subfloor',
    hours: '3',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  repairJoist: {
    id: 'lab-floor-repair-joist',
    name: 'Repair Floor Joist',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
});

// Floors materials items mapping
export const FLOORS_MATERIALS_ITEMS = {
  // Design Materials
  floorTile: {
    id: 'mat-floor-tile',
    name: 'Floor Tile',
    quantity: '0', // Will be calculated as totalSqFt * wasteFactor
    unit: 'sq/ft',
    price: '5.00',
    scope: 'design' as const,
    source: 'auto' as const,
  },

  // Construction Materials
  thinset: {
    id: 'mat-floor-thinset',
    name: 'Thinset Mortar (50lb bag)',
    quantity: '0', // Will be calculated based on coverage
    unit: 'bag',
    price: '30.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  grout: {
    id: 'mat-floor-grout',
    name: 'Sanded Grout (25lb bag)',
    quantity: '0', // Will be calculated as ceil(totalSqFt / 125)
    unit: 'bag',
    price: '30.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Membrane Materials
  ditra: {
    id: 'mat-floor-ditra',
    name: 'Ditra Uncoupling Membrane',
    quantity: '0', // Will be calculated as ceil(totalSqFt / 54)
    unit: 'roll',
    price: '165.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  ditraXL: {
    id: 'mat-floor-ditra-xl',
    name: 'Ditra XL Uncoupling Membrane',
    quantity: '0', // Will be calculated as ceil(totalSqFt / 175)
    unit: 'roll',
    price: '462.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Heated Floor Materials
  heatedFloorKit: {
    id: 'mat-floor-heated-kit',
    name: 'Heated Floor Kit',
    quantity: '0', // Will be calculated as ceil(totalSqFt / 40)
    unit: 'kit',
    price: '400.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  heatedFloorThermostat: {
    id: 'mat-floor-thermostat',
    name: 'Heated Floor Thermostat',
    quantity: '1',
    unit: 'each',
    price: '220.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Structural Materials
  selfLevelingCompound: {
    id: 'mat-floor-leveling',
    name: 'Self-Leveling Compound (50lb bag)',
    quantity: '0', // Will be calculated as ceil(totalSqFt / 50)
    unit: 'bag',
    price: '45.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  plywood: {
    id: 'mat-floor-plywood',
    name: 'Plywood Subfloor',
    quantity: '0', // Will be calculated as ceil(totalSqFt / 32)
    unit: 'sheet',
    price: '70.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  floorScrews: {
    id: 'mat-floor-screws',
    name: 'Floor Screws',
    quantity: '1',
    unit: 'box',
    price: '18.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
};

// Finishings labor items mapping
export const FINISHINGS_LABOR_ITEMS = (contractorHourlyRate: number) => ({
  // Paint Labor
  paintWalls: {
    id: 'lab-finish-paint-walls',
    name: 'Paint Walls',
    hours: '0', // Will be calculated based on wall area
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  paintCeiling: {
    id: 'lab-finish-paint-ceiling',
    name: 'Paint Ceiling',
    hours: '0', // Will be calculated based on ceiling area
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  paintTrim: {
    id: 'lab-finish-paint-trim',
    name: 'Paint Trim & Baseboards',
    hours: '0', // Will be calculated based on perimeter
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },

  // Installation Labor
  installVanity: {
    id: 'lab-finish-vanity',
    name: 'Install Vanity',
    hours: '4', // Base hours + sink addon
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installMirror: {
    id: 'lab-finish-mirror',
    name: 'Install Mirror',
    hours: '2',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installLighting: {
    id: 'lab-finish-lighting',
    name: 'Install Lighting',
    hours: '3',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installToilet: {
    id: 'lab-finish-toilet',
    name: 'Install Toilet',
    hours: '2',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installBaseboards: {
    id: 'lab-finish-baseboards',
    name: 'Install Baseboards',
    hours: '0', // Will be calculated based on perimeter
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Accent Wall Labor
  tileAccentWall: {
    id: 'lab-finish-tile-accent',
    name: 'Tile Accent Wall',
    hours: '0', // Will be calculated based on wall area
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  wainscotAccentWall: {
    id: 'lab-finish-wainscot-accent',
    name: 'Wainscot Accent Wall',
    hours: '0', // Will be calculated based on wall area
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
  paintAccentWall: {
    id: 'lab-finish-paint-accent',
    name: 'Paint Accent Wall',
    hours: '0', // Will be calculated based on wall area
    rate: contractorHourlyRate.toString(),
    scope: 'design' as const,
    source: 'auto' as const,
  },
});

// Finishings materials items mapping
export const FINISHINGS_MATERIALS_ITEMS = {
  // Paint Materials
  wallPaint: {
    id: 'mat-finish-wall-paint',
    name: 'Wall Paint',
    quantity: '0', // Will be calculated based on wall area
    unit: 'gallon',
    price: '45.00',
    scope: 'design' as const,
    source: 'auto' as const,
  },
  ceilingPaint: {
    id: 'mat-finish-ceiling-paint',
    name: 'Ceiling Paint',
    quantity: '0', // Will be calculated based on ceiling area
    unit: 'gallon',
    price: '35.00',
    scope: 'design' as const,
    source: 'auto' as const,
  },
  trimPaint: {
    id: 'mat-finish-trim-paint',
    name: 'Trim Paint',
    quantity: '1',
    unit: 'gallon',
    price: '50.00',
    scope: 'design' as const,
    source: 'auto' as const,
  },
  primer: {
    id: 'mat-finish-primer',
    name: 'Primer',
    quantity: '0', // Will be calculated based on total area
    unit: 'gallon',
    price: '30.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Installation Materials
  vanity: {
    id: 'mat-finish-vanity',
    name: 'Vanity',
    quantity: '1',
    unit: 'each',
    price: '0.00', // User will set price
    scope: 'design' as const,
    source: 'custom' as const,
  },
  mirror: {
    id: 'mat-finish-mirror',
    name: 'Mirror',
    quantity: '1',
    unit: 'each',
    price: '0.00', // User will set price
    scope: 'design' as const,
    source: 'custom' as const,
  },
  lighting: {
    id: 'mat-finish-lighting',
    name: 'Lighting Fixture',
    quantity: '1',
    unit: 'each',
    price: '0.00', // User will set price
    scope: 'design' as const,
    source: 'custom' as const,
  },
  toilet: {
    id: 'mat-finish-toilet',
    name: 'Toilet',
    quantity: '1',
    unit: 'each',
    price: '0.00', // User will set price
    scope: 'design' as const,
    source: 'custom' as const,
  },
  baseboards: {
    id: 'mat-finish-baseboards',
    name: 'Baseboards',
    quantity: '0', // Will be calculated based on perimeter
    unit: 'linear ft',
    price: '8.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Accent Wall Materials
  accentTile: {
    id: 'mat-finish-accent-tile',
    name: 'Accent Wall Tile',
    quantity: '0', // Will be calculated based on wall area
    unit: 'sq/ft',
    price: '0.00', // User will set price
    scope: 'design' as const,
    source: 'custom' as const,
  },
  accentWainscot: {
    id: 'mat-finish-accent-wainscot',
    name: 'Wainscot Panels',
    quantity: '0', // Will be calculated based on wall area
    unit: 'sq/ft',
    price: '0.00', // User will set price
    scope: 'design' as const,
    source: 'custom' as const,
  },
  accentPaint: {
    id: 'mat-finish-accent-paint',
    name: 'Accent Wall Paint',
    quantity: '0', // Will be calculated based on wall area
    unit: 'gallon',
    price: '45.00',
    scope: 'design' as const,
    source: 'auto' as const,
  },

  // Construction Materials
  thinset: {
    id: 'mat-finish-thinset',
    name: 'Thinset Mortar',
    quantity: '0', // Will be calculated if tiling
    unit: 'bag',
    price: '30.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  grout: {
    id: 'mat-finish-grout',
    name: 'Grout',
    quantity: '0', // Will be calculated if tiling
    unit: 'bag',
    price: '30.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  drywallTape: {
    id: 'mat-finish-drywall-tape',
    name: 'Drywall Tape',
    quantity: '2',
    unit: 'roll',
    price: '8.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  jointCompound: {
    id: 'mat-finish-joint-compound',
    name: 'Joint Compound',
    quantity: '1',
    unit: 'gallon',
    price: '15.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
};

// Structural labor items mapping
export const STRUCTURAL_LABOR_ITEMS = (contractorHourlyRate: number) => ({
  // Framing Labor
  frameNewWall: {
    id: 'lab-struct-frame-wall',
    name: 'Frame New Wall',
    hours: '8',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  removeWall: {
    id: 'lab-struct-remove-wall',
    name: 'Remove Existing Wall',
    hours: '6',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  frameDoorway: {
    id: 'lab-struct-frame-doorway',
    name: 'Frame Doorway Opening',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  frameWindow: {
    id: 'lab-struct-frame-window',
    name: 'Frame Window Opening',
    hours: '3',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Structural Support
  installBeam: {
    id: 'lab-struct-install-beam',
    name: 'Install Support Beam',
    hours: '12',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installHeader: {
    id: 'lab-struct-install-header',
    name: 'Install Header Beam',
    hours: '6',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  reinforceJoists: {
    id: 'lab-struct-reinforce-joists',
    name: 'Reinforce Floor Joists',
    hours: '8',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Subfloor Work
  installPlywood: {
    id: 'lab-struct-install-plywood',
    name: 'Install Plywood Subfloor',
    hours: '0', // Will be calculated based on area
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  repairSubfloor: {
    id: 'lab-struct-repair-subfloor',
    name: 'Repair Subfloor',
    hours: '6',
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Insulation
  installInsulation: {
    id: 'lab-struct-install-insulation',
    name: 'Install Wall Insulation',
    hours: '0', // Will be calculated based on area
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  installVaporBarrier: {
    id: 'lab-struct-vapor-barrier',
    name: 'Install Vapor Barrier',
    hours: '0', // Will be calculated based on area
    rate: contractorHourlyRate.toString(),
    scope: 'construction' as const,
    source: 'auto' as const,
  },
});

// Structural materials items mapping
export const STRUCTURAL_MATERIALS_ITEMS = {
  // Framing Materials
  lumber2x4: {
    id: 'mat-struct-2x4-lumber',
    name: '2x4 Lumber (8ft)',
    quantity: '0', // Will be calculated based on wall length
    unit: 'piece',
    price: '8.50',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  lumber2x6: {
    id: 'mat-struct-2x6-lumber',
    name: '2x6 Lumber (8ft)',
    quantity: '0', // Will be calculated based on wall length
    unit: 'piece',
    price: '12.50',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  lumber2x8: {
    id: 'mat-struct-2x8-lumber',
    name: '2x8 Lumber (8ft)',
    quantity: '0', // Will be calculated based on beam length
    unit: 'piece',
    price: '18.50',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  lumber2x10: {
    id: 'mat-struct-2x10-lumber',
    name: '2x10 Lumber (8ft)',
    quantity: '0', // Will be calculated based on beam length
    unit: 'piece',
    price: '22.50',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Hardware
  framingNails: {
    id: 'mat-struct-framing-nails',
    name: 'Framing Nails (3.5")',
    quantity: '1',
    unit: 'box',
    price: '25.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  constructionScrews: {
    id: 'mat-struct-construction-screws',
    name: 'Construction Screws (3")',
    quantity: '1',
    unit: 'box',
    price: '35.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  metalBrackets: {
    id: 'mat-struct-metal-brackets',
    name: 'Metal Brackets & Connectors',
    quantity: '1',
    unit: 'set',
    price: '45.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Subfloor Materials
  plywoodSubfloor: {
    id: 'mat-struct-plywood-subfloor',
    name: 'Plywood Subfloor (4x8)',
    quantity: '0', // Will be calculated based on area
    unit: 'sheet',
    price: '0.00', // Will be set based on thickness
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  subfloorScrews: {
    id: 'mat-struct-subfloor-screws',
    name: 'Subfloor Screws (2.5")',
    quantity: '1',
    unit: 'box',
    price: '28.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Insulation Materials
  wallInsulation: {
    id: 'mat-struct-wall-insulation',
    name: 'Wall Insulation (R-20)',
    quantity: '0', // Will be calculated based on area
    unit: 'sq/ft',
    price: '1.25',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  vaporBarrier: {
    id: 'mat-struct-vapor-barrier',
    name: 'Vapor Barrier (6 mil)',
    quantity: '0', // Will be calculated based on area
    unit: 'sq/ft',
    price: '0.15',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  insulationTape: {
    id: 'mat-struct-insulation-tape',
    name: 'Insulation Tape',
    quantity: '2',
    unit: 'roll',
    price: '8.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Beam Materials
  steelBeam: {
    id: 'mat-struct-steel-beam',
    name: 'Steel Support Beam',
    quantity: '0', // Will be calculated based on length
    unit: 'linear ft',
    price: '0.00', // User will set price
    scope: 'design' as const,
    source: 'custom' as const,
  },
  beamPockets: {
    id: 'mat-struct-beam-pockets',
    name: 'Beam Pockets & Hardware',
    quantity: '1',
    unit: 'set',
    price: '85.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },

  // Drywall Materials
  drywallSheets: {
    id: 'mat-struct-drywall-sheets',
    name: 'Drywall Sheets (4x8)',
    quantity: '0', // Will be calculated based on area
    unit: 'sheet',
    price: '12.50',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  drywallScrews: {
    id: 'mat-struct-drywall-screws',
    name: 'Drywall Screws (1.25")',
    quantity: '1',
    unit: 'box',
    price: '15.00',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
  cornerBead: {
    id: 'mat-struct-corner-bead',
    name: 'Corner Bead (8ft)',
    quantity: '0', // Will be calculated based on perimeter
    unit: 'piece',
    price: '3.50',
    scope: 'construction' as const,
    source: 'auto' as const,
  },
};

// Trade workflow constants
export const TRADE_CATEGORIES = {
  plumbing: {
    id: 'plumbing',
    name: 'Plumbing',
    defaultRate: 110,
    color: 'text-blue-600',
    icon: '🔧',
  },
  electrical: {
    id: 'electrical',
    name: 'Electrical',
    defaultRate: 120,
    color: 'text-yellow-600',
    icon: '⚡',
  },
  hvac: {
    id: 'hvac',
    name: 'HVAC',
    defaultRate: 130,
    color: 'text-green-600',
    icon: '🌡️',
  },
  flooring: {
    id: 'flooring',
    name: 'Flooring',
    defaultRate: 100,
    color: 'text-purple-600',
    icon: '🏠',
  },
  tiling: {
    id: 'tiling',
    name: 'Tiling',
    defaultRate: 95,
    color: 'text-orange-600',
    icon: '🔲',
  },
  painting: {
    id: 'painting',
    name: 'Painting',
    defaultRate: 85,
    color: 'text-pink-600',
    icon: '🎨',
  },
  carpentry: {
    id: 'carpentry',
    name: 'Carpentry',
    defaultRate: 90,
    color: 'text-amber-600',
    icon: '🔨',
  },
  drywall: {
    id: 'drywall',
    name: 'Drywall',
    defaultRate: 80,
    color: 'text-gray-600',
    icon: '📋',
  },
} as const;

export const TRADE_TASKS = {
  plumbing: [
    {
      id: 'install_toilet',
      name: 'Install Toilet',
      defaultHours: 2,
      defaultPrice: 150,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_vanity',
      name: 'Install Vanity',
      defaultHours: 4,
      defaultPrice: 200,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_shower_valve',
      name: 'Install Shower Valve',
      defaultHours: 3,
      defaultPrice: 180,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_drain',
      name: 'Install Drain',
      defaultHours: 2,
      defaultPrice: 120,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'rough_in_plumbing',
      name: 'Rough-in Plumbing',
      defaultHours: 8,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
  ],
  electrical: [
    {
      id: 'install_outlets',
      name: 'Install Outlets',
      defaultHours: 1,
      defaultPrice: 75,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_lighting',
      name: 'Install Lighting',
      defaultHours: 2,
      defaultPrice: 100,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_switch',
      name: 'Install Switch',
      defaultHours: 0.5,
      defaultPrice: 50,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'rough_in_electrical',
      name: 'Rough-in Electrical',
      defaultHours: 6,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_gfci',
      name: 'Install GFCI Outlets',
      defaultHours: 1.5,
      defaultPrice: 90,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
  ],
  hvac: [
    {
      id: 'install_vent_fan',
      name: 'Install Vent Fan',
      defaultHours: 3,
      defaultPrice: 200,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_ductwork',
      name: 'Install Ductwork',
      defaultHours: 4,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_thermostat',
      name: 'Install Thermostat',
      defaultHours: 1,
      defaultPrice: 80,
      pricingModel: 'flat' as const,
      scope: 'construction' as const,
    },
  ],
  flooring: [
    {
      id: 'install_flooring',
      name: 'Install Flooring',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'prep_subfloor',
      name: 'Prep Subfloor',
      defaultHours: 2,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
  ],
  tiling: [
    {
      id: 'install_tile',
      name: 'Install Tile',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'grout_tile',
      name: 'Grout Tile',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
  ],
  painting: [
    {
      id: 'paint_walls',
      name: 'Paint Walls',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'paint_ceiling',
      name: 'Paint Ceiling',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'paint_trim',
      name: 'Paint Trim',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
  ],
  carpentry: [
    {
      id: 'install_baseboard',
      name: 'Install Baseboard',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'install_crown_molding',
      name: 'Install Crown Molding',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'build_cabinet',
      name: 'Build Cabinet',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
  ],
  drywall: [
    {
      id: 'install_drywall',
      name: 'Install Drywall',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'tape_drywall',
      name: 'Tape Drywall',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
    {
      id: 'mud_drywall',
      name: 'Mud Drywall',
      defaultHours: 0,
      defaultPrice: 0,
      pricingModel: 'hourly' as const,
      scope: 'construction' as const,
    },
  ],
} as const;

export const TRADE_MATERIALS = {
  plumbing: [
    {
      id: 'mat-plumb-toilet',
      name: 'Toilet',
      quantity: '1',
      unit: 'each',
      price: '300.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
    {
      id: 'mat-plumb-vanity',
      name: 'Vanity',
      quantity: '1',
      unit: 'each',
      price: '500.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
    {
      id: 'mat-plumb-valve',
      name: 'Shower Valve',
      quantity: '1',
      unit: 'each',
      price: '150.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
    {
      id: 'mat-plumb-drain',
      name: 'Drain Assembly',
      quantity: '1',
      unit: 'each',
      price: '80.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
  ],
  electrical: [
    {
      id: 'mat-elect-outlet',
      name: 'Outlet',
      quantity: '4',
      unit: 'each',
      price: '15.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
    {
      id: 'mat-elect-switch',
      name: 'Switch',
      quantity: '2',
      unit: 'each',
      price: '12.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
    {
      id: 'mat-elect-wire',
      name: 'Electrical Wire',
      quantity: '100',
      unit: 'ft',
      price: '2.50',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
  ],
  hvac: [
    {
      id: 'mat-hvac-fan',
      name: 'Vent Fan',
      quantity: '1',
      unit: 'each',
      price: '120.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
    {
      id: 'mat-hvac-duct',
      name: 'Ductwork',
      quantity: '20',
      unit: 'ft',
      price: '8.00',
      scope: 'construction' as const,
      source: 'auto' as const,
    },
  ],
} as const;
