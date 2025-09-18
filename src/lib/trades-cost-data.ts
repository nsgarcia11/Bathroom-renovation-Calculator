import type { CostData, TradeRates, ProvinceTaxRates } from '@/types/trades';

// NOTE: All pricing below is for demonstration purposes. Prices have been updated to reflect September 2025 Home Depot Canada values.
// For accurate estimates, please confirm these labor rates and material prices with current values for your location.
export const COST_DATA: { [key: string]: CostData } = {
  // Demolition Tasks - Priced hourly as scope can vary
  demolish_vanity: {
    category: 'demolition',
    labor: [
      {
        id: 'lab-demo-vanity',
        name: 'Demolish and remove vanity',
        hours: 1.5,
        rateKey: 'demolition',
        pricingModel: 'hourly',
        category: 'demolition',
        totalCost: 0,
      },
    ],
    materials: [],
  },
  demolish_toilet: {
    category: 'demolition',
    labor: [
      {
        id: 'lab-demo-toilet',
        name: 'Demolish and remove toilet',
        hours: 1,
        rateKey: 'demolition',
        pricingModel: 'hourly',
        category: 'demolition',
        totalCost: 0,
      },
    ],
    materials: [],
  },
  demolish_shower_surround: {
    category: 'demolition',
    labor: [
      {
        id: 'lab-demo-shower',
        name: 'Demolish shower surround to studs',
        hours: 4,
        rateKey: 'demolition',
        pricingModel: 'hourly',
        category: 'demolition',
        totalCost: 0,
      },
    ],
    materials: [],
  },
  demolish_flooring: {
    category: 'demolition',
    labor: [
      {
        id: 'lab-demo-floor',
        name: 'Demolish flooring and underlayment',
        hours: 3,
        rateKey: 'demolition',
        pricingModel: 'hourly',
        category: 'demolition',
        totalCost: 0,
      },
    ],
    materials: [],
  },

  // Flooring Tasks - Priced hourly as complexity depends on tile size/pattern
  install_ditra: {
    category: 'flooring',
    labor: [
      {
        id: 'lab-install-ditra',
        name: 'Install Ditra uncoupling membrane',
        hours: 4,
        rateKey: 'flooring',
        pricingModel: 'hourly',
        category: 'flooring',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-ditra',
        name: 'Schluter Ditra Membrane (54 sqft)',
        quantity: 1,
        price: 120.0,
        unit: 'roll',
        category: 'flooring',
        totalCost: 0,
      },
    ],
  },
  install_floor_tile: {
    category: 'flooring',
    labor: [
      {
        id: 'lab-install-tile',
        name: 'Install floor tile (per 50 sqft)',
        hours: 8,
        rateKey: 'flooring',
        pricingModel: 'hourly',
        category: 'flooring',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-thin-set',
        name: 'Thinset Mortar (50lb)',
        quantity: 1,
        price: 25.0,
        unit: 'bag',
        category: 'flooring',
        totalCost: 0,
      },
      {
        id: 'mat-grout',
        name: 'Grout (10lb)',
        quantity: 1,
        price: 20.0,
        unit: 'bag',
        category: 'flooring',
        totalCost: 0,
      },
    ],
  },
  install_vinyl_plank: {
    category: 'flooring',
    labor: [
      {
        id: 'lab-install-vinyl',
        name: 'Install vinyl plank flooring (per 50 sqft)',
        hours: 5,
        rateKey: 'flooring',
        pricingModel: 'hourly',
        category: 'flooring',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-vinyl-plank',
        name: 'Vinyl Plank Flooring (per sqft)',
        quantity: 50,
        price: 4.5,
        unit: 'sqft',
        category: 'flooring',
        totalCost: 0,
      },
    ],
  },

  // Plumbing Tasks - Hybrid pricing model with updated Toronto/Ottawa flat rates
  rough_in_plumbing: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-rough-in-plumbing',
        name: 'Rough-in new plumbing',
        hours: 16,
        rateKey: 'plumbing',
        pricingModel: 'hourly',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-pex-a',
        name: 'PEX-A Plumbing Pipe (100ft)',
        quantity: 1,
        price: 35.0,
        unit: 'roll',
        category: 'plumbing',
        totalCost: 0,
      },
      {
        id: 'mat-plumbing-fittings',
        name: 'Plumbing Fittings Assortment',
        quantity: 1,
        price: 65.0,
        unit: 'box',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  move_toilet_drain: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-move-toilet-drain',
        name: 'Move toilet drain and supply',
        hours: 5,
        rateKey: 'plumbing',
        pricingModel: 'hourly',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-pvc-pipe',
        name: '1.5-in. PVC Drain Pipe (10ft)',
        quantity: 1,
        price: 10.0,
        unit: 'length',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  install_new_shower_valve: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-install-shower-valve',
        name: 'Install new shower valve',
        price: 500,
        hours: 4,
        rateKey: 'plumbing',
        pricingModel: 'flat',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-shower-valve',
        name: 'Pressure-Balance Shower Valve',
        quantity: 1,
        price: 95.0,
        unit: 'unit',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  install_vanity_plumbing: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-install-vanity-plumbing',
        name: 'Install vanity sink plumbing',
        price: 220,
        hours: 2,
        rateKey: 'plumbing',
        pricingModel: 'flat',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-vanity-kit',
        name: 'P-Trap Vanity Plumbing Kit',
        quantity: 1,
        price: 14.0,
        unit: 'kit',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  move_drain: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-move-drain',
        name: 'Move drain',
        hours: 4,
        rateKey: 'plumbing',
        pricingModel: 'hourly',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-pvc-pipe-drain',
        name: '1.5-in. PVC Drain Pipe (10ft)',
        quantity: 1,
        price: 10.0,
        unit: 'length',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  install_standalone_tub_roughin: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-standalone-tub-roughin',
        name: 'Rough-in for stand-alone tub',
        hours: 6,
        rateKey: 'plumbing',
        pricingModel: 'hourly',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-standalone-tub-kit',
        name: 'Freestanding Tub Rough-in Kit',
        quantity: 1,
        price: 180.0,
        unit: 'kit',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  install_toilet: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-install-toilet',
        name: 'Install new toilet',
        price: 200,
        hours: 1.5,
        rateKey: 'plumbing',
        pricingModel: 'flat',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-toilet-kit',
        name: 'Toilet Wax Ring & Bolt Kit',
        quantity: 1,
        price: 10.0,
        unit: 'kit',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  install_faucet: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-install-faucet',
        name: 'Install vanity faucet & supply lines',
        price: 165,
        hours: 1.5,
        rateKey: 'plumbing',
        pricingModel: 'flat',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-faucet-supply',
        name: 'Braided Faucet Supply Lines (Pair)',
        quantity: 1,
        price: 15.0,
        unit: 'pair',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  install_shower_trim: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-install-shower-trim',
        name: 'Install shower & tub trim kit',
        price: 175,
        hours: 1.5,
        rateKey: 'plumbing',
        pricingModel: 'flat',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-plumbers-putty',
        name: "Plumber's Putty",
        quantity: 1,
        price: 5.0,
        unit: 'container',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },
  install_standalone_tub_finishing: {
    category: 'plumbing',
    labor: [
      {
        id: 'lab-standalone-tub-finish',
        name: 'Install stand-alone tub & filler faucet',
        price: 600,
        hours: 4,
        rateKey: 'plumbing',
        pricingModel: 'flat',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-silicone',
        name: 'Silicone Sealant',
        quantity: 1,
        price: 12.0,
        unit: 'tube',
        category: 'plumbing',
        totalCost: 0,
      },
    ],
  },

  // Electrical Tasks - Hybrid pricing model with updated Toronto/Ottawa flat rates
  install_new_outlet: {
    category: 'electrical',
    labor: [
      {
        id: 'lab-install-outlet',
        name: 'Install new outlet',
        price: 150,
        hours: 1.5,
        rateKey: 'electrical',
        pricingModel: 'flat',
        category: 'electrical',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-electrical-wire',
        name: '14/2 NMD90 Electrical Wire (10m)',
        quantity: 1,
        price: 33.0,
        unit: 'roll',
        category: 'electrical',
        totalCost: 0,
      },
      {
        id: 'mat-outlet-box',
        name: 'Single Gang Outlet Box',
        quantity: 1,
        price: 3.0,
        unit: 'box',
        category: 'electrical',
        totalCost: 0,
      },
      {
        id: 'mat-outlet',
        name: 'Standard Duplex Outlet',
        quantity: 1,
        price: 1.0,
        unit: 'unit',
        category: 'electrical',
        totalCost: 0,
      },
    ],
  },
  install_new_gfci: {
    category: 'electrical',
    labor: [
      {
        id: 'lab-install-gfci',
        name: 'Install new GFCI outlet',
        price: 175,
        hours: 1,
        rateKey: 'electrical',
        pricingModel: 'flat',
        category: 'electrical',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-gfci-outlet',
        name: 'GFCI Outlet',
        quantity: 1,
        price: 26.0,
        unit: 'unit',
        category: 'electrical',
        totalCost: 0,
      },
    ],
  },
  install_light_fixture: {
    category: 'electrical',
    labor: [
      {
        id: 'lab-install-light-fixture',
        name: 'Install new light fixture',
        price: 145,
        hours: 1.5,
        rateKey: 'electrical',
        pricingModel: 'flat',
        category: 'electrical',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-light-box',
        name: 'Octagonal Light Box',
        quantity: 1,
        price: 6.0,
        unit: 'box',
        category: 'electrical',
        totalCost: 0,
      },
    ],
  },
  install_exhaust_fan: {
    category: 'electrical',
    labor: [
      {
        id: 'lab-install-exhaust-fan',
        name: 'Install new exhaust fan',
        price: 300,
        hours: 3,
        rateKey: 'electrical',
        pricingModel: 'flat',
        category: 'electrical',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-exhaust-fan',
        name: 'Standard Bathroom Exhaust Fan',
        quantity: 1,
        price: 55.0,
        unit: 'unit',
        category: 'electrical',
        totalCost: 0,
      },
      {
        id: 'mat-ducting-fan',
        name: '4-in. Flexible Vent Ducting (8ft)',
        quantity: 1,
        price: 16.0,
        unit: 'roll',
        category: 'electrical',
        totalCost: 0,
      },
    ],
  },

  // HVAC Tasks - Re-categorized into Rough-in and Finishings
  install_hvac_duct_run: {
    category: 'hvac',
    labor: [
      {
        id: 'lab-install-hvac-run',
        name: 'Install new ductwork for one vent run',
        hours: 8,
        rateKey: 'hvac',
        pricingModel: 'hourly',
        category: 'hvac',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-ducting',
        name: '6-in. Insulated Flexible Duct (25ft)',
        quantity: 1,
        price: 39.0,
        unit: 'roll',
        category: 'hvac',
        totalCost: 0,
      },
      {
        id: 'mat-duct-tape',
        name: 'HVAC Foil Tape',
        quantity: 1,
        price: 24.0,
        unit: 'roll',
        category: 'hvac',
        totalCost: 0,
      },
    ],
  },
  relocate_hvac_vent: {
    category: 'hvac',
    labor: [
      {
        id: 'lab-relocate-hvac-vent',
        name: 'Relocate ductwork for one vent',
        hours: 3,
        rateKey: 'hvac',
        pricingModel: 'hourly',
        category: 'hvac',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-ducting-vent',
        name: '4-in. Flexible Ducting (5ft)',
        quantity: 1,
        price: 10.0,
        unit: 'length',
        category: 'hvac',
        totalCost: 0,
      },
      {
        id: 'mat-register-boot',
        name: 'Register Boot',
        quantity: 1,
        price: 12.5,
        unit: 'unit',
        category: 'hvac',
        totalCost: 0,
      },
    ],
  },
  install_vent_register: {
    category: 'hvac',
    labor: [
      {
        id: 'lab-install-vent-register',
        name: 'Install vent register',
        price: 50,
        hours: 0.5,
        rateKey: 'hvac',
        pricingModel: 'flat',
        category: 'hvac',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-vent-register',
        name: 'Floor/Wall Register',
        quantity: 1,
        price: 15.0,
        unit: 'unit',
        category: 'hvac',
        totalCost: 0,
      },
    ],
  },
  install_wall_heater: {
    category: 'hvac',
    labor: [
      {
        id: 'lab-install-wall-heater',
        name: 'Install and wire a wall heater',
        price: 500,
        hours: 4,
        rateKey: 'hvac',
        pricingModel: 'flat',
        category: 'hvac',
        totalCost: 0,
      },
    ],
    materials: [
      {
        id: 'mat-wall-heater',
        name: 'Electric Fan Wall Heater',
        quantity: 1,
        price: 140.0,
        unit: 'unit',
        category: 'hvac',
        totalCost: 0,
      },
      {
        id: 'mat-thermostat',
        name: 'Line-Voltage Thermostat',
        quantity: 1,
        price: 26.0,
        unit: 'unit',
        category: 'hvac',
        totalCost: 0,
      },
    ],
  },
};

