import React from 'react';
import type { WildEncounter, Pokemon } from '../types/types';
import battleImageSrc from '../assets/battleground.jpeg'

interface BattleAreaProps {
  mapImageSrc: string; 
  wildPokemon: WildEncounter | null;
  wildHp: number;
  maxWildHp: number;
  activePokemon: Pokemon | null;
  logs: string[];
  isLoading: boolean;
}

export const BattleArea: React.FC<BattleAreaProps> = ({
  mapImageSrc = battleImageSrc,
  wildPokemon,
  wildHp,
  maxWildHp,
  activePokemon,
  logs,
  isLoading,
}) => {
  const hpPercent = maxWildHp > 0 ? (wildHp / maxWildHp) * 100 : 0;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.arena, backgroundImage: `url(${mapImageSrc})` }}>
        {isLoading ? (
          <div style={styles.loadingText}>Procurando Pokémon selvagem...</div>
        ) : wildPokemon ? (
          <div style={styles.wildContainer}>
            <div style={styles.hpBarContainer}>
              <span style={styles.pokemonName}>{wildPokemon.name.toUpperCase()}</span>
              <div style={styles.hpTrack}>
                <div style={{ ...styles.hpFill, width: `${hpPercent}%` }} />
              </div>
            </div>
            <img
              src={wildPokemon.sprite_front}
              alt={wildPokemon.name}
              style={styles.sprite}
            />
          </div>
        ) : null}

        {activePokemon && (
          <div style={styles.activeContainer}>
            <div style={styles.hpBarContainer}>
              <span style={styles.pokemonName}>
                {activePokemon.nickname || activePokemon.name.toUpperCase()} (Nv. {activePokemon.level})
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={styles.logBox}>
        <h4 style={styles.logTitle}>Histórico de Batalha</h4>
        <div style={styles.logList}>
          {logs.map((log, index) => (
            <p key={index} style={styles.logText}>
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 2,
  },
  arena: {
    height: '350px',
    borderRadius: '12px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    border: '3px solid #4a5568',
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  wildContainer: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  activeContainer: {
    position: 'absolute',
    bottom: '20px',
    left: '30px',
  },
  hpBarContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    color: '#fff',
    minWidth: '160px',
  },
  pokemonName: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  hpTrack: {
    height: '8px',
    backgroundColor: '#4a5568',
    borderRadius: '4px',
    marginTop: '4px',
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    transition: 'width 0.3s ease',
  },
  sprite: {
    width: '110px',
    height: '110px',
    imageRendering: 'pixelated',
  },
  loadingText: {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: '1rem',
    borderRadius: '8px',
    margin: 'auto',
    marginTop: '120px',
    width: 'fit-content',
  },
  logBox: {
    backgroundColor: '#2d3748',
    borderRadius: '8px',
    padding: '1rem',
    maxHeight: '150px',
    overflowY: 'auto',
    border: '1px solid #4a5568',
  },
  logTitle: {
    margin: '0 0 0.5rem 0',
    color: '#cbd5e0',
    fontSize: '0.9rem',
  },
  logList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  logText: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#a0aec0',
  },
};