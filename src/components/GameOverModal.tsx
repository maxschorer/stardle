import React from 'react';
import { useGame } from '../contexts/GameContext';

const GameOverModal: React.FC = () => {
  const { 
    showGameOver, 
    setShowGameOver, 
    gameWon, 
    targetPlayer, 
    guesses, 
    shareResults 
  } = useGame();

  if (!showGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {gameWon ? 'Congratulations!' : 'Game Over'}
            </h2>
            <button 
              onClick={() => setShowGameOver(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {gameWon ? (
              <p>You guessed the player in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!</p>
            ) : (
              <p>Better luck next time! The player was:</p>
            )}
            
            {targetPlayer && (
              <div className="flex items-center space-x-4 bg-gray-700 p-3 rounded-lg">
                {targetPlayer.imageUrl && (
                  <img 
                    src={targetPlayer.imageUrl} 
                    alt={targetPlayer.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-bold text-lg">{targetPlayer.name}</div>
                  <div className="text-gray-300">{targetPlayer.position}</div>
                </div>
              </div>
            )}
            
            <button
              onClick={shareResults}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Results
            </button>
            
            <p className="text-center text-gray-400 text-sm">
              Come back tomorrow for a new player!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;