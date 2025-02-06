export type Waterlevels = {
  MThw: number;
  MTnw: number;
};

export type Riverbed = {
  planRiverbed: number;
  currentRiverbed: number;
};

export type MeasurementRow = {
  height: string;
  section: string;
  remainingWallThickness: number[];
  wallThickness: number;
  distanceLockedge: number;
  troughDepth: number[];
  quality: string;
  remarks: string;
};

export type Profil = {
  name: string;
  picture: string;
};

export type Fieldbook = {
  structure: string;
  station: string;
  block: string;
  date: string;
  diver: string;
  protocolLeader: string;
  constructionYear: number;
  age: number;
  waterlevels: Waterlevels;
  riverbed: Riverbed;
  measurements: MeasurementRow[];
  profil: Profil;
};
