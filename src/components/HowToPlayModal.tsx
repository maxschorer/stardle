import React from 'react';
import { useGame } from '../contexts/GameContext';

const HowToPlayModal: React.FC = () => {
  const { showHowToPlay, setShowHowToPlay } = useGame();

  if (!showHowToPlay) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">How to Play</h2>
            <button 
              onClick={() => setShowHowToPlay(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <p>Guess the NBA player in 8 tries!</p>
            <p>Each guess must be a valid NBA player. Hit enter to submit.</p>
            <p>After each guess, you'll see how close your guess is to the target player.</p>
            
            <div className="border-t border-gray-700 pt-4">
              <h3 className="font-bold mb-2">Examples</h3>
              
              {/* Example of exact match */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-24 font-medium">Position:</div>
                  <div className="bg-green-600 px-2 py-1 rounded">PG</div>
                </div>
                <p className="text-sm text-gray-400">The player is a Point Guard.</p>
              </div>
              
              {/* Example of close match */}
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-24 font-medium">Rookie Year:</div>
                  <div className="bg-yellow-600 px-2 py-1 rounded flex items-center">
                    2018
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-400">The player's rookie year is after 2018.</p>
              </div>
              
              {/* Example of wrong match */}
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-24 font-medium">All-Stars:</div>
                  <div className="bg-gray-700 px-2 py-1 rounded">5</div>
                </div>
                <p className="text-sm text-gray-400">The player has a different number of All-Star appearances.</p>
              </div>
            </div>
            
            <p className="border-t border-gray-700 pt-4">A new player will be available each day!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;