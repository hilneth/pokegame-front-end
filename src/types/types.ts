export interface Trainer {
  id: number;
  username: string;
  currency: number;
  last_route: number;
}

export interface Pokemon {
  id: number;
  pokemon_id: number;
  name: string;
  nickname: string;
  level: number;
  experience: number;
}

export interface WildEncounter {
  pokemon_id: number;
  name: string;
  base_experience: number;
  sprite_front: string;
  types: string[];
}

export interface LeaderboardEntry {
  username: string;
  coins: number;
  total_pokemons: number;
}