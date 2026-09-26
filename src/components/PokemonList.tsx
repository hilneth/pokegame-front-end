import React, { useState } from 'react';
import type { Pokemon } from '../types/types';

interface PokemonListProps {
  pokemons: Pokemon[];
  activePokemonId: number | null;
  onSelectActive: (pokemon: Pokemon) => void;
  onReleasePokemon: (pokemonId: number) => void;
}

export const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  activePokemonId,
  onSelectActive,
  onReleasePokemon,
}) => {

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Meus Pokémons ({pokemons.length})</h3>
      <div style={styles.list}>
        {pokemons.map((poke) => {
          const isActive = poke.id === activePokemonId;
          return (
            <div
              key={poke.id}
              style={{
                ...styles.card,
                borderColor: isActive ? '#319795' : '#4a5568',
              }}
            >
              <div>
                <strong>{poke.nickname || poke.name}</strong>
                <img src={poke.sprite} alt="sprite" />
                <div style={styles.details}>
                  Nv. {poke.level} | XP: {poke.experience}/100
                </div>
              </div>

              <div style={styles.actions}>
                {!isActive && (
                  <button
                    onClick={() => onSelectActive(poke)}
                    style={styles.selectBtn}
                  >
                    Usar
                  </button>
                )}
                {pokemons.length > 1 && <button
                  onClick={() => onReleasePokemon(poke.id)}
                  style={styles.releaseBtn}
                >
                  Soltar
                </button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#2d3748',
    padding: '1rem',
    borderRadius: '8px',
    flex: 1,
  },
  title: {
    margin: '0 0 1rem 0',
    color: '#fff',
    fontSize: '1rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '2px solid',
    color: '#fff',
  },
  details: {
    fontSize: '0.75rem',
    color: '#a0aec0',
  },
  actions: {
    display: 'flex',
    gap: '0.4rem',
  },
  selectBtn: {
    backgroundColor: '#319795',
    color: '#fff',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
  releaseBtn: {
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
};