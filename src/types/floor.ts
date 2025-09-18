export interface FloorDimensions {
  width: string;
  length: string;
}

export interface ExtraMeasurement {
  id: number;
  label: string;
  width: string;
  length: string;
}

export interface TileSize {
  width: string;
  length: string;
}

export interface FloorChoices {
  dimensions: FloorDimensions;
  extraMeasurements: ExtraMeasurement[];
  tilePattern: string;
  customPattern: string;
  selectedTileSizeOption: string;
  tileSize: TileSize;
  notes: string;
  constructionNotes: string;
}

export interface FloorData {
  floorChoices: FloorChoices;
  clientSuppliesTiles: boolean;
  selectedPrepTasks: string[];
  plywoodThickness: string;
  isHeatedFloor: boolean;
  heatedFloorType: string;
  customHeatedFloorName: string;
}
