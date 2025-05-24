import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { attributes } from '../types/Player';
import { formatNumber } from '../utils/gameUtils';
import { Guess } from '../types/Guess';
import { useGame } from '../contexts/GameContext';
import '../styles/animations.css';

interface Comparison {
  attribute: string;
  value: number | string;
  targetValue: number | string;
  match: 'exact' | 'close' | 'incorrect';
  direction?: 'higher' | 'lower';
}

const getMatchClass = (attr: string, comparisons: Comparison[]) => {
  // Special case for position
  const comparison = comparisons.find(c => c.attribute === attr);
  if (attr === 'position') {
    return comparison.match === 'exact' 
      ? 'bg-green-500' 
      : 'bg-gray-200';
  }

  // For numeric comparisons
  if (comparison.match === 'exact') {
    return 'bg-green-500';
  }
  
  if (comparison.direction === 'higher') {
    return 'bg-[#f97316]'; // Orange for higher than guess
  }

  if (comparison.direction === 'lower'){
    return 'bg-[#60a5fa]'; // Blue for lower than guess
  }
  
  return 'bg-gray-200';
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
        <div className="grid grid-cols-6 gap-1 bg-white">
          {/* Picture Square */}
          <div className={`aspect-square ${isAnimating ? 'flip-card delay-0' : ''}`}>
            {guess.player.imageUrl && (
              <img 
                src={guess.player.imageUrl} 
                alt={guess.player.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Other attributes */}
          {attributes.map((attr, attrIndex) => (
            <div 
              key={attr.key} 
              className={`aspect-square flex items-center justify-center ${
                isAnimating ? `flip-card delay-${attrIndex + 1}` : ''
              } ${getMatchClass(attr.key, guess.comparison)}`}
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
      <div className="grid grid-cols-6 gap-1 text-center text-sm">
        {header.map(attr => (
          <div key={attr.key} className="p-2">
            {attr.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="game-board w-full max-w-[600px] mx-auto space-y-1">
      <AttributeHeaders />
      {guesses.map((guess, index) => {
        const originalIndex = guesses.length - 1 - index;
        return renderGuess(guess, originalIndex);
      })}
    </div>
  );
};

export default GameBoard;