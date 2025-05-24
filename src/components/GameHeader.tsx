import React from 'react';
import { useGame } from '../contexts/GameContext';

interface GameHeaderProps {
  // You can keep any additional props here if needed
}

const GameHeader: React.FC<GameHeaderProps> = () => {
  // Get what you need from the context directly
  const { setShowHowToPlay } = useGame();
  
  return (
    <header className="bg-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">STARDLE</h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowHowToPlay(true)}
            className="text-white hover:text-gray-300"
            aria-label="How to play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {/* Add other header buttons here if needed */}
        </div>
      </div>
    </header>
  );
};

export default GameHeader;