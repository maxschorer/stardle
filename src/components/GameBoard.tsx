import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { attributes } from '../types/Player';
import { formatNumber } from '../utils/gameUtils';
import { Guess } from '../types/Guess';
import { useGame } from '../contexts/GameContext';
import '../styles/animations.css';

const getMatchClass = (attr: String, guess: Guess) => {
  // find the attribute in the array
  const guessAttribute = guess.comparison.find(c => c.attribute === attr);
  if (!guessAttribute){
    return 'bg-gray-700';
  }
  switch (guessAttribute.match) {
    case 'exact':
      return 'bg-green-600'; // Exact match - green
    case 'close':
      return 'bg-yellow-600'; // Close match - yellow
    case 'incorrect':
    default:
      return 'bg-gray-700'; // Incorrect match - gray
  }
};

const GameBoard: React.FC = () => {
  const { guesses, MAX_ATTEMPTS } = useGame();
  const [animatingGuessIndex, setAnimatingGuessIndex] = useState<number | null>(null);

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

  useEffect(() => {
    if (guesses.length > 0) {
      setAnimatingGuessIndex(guesses.length - 1);
      
      const timer = setTimeout(() => {
        setAnimatingGuessIndex(null);
      }, 1200);
      
      return () => clearTimeout(timer);
    }
  }, [guesses.length]);

  const renderGuess = (guess: Guess, index: number) => {
    const isAnimating = index === animatingGuessIndex;
    
    return (
      /* Update key so index not needed */
      <div key={index} className="guess-container mb-4 bg-gray-800 rounded-lg overflow-hidden">
        <div className={`guess-header p-3 bg-gray-800 flex items-center `}>
          {guess.player.imageUrl && (
            <div className="player-image mr-3">
              <img
                src={guess.player.imageUrl}
                alt={guess.player.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-600"
              />
            </div>
          )}
          
          <h3 className="text-2xl font-medium">
            {guess.player.name}
          </h3>
        </div>
        
        <div className="attributes-grid p-3">
          <div className="grid grid-cols-3 gap-3 mb-3 reveal-row">
            {firstRow.map((attr, idx) => {
              return (
                <div 
                  key={attr.key} 
                  className={`attribute-card ${getMatchClass(attr.key, guess)} p-3 rounded-lg`}
                >
                  <div className="attribute-label text-center text-base text-white mb-1">{attr.name}</div>
                  {renderValue(attr, guess)}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 reveal-row">
            {secondRow.map((attr, idx) => (
              <div key={attr.key} className={`attribute-card ${getMatchClass(attr.key, guess)} p-3 rounded-lg`}>
                <div className="attribute-label text-center text-base text-white mb-1">{attr.name}</div>
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
      {[...guesses].reverse().map((guess, index) => {
        const originalIndex = guesses.length - 1 - index;
        
        return renderGuess(guess, originalIndex);
      })}
      <div className="text-center text-xl font-semibold">
        Guesses: {guesses.length} / {MAX_ATTEMPTS}
      </div>
    </div>
  );
};

export default GameBoard;