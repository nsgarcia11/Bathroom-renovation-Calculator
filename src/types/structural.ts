export interface StructuralChoices {
  wall: string[];
  floor: string[];
  windowDoor: string[];
  plywoodThickness: string;
  notes: string;
}

export interface StructuralItem {
  id: string;
  name: string;
  category: string;
  hours?: string;
  rate?: string;
  quantity?: string;
  price?: string;
  unit?: string;
  isCustom?: boolean;
}

export interface StructuralData {
  choices: StructuralChoices;
  laborItems: { [category: string]: StructuralItem[] };
  materialItems: { [category: string]: StructuralItem[] };
  taxRate: number;
  contingencyRate: number;
}

export interface CostData {
  category: string;
  labor?: StructuralItem[];
  materials?: StructuralItem[];
}

export interface PlywoodThicknessOption {
  value: string;
  label: string;
}

export interface PlywoodThicknessData {
  [key: string]: {
    name: string;
    price: number;
  };
}
