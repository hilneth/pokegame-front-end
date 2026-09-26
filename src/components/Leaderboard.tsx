import React, { useEffect, useState } from 'react';
import { gameService } from '../services/api';
import type { LeaderboardEntry } from '../types/types';

export const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await gameService.getLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch (err: any) {
      setError('Erro ao carregar o ranking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>🏆 Top Treinadores</h3>
        <button onClick={fetchLeaderboard} style={styles.refreshBtn}>
          🔄 Atualizar
        </button>
      </div>

      {loading ? (
        <div style={styles.infoText}>Carregando ranking...</div>
      ) : error ? (
        <div style={styles.errorText}>{error}</div>
      ) : (
        <div style={styles.list}>
          {leaderboard.map((entry, index) => (
            <div key={index} style={styles.row}>
              <div style={styles.rankCol}>
                <span style={getRankBadgeStyle(index)}>{index + 1}º</span>
                <span style={styles.username}>{entry.username}</span>
              </div>
              <div style={styles.statsCol}>
                <span>🪙 {entry.coins}</span>
                <span style={styles.pokemonCount}>🐾 {entry.total_pokemons}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Destaque visual para o top 3 do ranking
const getRankBadgeStyle = (index: number): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '0.85rem',
    minWidth: '24px',
    textAlign: 'center',
  };

  if (index === 0) return { ...baseStyle, color: '#ffd700' }; // Ouro
  if (index === 1) return { ...baseStyle, color: '#c0c0c0' }; // Prata
  if (index === 2) return { ...baseStyle, color: '#cd7f32' }; // Bronze
  return { ...baseStyle, color: '#a0aec0' };
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#2d3748',
    padding: '1rem',
    borderRadius: '8px',
    flex: 1,
    minWidth: '280px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: {
    margin: 0,
    color: '#fff',
    fontSize: '1rem',
  },
  refreshBtn: {
    backgroundColor: '#4a5568',
    color: '#fff',
    border: 'none',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
  },
  infoText: {
    color: '#a0aec0',
    fontSize: '0.85rem',
    textAlign: 'center',
    padding: '1rem 0',
  },
  errorText: {
    color: '#feb2b2',
    fontSize: '0.85rem',
    textAlign: 'center',
    padding: '1rem 0',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '350px',
    overflowY: 'auto',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a202c',
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
  },
  rankCol: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  username: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  statsCol: {
    display: 'flex',
    gap: '0.8rem',
    fontSize: '0.8rem',
    color: '#cbd5e0',
  },
  pokemonCount: {
    color: '#a0aec0',
  },
};