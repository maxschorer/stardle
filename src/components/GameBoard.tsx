import React, { useEffect, useState } from 'react';
import { attributes } from '../types/Player';
import { formatNumber } from '../utils/gameUtils';
import { Guess } from '../types/Guess';
import { useGame } from '../contexts/GameContext';
import PlayerSearch from '../components/PlayerSearch';
import '../styles/animations.css';

interface Comparison {
  attribute: string;
  value: number | string;
  targetValue: number | string;
  match: 'exact' | 'close' | 'incorrect';
  direction?: 'higher' | 'lower';
}

const DEFAULT_GRAY = 'bg-gray-500';

const getMatchClass = (attr: string, comparisons: Comparison[]) => {
  // Find the matching comparison for this attribute
  const comparison = comparisons.find(c => c.attribute === attr);
  
  // Handle case where no comparison is found
  if (!comparison) {
    return DEFAULT_GRAY;
  }

  // Special case for position
  if (attr === 'position') {
    return comparison.match === 'exact' 
      ? 'bg-green-500' 
      : DEFAULT_GRAY
  }

  // For numeric comparisons
  if (comparison.match === 'exact') {
    return 'bg-green-500';
  } else if (comparison.direction === 'higher') {
    return 'bg-[#f97316]'; // Orange for higher than guess
  } else {
    return 'bg-[#60a5fa]'; // Blue for lower than guess
  }
  return DEFAULT_GRAY;
  
};

const EmptyRow = () => {
  return (
    <div className="grid grid-cols-6 gap-1">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="aspect-square bg-gray-200"
        />
      ))}
    </div>
  );
};

const GameBoard: React.FC = () => {
  const { guesses } = useGame();
  const [animatingGuessIndex, setAnimatingGuessIndex] = useState<number | null>(null);

  const renderValue = (attr: typeof attributes[0], guess: Guess) => {
    const comparison = guess.comparison.find(c => c.attribute === attr.key);
    if (!comparison) return '?';

    const value = comparison.value;
    const formattedValue = attr.key === 'careerPoints' ? formatNumber(value) : value;
    return (
      <div className="flex items-center justify-center space-x-2">
        <span>{formattedValue}</span>
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
      <div 
        key={index} 
        className="guess-container mb-px bg-white"
      >
        {/* Single row grid */}
        <div className="grid grid-cols-6 gap-2 bg-white">
          {/* Picture Square */}
          <div className={`aspect-square`}>
            {guess.player.imageUrl && (
              <img 
                src={guess.player.imageUrl} 
                alt={guess.player.name}
                className="w-full h-full object-cover object-[center_top]"
              />
            )}
          </div>

          {/* Other attributes */}
          {attributes.map((attr, attrIndex) => (
            <div 
              key={attr.key} 
              className={`aspect-square flex items-center justify-center text-white font-bold lg:text-xl ${getMatchClass(attr.key, guess.comparison)}`}
            >
              {renderValue(attr, guess)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // You'll also want to add a header component for the titles
  const AttributeHeaders = () => {
    const header = [
      { key: 'star', name: 'Star' },
      ...attributes.map(attr => ({ ...attr }))
    ];
    return (
      <div className="grid grid-cols-6 text-center text-xs lg:text-sm font-bold">
        {header.map(attr => (
          <div key={attr.key} className="p-2 flex items-center justify-center">
            {attr.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-board w-full max-w-[600px] mx-auto space-y-2">
      <AttributeHeaders />
      {guesses.map((guess, index) => {
        const originalIndex = guesses.length - 1 - index;
        return renderGuess(guess, originalIndex);
      })}
      {[...Array(8 - guesses.length)].map((_, index) => (
        <EmptyRow key={`empty-${index}`} />
      ))}
      <PlayerSearch />
    </div>
  );
};

export default GameBoard;