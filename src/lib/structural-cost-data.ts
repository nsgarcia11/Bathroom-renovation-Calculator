import type { CostData, PlywoodThicknessData } from '@/types/structural';

// This object holds all the predefined costs for labor and materials for various tasks.
// Material prices have been updated to reflect Canadian (Ottawa/Toronto) market rates as of September 2025.
export const COST_DATA: { [key: string]: CostData } = {
  // Wall Modifications
  frame_new_wall: {
    category: 'wall',
    labor: [
      {
        id: 'lab-frame-wall',
        name: 'Frame new wall(s)',
        hours: '6',
        rate: '85',
        category: 'wall',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x4',
        name: '2x4 Lumber (8ft)',
        quantity: '15',
        price: '6.50',
        unit: 'stud',
        category: 'wall',
      },
      {
        id: 'mat-screws-framing',
        name: 'Framing Screws',
        quantity: '1',
        price: '20.00',
        unit: 'box',
        category: 'wall',
      },
    ],
  },
  remove_wall: {
    category: 'wall',
    labor: [
      {
        id: 'lab-remove-wall',
        name: 'Remove non-load bearing wall',
        hours: '6',
        rate: '85',
        category: 'wall',
      },
    ],
  },
  install_blocking: {
    category: 'wall',
    labor: [
      {
        id: 'lab-install-blocking',
        name: 'Install blocking',
        hours: '2',
        rate: '85',
        category: 'wall',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x6',
        name: '2x6 Lumber (8ft)',
        quantity: '2',
        price: '12.00',
        unit: 'board',
        category: 'wall',
      },
    ],
  },
  frame_niche: {
    category: 'wall',
    labor: [
      {
        id: 'lab-frame-niche',
        name: 'Frame shower niche',
        hours: '2.5',
        rate: '85',
        category: 'wall',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x4-niche',
        name: '2x4 Lumber (8ft)',
        quantity: '2',
        price: '6.50',
        unit: 'stud',
        category: 'wall',
      },
    ],
  },
  // Floor System
  repair_joist: {
    category: 'floor',
    labor: [
      {
        id: 'lab-repair-joist',
        name: 'Repair / sister floor joists',
        hours: '5',
        rate: '85',
        category: 'floor',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x8',
        name: '2x8 Lumber (12ft)',
        quantity: '2',
        price: '30.00',
        unit: 'board',
        category: 'floor',
      },
      {
        id: 'mat-structural-screws',
        name: 'Structural Screws',
        quantity: '1',
        price: '35.00',
        unit: 'box',
        category: 'floor',
      },
    ],
  },
  level_floor: {
    category: 'floor',
    labor: [
      {
        id: 'lab-level-floor',
        name: 'Level floor',
        hours: '3',
        rate: '85',
        category: 'floor',
      },
    ],
    materials: [
      {
        id: 'mat-leveler',
        name: 'Self-Leveling Compound (50lb)',
        quantity: '3',
        price: '60.00',
        unit: 'bag',
        category: 'floor',
      },
    ],
  },
  install_plywood: {
    category: 'floor',
    labor: [
      {
        id: 'lab-install-plywood',
        name: 'Install new plywood subfloor',
        hours: '3',
        rate: '85',
        category: 'floor',
      },
    ],
    materials: [
      {
        id: 'mat-plywood-subfloor',
        name: '3/4" Plywood Subfloor',
        quantity: '4',
        price: '70.00',
        unit: 'sheet',
        category: 'floor',
      },
      {
        id: 'mat-floor-screws',
        name: 'Subfloor Screws',
        quantity: '1',
        price: '25.00',
        unit: 'box',
        category: 'floor',
      },
    ],
  },
  replace_rotten_subfloor: {
    category: 'floor',
    labor: [
      {
        id: 'lab-replace-rotten-subfloor',
        name: 'Replace rotten subfloor',
        hours: '6',
        rate: '85',
        category: 'floor',
      },
    ],
    materials: [
      {
        id: 'mat-plywood-patch',
        name: '3/4" Plywood Subfloor (for patch)',
        quantity: '2',
        price: '70.00',
        unit: 'sheet',
        category: 'floor',
      },
      {
        id: 'mat-lumber-2x4-support',
        name: '2x4 Lumber for support',
        quantity: '3',
        price: '6.50',
        unit: 'stud',
        category: 'floor',
      },
    ],
  },
  // Window and Door Openings
  add_new_window: {
    category: 'windowDoor',
    labor: [
      {
        id: 'lab-add-window',
        name: 'Frame for new window',
        hours: '6',
        rate: '85',
        category: 'windowDoor',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x6-header',
        name: '2x6 Lumber for header',
        quantity: '2',
        price: '12.00',
        unit: 'board',
        category: 'windowDoor',
      },
      {
        id: 'mat-window-flashing',
        name: 'Window Flashing Tape',
        quantity: '1',
        price: '30.00',
        unit: 'roll',
        category: 'windowDoor',
      },
    ],
  },
  enlarge_window: {
    category: 'windowDoor',
    labor: [
      {
        id: 'lab-enlarge-window',
        name: 'Enlarge existing window opening',
        hours: '6',
        rate: '85',
        category: 'windowDoor',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x6-header-large',
        name: '2x6 Lumber for new header',
        quantity: '2',
        price: '12.00',
        unit: 'board',
        category: 'windowDoor',
      },
    ],
  },
  change_doorway: {
    category: 'windowDoor',
    labor: [
      {
        id: 'lab-change-doorway',
        name: 'Change doorway opening',
        hours: '4',
        rate: '85',
        category: 'windowDoor',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x4-door',
        name: '2x4 Lumber for door frame',
        quantity: '3',
        price: '6.50',
        unit: 'stud',
        category: 'windowDoor',
      },
    ],
  },
  close_off_window: {
    category: 'windowDoor',
    labor: [
      {
        id: 'lab-close-window',
        name: 'Frame and close off window opening',
        hours: '5',
        rate: '85',
        category: 'windowDoor',
      },
    ],
    materials: [
      {
        id: 'mat-lumber-2x4-close',
        name: '2x4 Lumber for framing',
        quantity: '4',
        price: '6.50',
        unit: 'stud',
        category: 'windowDoor',
      },
      {
        id: 'mat-sheathing-close',
        name: '1/2" Plywood Sheathing',
        quantity: '1',
        price: '40.00',
        unit: 'sheet',
        category: 'windowDoor',
      },
      {
        id: 'mat-screws-closing',
        name: 'General Purpose Screws',
        quantity: '1',
        price: '15.00',
        unit: 'box',
        category: 'windowDoor',
      },
    ],
  },
};

export const PLYWOOD_THICKNESS_OPTIONS: PlywoodThicknessData = {
  '1/2': { name: '1/2" Plywood Subfloor', price: 50.0 },
  '5/8': { name: '5/8" Plywood Subfloor', price: 60.0 },
  '3/4': { name: '3/4" Plywood Subfloor', price: 70.0 },
};
