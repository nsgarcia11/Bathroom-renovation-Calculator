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
    scope: 'construction',
    source: 'auto',
  },
  installAcrylicBase: {
    id: 'lab-base-acrylic',
    name: 'Install Acrylic Base',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction',
    source: 'auto',
  },

  // Tiled Base - Design Labor
  tileBase: {
    id: 'lab-base-tile',
    name: 'Tile Shower Base',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'design',
    source: 'auto',
  },
  buildCurb: {
    id: 'lab-base-curb',
    name: 'Build Curb',
    hours: '2',
    rate: contractorHourlyRate.toString(),
    scope: 'design',
    source: 'auto',
  },
  buildCurblessEntry: {
    id: 'lab-base-curbless',
    name: 'Build Curbless Entry',
    hours: '8',
    rate: contractorHourlyRate.toString(),
    scope: 'design',
    source: 'auto',
  },
  installRegularDrain: {
    id: 'lab-base-drain-reg',
    name: 'Install Regular Drain',
    hours: '1.5',
    rate: contractorHourlyRate.toString(),
    scope: 'design',
    source: 'auto',
  },
  installLinearDrain: {
    id: 'lab-base-drain-linear',
    name: 'Install Linear Drain',
    hours: '3',
    rate: contractorHourlyRate.toString(),
    scope: 'design',
    source: 'auto',
  },

  // Waterproofing Systems
  installKerdiSystem: {
    id: 'lab-base-kerdi',
    name: 'Install Schluter-Kerdi System',
    hours: '6',
    rate: contractorHourlyRate.toString(),
    scope: 'construction',
    source: 'auto',
  },
  installLiquidMembrane: {
    id: 'lab-base-liquid',
    name: 'Install Liquid Membrane',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction',
    source: 'auto',
  },
  installKerdiBoard: {
    id: 'lab-base-kerdi-board',
    name: 'Install Kerdi-Board',
    hours: '5',
    rate: contractorHourlyRate.toString(),
    scope: 'construction',
    source: 'auto',
  },

  // General Construction
  subfloorRepair: {
    id: 'lab-base-subfloor',
    name: 'Subfloor Repair',
    hours: '4',
    rate: contractorHourlyRate.toString(),
    scope: 'construction',
    source: 'auto',
  },
  joistModification: {
    id: 'lab-base-joist',
    name: 'Joist Modification',
    hours: '6',
    rate: contractorHourlyRate.toString(),
    scope: 'construction',
    source: 'auto',
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
    scope: 'construction',
    source: 'auto',
  },
  acrylicBase: {
    id: 'mat-base-acrylic',
    name: 'Acrylic Base',
    quantity: '1',
    unit: 'each',
    price: '500.00',
    scope: 'construction',
    source: 'auto',
  },

  // Drain Materials
  regularDrain: {
    id: 'mat-base-drain-reg',
    name: 'Regular Drain',
    quantity: '1',
    unit: 'each',
    price: '50.00',
    scope: 'design',
    source: 'auto',
  },
  linearDrain: {
    id: 'mat-base-drain-linear',
    name: 'Linear Drain',
    quantity: '1',
    unit: 'each',
    price: '350.00',
    scope: 'design',
    source: 'auto',
  },

  // Waterproofing Materials
  kerdiKit: {
    id: 'mat-base-kerdi-kit',
    name: 'Schluter-Kerdi Kit',
    quantity: '1',
    unit: 'kit',
    price: '200.00',
    scope: 'construction',
    source: 'auto',
  },
  liquidMembrane: {
    id: 'mat-base-liquid-membrane',
    name: 'Liquid Membrane',
    quantity: '1',
    unit: 'gallon',
    price: '80.00',
    scope: 'construction',
    source: 'auto',
  },
  kerdiBoard: {
    id: 'mat-base-kerdi-board',
    name: 'Kerdi-Board',
    quantity: '1',
    unit: 'sheet',
    price: '120.00',
    scope: 'construction',
    source: 'auto',
  },

  // General Construction Materials
  subfloorPlywood: {
    id: 'mat-base-subfloor',
    name: 'Subfloor Plywood',
    quantity: '1',
    unit: 'sheet',
    price: '45.00',
    scope: 'construction',
    source: 'auto',
  },
  joistLumber: {
    id: 'mat-base-joist',
    name: 'Joist Lumber',
    quantity: '1',
    unit: 'board',
    price: '25.00',
    scope: 'construction',
    source: 'auto',
  },
};
