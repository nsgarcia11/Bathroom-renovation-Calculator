export interface Contractor {
  id: string;
  user_id: string;
  name: string;
  address: string;
  postal_code: string;
  phone: string;
  email: string;
  province: string;
  tax_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  contractor_id: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  project_name: string;
  project_address?: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
  updated_at: string;
  contractor?: Contractor;
}

export interface WorkflowScreen {
  id: string;
  project_id: string;
  screen_type:
    | 'demolition'
    | 'shower_walls'
    | 'shower_base'
    | 'floors'
    | 'finishings';
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  line_items?: LineItem[];
}

export interface LineItem {
  id: string;
  workflow_screen_id: string;
  item_type: 'labor' | 'material';
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: 'inactive' | 'active' | 'canceled' | 'past_due';
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowScreenData {
  measurements?: {
    walls: Array<{
      id: string;
      name: string;
      height: number;
      width: number;
      area: number;
    }>;
    total_area: number;
  };
  design?: {
    client_supplies_tiles: boolean;
    tile_size?: string;
    tile_pattern?: string;
    niche?: string;
    shower_door?: string;
    grab_bars: number;
  };
  construction?: {
    waterproofing?: string;
    re_insulate_walls: boolean;
    repair_walls: boolean;
  };
  notes?: string;
}

export interface EstimateTotals {
  labor_total: number;
  material_total: number;
  subtotal: number;
  tax: number;
  grand_total: number;
}
