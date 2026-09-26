const BASE_URL = 'http://localhost:5000/api/v1';

// Função auxiliar genérica para realizar requisições
async function request<T>(endpoint: string, config?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
    ...config,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao realizar requisição com a API');
  }

  return data as T;
}


// Métodos de Autenticação
export const authService = {
  register: (username: string, password: string, email: string) =>
    request<import('../types/types').Trainer>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    }),

  login: (username: string, password: string) =>
    request<import('../types/types').Trainer>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      credentials: "include"
    }),
};


// Métodos de Mecânica do Jogo
export const gameService = {
  getLeaderboard: () =>
    request<{ leaderboard: import('../types/types').LeaderboardEntry[] }>('/game/leaderboard', {
      method: 'GET',
      credentials: 'include'
    }),

  getWildEncounter: () =>
    request<import('../types/types').WildEncounter>('/game/encounter', {
      method: 'GET',
      credentials: 'include'
    }),

  updateProgress: (trainer_id: number, currency: number, last_route?: number) =>
    request<import('../types/types').Trainer>('/game/progress', {
      method: 'PUT',
      body: JSON.stringify({ id: trainer_id, currency, last_route }),
      credentials: 'include'
    }),
};


// Métodos de Gerenciamento de Pokémons
export const pokemonService = {
  catchPokemon: (trainer_id: number, pokemon_id: number, name: string, nickname?: string) =>
    request<import('../types/types').Pokemon>('/pokemon/catch', {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify({ user_id: trainer_id, pokemon_id: pokemon_id, name, nickname }),
    }),

  getTrainerPokemons: (trainer_id: number) =>
    request<{ pokemons: import('../types/types').Pokemon[] }>(`/pokemon/trainer/`, {
      method: 'GET',
      credentials: 'include'
    }),

  updatePokemon: (pokemon_instance_id: number, level: number, experience: number) =>
    request<import('../types/types').Pokemon>('/pokemon/update', {
      method: 'PUT',
      body: JSON.stringify({ pokemon_instance_id, level, experience }),
      credentials: "include"
    }),

  
  releasePokemon: (pokemon_id: number) =>
    request<{ message: string }>(`/pokemon/${pokemon_id}`, {
      method: 'DELETE',
      credentials: "include"
    }),
};