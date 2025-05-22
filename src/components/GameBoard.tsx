import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { attributes } from '../types/Player';
import { formatNumber } from '../utils/gameUtils';
import { Guess } from '../types/Guess';
import { useGame } from '../contexts/GameContext';

const GameBoard: React.FC = () => {
  const { guesses, MAX_ATTEMPTS } = useGame();

  // Split attributes into two rows for the guess display
  const firstRow = attributes.slice(0, 3);
  const secondRow = attributes.slice(3);

  const renderValue = (attr: typeof attributes[0], guess: Guess) => {
    const comparison = guess.comparison.find(c => c.attribute === attr.key);
    if (!comparison) return '?';

    const value = comparison.value;
    const formattedValue = attr.key === 'careerPoints' ? formatNumber(value) : value;
    return (
      <div className="flex items-center justify-center space-x-2">
        <span>{formattedValue}</span>
        {comparison.match !== 'exact' && attr.key !== 'position' && (
          comparison.direction === 'higher' 
            ? <ArrowDown className="text-white" size={16} />
            : <ArrowUp className="text-white" size={16} />
        )}
      </div>
    );
  };


  const renderGuess = (guess: Guess, index: number) => {
    return (
      /* Update key so index not needed */
      <div key={index} className="guess-container mb-4 bg-gray-800 rounded-lg overflow-hidden">
        {/* Add a header with player image and name */}
        <div className="guess-header p-3 bg-gray-700 flex items-center">
          {/* Player image */}
          {guess.player.imageUrl && (
            <div className="player-image mr-3">
              <img
                src={guess.player.imageUrl}
                alt={guess.player.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
              />
            </div>
          )}

          {/* Player name */}
          <h3 className="text-lg font-medium">
            Guess #{index + 1}: {guess.player.name}
          </h3>
        </div>

        {/* Attributes grid - your existing code */}
        <div className="attributes-grid p-3">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {firstRow.map(attr => (
              <div key={attr.key} className="attribute-card bg-gray-700 p-3 rounded-lg">
                <div className="attribute-label text-sm text-gray-400 mb-1">{attr.name}</div>
                {renderValue(attr, guess)}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {secondRow.map(attr => (
              <div key={attr.key} className="attribute-card bg-gray-700 p-3 rounded-lg">
                <div className="attribute-label text-sm text-gray-400 mb-1">{attr.name}</div>
                {renderValue(attr, guess)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="game-board w-full max-w-3xl mx-auto">
      {guesses.map((guess, index) => renderGuess(guess, index))}
      {/* Guess Counter */}
      <div className="text-center text-xl font-semibold">
        Guesses: {guesses.length} / {MAX_ATTEMPTS}
      </div>
    </div>
  );
};

export default GameBoard;