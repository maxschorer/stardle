import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Players from './pages/Players';

import GameHeader from './components/GameHeader';
import GameBoard from './components/GameBoard';
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
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black flex flex-col">
        <GameHeader />
        
        <Routes>
          <Route path="/" element={
            <>
              <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
                <GameBoard />
              </main>
              <GameOverModal />
            </>
          } />
          <Route path="/players" element={<Players />} />
        </Routes>
        <HowToPlayModal />
      </div>
    </BrowserRouter>
  );
}

export default App;