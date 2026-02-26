export interface SpeciesShort {
  id: number;
  name: string;
  url: string;
}

export interface SpeciesLong extends SpeciesShort {
  gender_rate: number;
  capture_rate: number;
  // TODO: complete
}