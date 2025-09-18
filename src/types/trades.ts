export interface TradeTask {
  id: string;
  label: string;
  hasQuantity?: boolean;
}

export interface TradeSelection {
  id: string;
  quantity: number;
}

export interface TradeChoices {
  demolition: TradeSelection[];
  flooring: TradeSelection[];
  plumbing: TradeSelection[];
  electrical: TradeSelection[];
  hvac: TradeSelection[];
  notes: string;
}

export interface TradeItem {
  id: string;
  name: string;
  category: string;
  hours?: number;
  rate?: number;
  quantity?: number;
  price?: number;
  unit?: string;
  pricingModel?: 'hourly' | 'flat';
  rateKey?: string;
  totalCost: number;
  parentTaskId?: string;
  parentCategory?: string;
  isCustom?: boolean;
}

export interface TradeRates {
  demolition: number;
  flooring: number;
  plumbing: number;
  electrical: number;
  hvac: number;
}

export interface TradeData {
  choices: TradeChoices;
  laborItems: { [category: string]: TradeItem[] };
  materialItems: { [category: string]: TradeItem[] };
  tradeRates: TradeRates;
  province: string;
}

export interface CostData {
  category: string;
  labor?: TradeItem[];
  materials?: TradeItem[];
}

export interface ProvinceTaxRates {
  [key: string]: number;
}

export interface TaskInfo {
  [taskId: string]: {
    pricingModel?: 'hourly' | 'flat';
    hours?: number;
    rate?: number;
    price?: number;
    quantity?: number;
  };
}
