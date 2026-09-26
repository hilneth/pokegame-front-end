import React, { useState } from 'react';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import type { Trainer } from './types/types';

export const App: React.FC = () => {
  const [trainer, setTrainer] = useState<Trainer | null>(null);

  const handleLogout = () => {
    setTrainer(null);
  };

  return (
    <div style={styles.appContainer}>
      {!trainer ? (
        <AuthPage onLoginSuccess={(loggedTrainer) => setTrainer(loggedTrainer)} />
      ) : (
        <DashboardPage trainer={trainer} onLogout={handleLogout} />
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    backgroundColor: '#1a202c',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
};

export default App;