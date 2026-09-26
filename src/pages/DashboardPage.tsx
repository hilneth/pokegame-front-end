import React, { useState, useEffect, useRef } from 'react';
import type { Trainer, Pokemon } from '../types/types';
import { pokemonService } from '../services/api';
import { didCatch, didEncounter, useIdleGame } from '../hooks/useIdleGame';
import { BattleArea } from '../components/BattleArea';
import { PokemonList } from '../components/PokemonList';

import mapPng from '../assets/battleground.jpeg';

interface DashboardPageProps {
  trainer: Trainer;
  onLogout: () => void;
}
export const didRun = {current: false}

export const fetchUserPokemon = async (trainer_id: number) => {
  const data = await pokemonService.getTrainerPokemons(trainer_id);
  return data
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ trainer, onLogout }) => {
  const [currentTrainer, setCurrentTrainer] = useState<Trainer>(trainer);
  const [trainerPokemons, setTrainerPokemons] = useState<Pokemon[]>([]);
  const [activePokemon, setActivePokemon] = useState<Pokemon | null>(null);

  const loadPokemons = async () => {
    try {
      const data = await fetchUserPokemon(currentTrainer.id);
      setTrainerPokemons(data.pokemons);
      if (data.pokemons.length > 0 && !activePokemon) {
        setActivePokemon(data.pokemons[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar Pokémons do treinador');
    }
  };

  useEffect(() => {
    if (didCatch.current == true) {
      loadPokemons();
      didCatch.current = false;
      return;
    }

    if (didRun.current) return;
    didRun.current = true;
    loadPokemons();
  }, []);


  const {
    wildPokemon,
    wildHp,
    maxWildHp,
    logs,
    isLoadingEncounter,
  } = useIdleGame({
    trainer: currentTrainer,
    activePokemon,
    onUpdateTrainer: setCurrentTrainer,
    onUpdateActivePokemon: (updated) => {
      setActivePokemon(updated);
      loadPokemons();
    },
  });

  const handleReleasePokemon = async (pokemonId: number) => {
    try {
      await pokemonService.releasePokemon(pokemonId);
      if (activePokemon?.id === pokemonId) {
        setActivePokemon(null);
      }
      loadPokemons();
    } catch (err) {
      alert('Erro ao soltar Pokémon');
    }
  };

  const setDidFalse = () => {
    didRun.current = false
    didEncounter.current = false
    onLogout()
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.trainerName}>Treinador: {currentTrainer.username}</h2>
          <span style={styles.hudItem}>📍 Rota: {currentTrainer.last_route}</span>
          <span style={styles.hudItem}>🪙 Moedas: {currentTrainer.currency}</span>
        </div>
        <button onClick={setDidFalse} style={styles.logoutBtn}>
          Sair
        </button>
      </header>

      <main style={styles.main}>
        <BattleArea
          mapImageSrc={mapPng}
          wildPokemon={wildPokemon}
          wildHp={wildHp}
          maxWildHp={maxWildHp}
          activePokemon={activePokemon}
          logs={logs}
          isLoading={isLoadingEncounter}
        />

        <PokemonList
          pokemons={trainerPokemons}
          activePokemonId={activePokemon?.id || null}
          onSelectActive={(poke) => setActivePokemon(poke)}
          onReleasePokemon={handleReleasePokemon}
        />
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: '#1a202c',
    minHeight: '100vh',
    padding: '1.5rem',
    color: '#fff',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  },
  trainerName: {
    margin: '0 0 0.25rem 0',
    fontSize: '1.2rem',
    color: '#e53e3e',
  },
  hudItem: {
    marginRight: '1.5rem',
    fontSize: '0.9rem',
    color: '#cbd5e0',
  },
  logoutBtn: {
    backgroundColor: '#4a5568',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  main: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
};
