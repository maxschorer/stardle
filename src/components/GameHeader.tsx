import React from 'react';
import { HelpCircle } from 'lucide-react';

interface GameHeaderProps {
  onHowToPlay: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ onHowToPlay }) => {
  return (
    <header className="bg-gradient-to-r from-[#17408B] to-[#1E5631] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-[#E25822] rounded-full mr-3">
            <span className="font-bold text-white text-xl">🏀</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">STARDLE</h1>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={onHowToPlay}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="How to play"
          >
            <HelpCircle size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;