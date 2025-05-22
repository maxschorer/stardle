import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
import PlayerSearch from './components/PlayerSearch';
import HowToPlayModal from './components/HowToPlayModal';
import GameOverModal from './components/GameOverModal';
import { GameProvider } from './contexts/GameContext';

// The main App component just provides the context
function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

// Move this to a separate file to avoid potential circular dependencies
function AppContent() {
  // Don't use useGame here - pass it down to child components instead
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <GameHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
        <div className="w-full max-w-md mb-6">
          <PlayerSearch />
        </div>

        <GameBoard />
      </main>
      
      <HowToPlayModal />
      <GameOverModal />
    </div>
  );
}

export default App;