import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player } from '../types/Player';
import { Guess } from '../types/Guess';
import { getRandomPlayer, getAllPlayers } from '../data/players';
import { compareAttributes } from '../utils/gameUtils';

// Define the shape of our context
interface GameContextType {
  targetPlayer: Player | null;
  guesses: Guess[];
  currentGuess: Guess | null;
  gameOver: boolean;
  gameWon: boolean;
  showHowToPlay: boolean;
  showGameOver: boolean;
  allPlayers: Player[];
  loading: boolean;
  setShowHowToPlay: (show: boolean) => void;
  setShowGameOver: (show: boolean) => void;
  handleGuess: (player: Player) => void;
  shareResults: () => void;
  MAX_ATTEMPTS: number;
}

// Create the context with undefined as default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component that wraps your app and makes game state available
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Guess | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const MAX_ATTEMPTS = 8;

  useEffect(() => {
    // Load target player and all eligible players on initial render
    const initializeGame = async () => {
      setLoading(true);
      try {
        // Load all players first
        const players = await getAllPlayers();
        setAllPlayers(players);
        
        // Then load today's target player
        const player = await getRandomPlayer();
        setTargetPlayer(player);
        
        // Check if it's a new day to reset the game
        const savedDate = localStorage.getItem('stardleDate');
        const today = new Date().toDateString();
        
        if (savedDate !== today) {
          // New day - reset game
          localStorage.setItem('stardleDate', today);
          localStorage.removeItem('stardleGuesses');
          localStorage.removeItem('stardleGameOver');
          localStorage.removeItem('stardleGameWon');
        } else {
          // Same day - load saved state
          const savedGuesses = localStorage.getItem('stardleGuesses');
          const savedGameOver = localStorage.getItem('stardleGameOver');
          const savedGameWon = localStorage.getItem('stardleGameWon');
          
          if (savedGuesses) {
            const parsedGuesses = JSON.parse(savedGuesses);
            setGuesses(parsedGuesses);
            setCurrentGuess(parsedGuesses[parsedGuesses.length - 1]);
          }
          
          if (savedGameOver === 'true') {
            setGameOver(true);
            setShowGameOver(true);
          }
          
          if (savedGameWon === 'true') {
            setGameWon(true);
          }
        }
        
        // Show how to play modal for first-time users
        const hasPlayed = localStorage.getItem('stardleHasPlayed');
        if (!hasPlayed) {
          setShowHowToPlay(true);
          localStorage.setItem('stardleHasPlayed', 'true');
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        // Handle the error appropriately in your UI
      } finally {
        setLoading(false);
      }
    };
    
    initializeGame();
  }, []);

  useEffect(() => {
    if (guesses.length > 0) {
      localStorage.setItem('stardleGuesses', JSON.stringify(guesses));
    }
    
    if (gameOver) {
      localStorage.setItem('stardleGameOver', 'true');
    }
    
    if (gameWon) {
      localStorage.setItem('stardleGameWon', 'true');
    }
  }, [guesses, gameOver, gameWon]);

  const handleGuess = (player: Player) => {
    if (gameOver || guesses.length >= MAX_ATTEMPTS) {
      return;
    }
    
    // Compare the guessed player with the target player
    const comparison = compareAttributes(player, targetPlayer!);
    
    const newGuess: Guess = {
      player,
      comparison
    };
    
    const updatedGuesses = [...guesses, newGuess];
    setGuesses(updatedGuesses);
    setCurrentGuess(newGuess);
    
    // Check if the guess is correct
    if (player.id === targetPlayer?.id) {
      setGameWon(true);
      setGameOver(true);
      setTimeout(() => {
        setShowGameOver(true);
      }, 3400); // 3 seconds delay
    } else if (updatedGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      setShowGameOver(true);
    }
  };

  const shareResults = () => {
    const emoji = guesses.map(guess => {
      return guess.comparison.map(result => {
        switch (result.match) {
          case 'exact': return '🟩';
          case 'close': return '🟨';
          default: return '⬜';
        }
      }).join('');
    }).join('\n');
    
    const text = `Stardle ${new Date().toLocaleDateString()}\n${gameWon ? guesses.length : 'X'}/${MAX_ATTEMPTS}\n\n${emoji}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Stardle Results',
        text: text
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text)
        .then(() => alert('Results copied to clipboard!'))
        .catch(console.error);
    }
  };

  // Create the value object that will be provided to consumers
  const value = {
    targetPlayer,
    guesses,
    currentGuess,
    gameOver,
    gameWon,
    showHowToPlay,
    showGameOver,
    allPlayers,
    loading,
    setShowHowToPlay,
    setShowGameOver,
    handleGuess,
    shareResults,
    MAX_ATTEMPTS
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook that lets components access the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};