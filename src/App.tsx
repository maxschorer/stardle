import React, { useState, useEffect } from 'react';
import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import PlayerSearch from './components/PlayerSearch';
import HowToPlayModal from './components/HowToPlayModal';
import GameOverModal from './components/GameOverModal';
import { Player } from './types/Player';
import { Guess } from './types/Guess';
import { getRandomPlayer } from './data/players';
import { compareAttributes } from './utils/gameUtils';

function App() {
  const [targetPlayer, setTargetPlayer] = useState<Player | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Guess | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  
  const MAX_ATTEMPTS = 8;

  useEffect(() => {
    // Load target player on initial render
    const player = getRandomPlayer();
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
    
    // Check if player has already been guessed
    if (guesses.some(guess => guess.player.id === player.id)) {
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
      setShowGameOver(true);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <GameHeader 
        onHowToPlay={() => setShowHowToPlay(true)} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
        <div className="w-full max-w-md mb-6">
          <PlayerSearch 
            onSelectPlayer={handleGuess} 
            disabled={gameOver}
            excludedPlayerIds={guesses.map(g => g.player.id)}
          />
        </div>

        <GameBoard 
          guesses={guesses} 
          currentGuess={currentGuess} 
          maxAttempts={MAX_ATTEMPTS} 
        />
      </main>
      
      <HowToPlayModal 
        isOpen={showHowToPlay} 
        onClose={() => setShowHowToPlay(false)} 
      />
      
      <GameOverModal 
        isOpen={showGameOver}
        onClose={() => setShowGameOver(false)}
        gameWon={gameWon}
        targetPlayer={targetPlayer}
        attempts={guesses.length}
        maxAttempts={MAX_ATTEMPTS}
        onShare={shareResults}
      />
    </div>
  );
}

export default App;