/* ================ API structures ================ */
export interface Resource {
  name: string;
  url: string;
}

export interface StatData {
  base_stat: number;
  effort: number;
  stat: Resource[];
}

export interface AbilityData {
  is_hidden: boolean;
  slot: number;
  ability: Resource[];
}


/* ================ UI-specific ================ */
export interface SpeciesShort {
  id: number;
  name: string;
  url: string;
  types: string[];
  details: SpeciesDetails;
}

export interface SpeciesDetails extends SpeciesShort {
  height: number;
  weight: number;
  stats: StatData[];
  abilities: AbilityData[];
}
