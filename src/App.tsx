import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import PlayerSearch from './components/PlayerSearch';
import HowToPlayModal from './components/HowToPlayModal';
import GameOverModal from './components/GameOverModal';
import { GameProvider, useGame } from './contexts/GameContext';

// This component uses the game context
function GameContent() {
  const {
    targetPlayer,
    guesses,
    currentGuess,
    gameOver,
    gameWon,
    showHowToPlay,
    showGameOver,
    setShowHowToPlay,
    setShowGameOver,
    handleGuess,
    shareResults,
    MAX_ATTEMPTS
  } = useGame();

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

// The main App component just provides the context
function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;