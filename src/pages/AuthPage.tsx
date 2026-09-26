import React, { useState } from 'react';
import { authService } from '../services/api';
import type { Trainer } from '../types/types';

interface AuthPageProps {
  onLoginSuccess: (trainer: Trainer) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let trainer: Trainer;
      if (isLogin) {
        trainer = await authService.login(username, password);
      } else {
        trainer = await authService.register(username, password, email); 
      }
      onLoginSuccess(trainer);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao processar a requisição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>PokéIdle</h1>
        <h2 style={styles.subtitle}>{isLogin ? 'Entrar na Conta' : 'Criar Novo Treinador'}</h2>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Treinador (Usuário)</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: AshKetchum"
              style={styles.input}
            />
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: ash@pallet.com"
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            style={styles.toggleButton}
          >
            {isLogin
              ? 'Não tem uma conta? Cadastre-se'
              : 'Já possui uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a202c',
    fontFamily: 'sans-serif',
  },
  card: {
    backgroundColor: '#2d3748',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '400px',
    color: '#fff',
  },
  title: {
    textAlign: 'center',
    margin: '0 0 0.5rem 0',
    color: '#e53e3e',
  },
  subtitle: {
    textAlign: 'center',
    margin: '0 0 1.5rem 0',
    fontSize: '1.1rem',
    color: '#cbd5e0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#a0aec0',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #4a5568',
    backgroundColor: '#1a202c',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#319795',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  errorMessage: {
    backgroundColor: '#742a2a',
    color: '#feb2b2',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  toggleContainer: {
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#63b3ed',
    cursor: 'pointer',
    fontSize: '0.9rem',
    textDecoration: 'underline',
  },
};