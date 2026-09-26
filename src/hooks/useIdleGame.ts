import { useState, useEffect, useRef } from 'react';
import { gameService, pokemonService } from '../services/api';
import type { Trainer, Pokemon, WildEncounter } from '../types/types';
import { didRun } from '../pages/DashboardPage';

export const didEncounter = {current: false}
export const didCatch = {current: false}

interface UseIdleGameProps {
  trainer: Trainer | null;
  activePokemon: Pokemon | null;
  onUpdateTrainer: (updatedTrainer: Trainer) => void;
  onUpdateActivePokemon: (updatedPokemon: Pokemon) => void;
}

export function useIdleGame({
  trainer,
  activePokemon,
  onUpdateTrainer,
  onUpdateActivePokemon,
}: UseIdleGameProps) {
  // Estados da Batalha
  const [wildPokemon, setWildPokemon] = useState<WildEncounter | null>(null);
  const [wildHp, setWildHp] = useState<number>(100);
  const [maxWildHp, setMaxWildHp] = useState<number>(100);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoadingEncounter, setIsLoadingEncounter] = useState<boolean>(false);

  const trainerRef = useRef(trainer);
  const activePokemonRef = useRef(activePokemon);

  useEffect(() => {
    trainerRef.current = trainer;
  }, [trainer]);

  useEffect(() => {
    activePokemonRef.current = activePokemon;
  }, [activePokemon]);

  const addLog = (message: string) => {
    setLogs((prev) => [message, ...prev.slice(0, 9)]); 
  };

  // Buscar um novo Pokémon selvagem (API Externa)
  const fetchNewEncounter = async () => {
    setIsLoadingEncounter(true);
    try {
      const data = await gameService.getWildEncounter();
      setWildPokemon(data);

      // Calcula HP do selvagem baseado no HP/XP base vindo da PokéAPI
      const calculatedHp = Math.floor(data.base_experience * 0.8) + 20;
      setWildHp(calculatedHp);
      setMaxWildHp(calculatedHp);

      addLog(`Um ${data.name.toUpperCase()} selvagem apareceu!`);
    } catch (error) {
      addLog('Erro ao buscar novo Pokémon selvagem.');
    } finally {
      setIsLoadingEncounter(false);
    }
  };

  // Carrega o primeiro encontro assim que o hook inicia
  useEffect(() => {
    if (didEncounter.current) return;
    didEncounter.current = true
    fetchNewEncounter();
  }, []);

  // 2. Loop principal de batalha automática (Game Loop)
  useEffect(() => {
    // Só roda o loop se houver treinador, pokémon ativo e selvagem em tela
    if (!trainerRef.current || !activePokemonRef.current || !wildPokemon || wildHp <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const currentActive = activePokemonRef.current;
      const currentTrainer = trainerRef.current;

      if (!currentActive || !currentTrainer || !wildPokemon) return;

      // Cálculo de dano simples (baseado no nível do seu Pokémon)
      const damage = Math.floor(currentActive.level * 3 + Math.random() * 5);
      const newHp = Math.max(0, wildHp - damage);
      setWildHp(newHp);

      addLog(`${currentActive.nickname || currentActive.name} causou ${damage} de dano!`);

      // Pokémon Selvagem Derrotado
      if (newHp === 0) {
        handleVictory(currentTrainer, currentActive, wildPokemon);
        didEncounter.current = false
        didRun.current = false
      }
    }, 2500); // Ataque automático a cada 2.5 segundos

    return () => clearInterval(interval);
  }, [wildPokemon, wildHp]);

  // 3. Tratamento de Vitória: Ganho de XP, Moedas, Captura e Sincronização
  const handleVictory = async (
    currentTrainer: Trainer,
    currentActive: Pokemon,
    defeatedWild: WildEncounter
  ) => {
    const coinsGained = Math.floor(defeatedWild.base_experience / 5) + 5;
    const xpGained = Math.floor(defeatedWild.base_experience / 3);

    addLog(`Você derrotou ${defeatedWild.name.toUpperCase()}! +${coinsGained} moedas, +${xpGained} XP.`);

    // Atualiza moedas do treinador no estado e no backend (PUT)
    const newCoins = currentTrainer.currency + coinsGained;
    try {
      const updatedTrainer = await gameService.updateProgress(currentTrainer.id, newCoins);
      onUpdateTrainer(updatedTrainer);
    } catch (err) {
      console.error('Erro ao sincronizar moedas');
    }

    // Atualiza nível/XP do Pokémon ativo (PUT)
    let newXp = currentActive.experience + xpGained;
    let newLevel = currentActive.level;

    // Sobe de nível a cada 100 de XP
    if (newXp >= 100) {
      newLevel += 1;
      newXp = newXp - 100;
      addLog(`✨ Parabéns! ${currentActive.nickname || currentActive.name} subiu para o nível ${newLevel}!`);
    }

    try {
      const updatedPokemon = await pokemonService.updatePokemon(
        currentActive.id,
        newLevel,
        newXp
      );
      onUpdateActivePokemon(updatedPokemon);
    } catch (err) {
      console.error('Erro ao sincronizar progresso do Pokémon');
    }

    // Chance de captura automática (30% de probabilidade)
    const catchChance = Math.random();
    if (catchChance <= 0.30) {
      try {
        await pokemonService.catchPokemon(
          currentTrainer.id,
          defeatedWild.pokemon_id,
          defeatedWild.name
        );
        addLog(`🎯 Você capturou um ${defeatedWild.name.toUpperCase()}!`);
        didCatch.current = true
      } catch (err) {
        console.error('Erro ao salvar captura');
      }
    }

    // Busca o próximo adversário
    setTimeout(() => {
      fetchNewEncounter();
    }, 1500);
  };

  return {
    wildPokemon,
    wildHp,
    maxWildHp,
    logs,
    isLoadingEncounter,
    fetchNewEncounter,
  };
}