export const CATEGORY_STYLES = {
  demolition: {
    name: 'Demolition',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'text-slate-900',
  },
  flooring: {
    name: 'Flooring',
    bg: 'bg-lime-100',
    border: 'border-lime-300',
    text: 'text-slate-900',
  },
  plumbing: {
    name: 'Plumbing',
    bg: 'bg-indigo-100',
    border: 'border-indigo-300',
    text: 'text-slate-900',
  },
  electrical: {
    name: 'Electrical',
    bg: 'bg-rose-100',
    border: 'border-rose-300',
    text: 'text-slate-900',
  },
  hvac: {
    name: 'HVAC',
    bg: 'bg-teal-100',
    border: 'border-teal-300',
    text: 'text-slate-900',
  },
};

export const PROVINCE_TAX_RATES: ProvinceTaxRates = {
  AB: 0.05,
  BC: 0.12,
  MB: 0.12,
  NB: 0.15,
  NL: 0.15,
  NT: 0.05,
  NS: 0.15,
  NU: 0.05,
  ON: 0.13,
  PE: 0.15,
  QC: 0.14975,
  SK: 0.11,
  YT: 0.05,
};

export const DEFAULT_TRADE_RATES: TradeRates = {
  demolition: 75,
  flooring: 85,
  plumbing: 110,
  electrical: 95,
  hvac: 120,
};
