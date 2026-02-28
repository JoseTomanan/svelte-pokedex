/* ================ API structures ================ */
export interface Resource {
  name: string;
  url: string;
}

export interface StatData {
  base_stat: number;
  effort: number;
  stat: Resource;
}

export interface AbilityData {
  is_hidden: boolean;
  slot: number;
  ability: Resource;
}

export interface NameIdPair {
  name: string;
  id: number;
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
  order: number;
  species: Resource;
  stats: StatData[];
  abilities: AbilityData[];
}
