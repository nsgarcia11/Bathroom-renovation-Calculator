export interface FinishingsDimensions {
  width: string;
  length: string;
  height: string;
}

export interface DesignChoices {
  dimensions: FinishingsDimensions;
}

export interface FinishingsScope {
  fixWalls: { selected: boolean };
  priming: { selected: boolean };
  paintWalls: { selected: boolean };
  paintCeiling: { selected: boolean };
  paintTrim: { selected: boolean };
  paintDoor: { selected: boolean };
  installBaseboard: { selected: boolean };
  installVanity: { selected: boolean; sinks: number };
  installLights: { selected: boolean; quantity: number };
  installAccessories: { selected: boolean };
  installMirror: { selected: boolean };
  installDoor: { selected: boolean };
  installToilet: { selected: boolean };
  installFan: { selected: boolean };
  installSinkFaucet: { selected: boolean; quantity: number };
  installShowerFaucet: { selected: boolean };
  installShowerDoor: { selected: boolean };
  installTubDrain: { selected: boolean };
  installShowerDrain: { selected: boolean };
  plumbingPerformedBy: 'me' | 'trade';
  electricalPerformedBy: 'me' | 'trade';
}

export interface AccentWall {
  id: string;
  dimensions: {
    width: string;
    height: string;
  };
  finishType: 'tile' | 'wainscot' | 'paint';
}

export interface FinishingsData {
  designChoices: DesignChoices;
  finishingsScope: FinishingsScope;
  accentWalls: AccentWall[];
}
