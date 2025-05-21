import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { attributes } from '../types/Player';
import { formatNumber } from '../utils/gameUtils';
import { Guess } from '../types/Guess';

interface GameBoardProps {
  guesses: Guess[];
  currentGuess: Guess | null;
  maxAttempts?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, maxAttempts = 8 }) => {
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
            ? <ArrowDown className="text-red-500" size={16} />
            : <ArrowUp className="text-green-500" size={16} />
        )}
      </div>
    );
  };

  const getBackgroundColor = (attr: typeof attributes[0], guess: Guess) => {
    const comparison = guess.comparison.find(c => c.attribute === attr.key);
    if (!comparison) return 'bg-gray-700';

    switch (comparison.match) {
      case 'exact': return 'bg-green-600';
      case 'close': return 'bg-yellow-500';
      default: return 'bg-gray-700';
    }
  };

  const renderGuessCard = (guess: Guess, index: number) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="text-lg font-semibold text-center mb-4">
        Guess #{guesses.length - index}: {guess.player.name}
      </div>
      
      {/* First Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {firstRow.map(attr => (
          <div 
            key={attr.key} 
            className={`${getBackgroundColor(attr, guess)} rounded-lg p-4 transition-colors duration-300`}
          >
            <div className="text-gray-200 text-sm mb-2 text-center">{attr.name}</div>
            <div className="text-xl font-bold text-center">
              {renderValue(attr, guess)}
            </div>
          </div>
        ))}
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4">
        {secondRow.map(attr => (
          <div 
            key={attr.key} 
            className={`${getBackgroundColor(attr, guess)} rounded-lg p-4 transition-colors duration-300`}
          >
            <div className="text-gray-200 text-sm mb-2 text-center">{attr.name}</div>
            <div className="text-xl font-bold text-center">
              {renderValue(attr, guess)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Guess Counter */}
      <div className="text-center text-xl font-semibold">
        Guesses: {guesses.length} / {maxAttempts}
      </div>

      {/* Guesses Stack */}
      <div className="space-y-8">
        {guesses.slice().reverse().map((guess, index) => (
          <div key={index} className="animate-fadeIn">
            {renderGuessCard(guess, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;