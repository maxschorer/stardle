import { useState, useEffect } from 'react';
import SearchRow from './SearchRow';

import { formatNumber } from '../utils/gameUtils';
import { Guess } from '../types/Guess';
import { attributes } from '../types/Player';

import '../styles/animations.css';

interface GuessRowProps {
  guess: Guess | null;
  isCurrentGuess: boolean;
}

interface Comparison {
  attribute: string;
  value: number | string;
  targetValue: number | string;
  match: 'exact' | 'close' | 'incorrect';
  direction?: 'higher' | 'lower';
}

const EMPTY_CLASS = "aspect-square bg-gray-200"

const getMatchClass = (attr: string, comparisons: Comparison[]) => {
    const comparison = comparisons.find(c => c.attribute === attr);
    
    if (!comparison) {
      return 'bg-[#3a3a3c]';
    }

    if (attr === 'position') {
      return comparison.match === 'exact' 
        ? 'bg-green-500' 
        : 'bg-[#3a3a3c]';
    }

    if (comparison.match === 'exact') {
      return 'bg-green-500';
    }
    
    if (comparison.direction === 'higher') {
      return 'bg-[#f97316]';
    }
    
    return 'bg-[#60a5fa]';
};

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

const EmptyRow = () => {
return (
    <div className="grid grid-cols-6 gap-1">
    {[...Array(6)].map((_, i) => (
        <div 
        key={i} 
        className={EMPTY_CLASS}
        />
    ))}
    </div>
);
};

const GuessRow = ({ guess } : { guess: Guess }) => {
  return (
    <div className="grid grid-cols-6 gap-1">
      {/* Player image */}
      <div className="aspect-square">
        {guess?.player.imageUrl && (
          <img 
            src={guess.player.imageUrl} 
            alt={guess.player.name}
            className="w-full h-full object-cover object-[center_top]"
          />
        )}
      </div>

      {attributes.map((attr, ind) => (
        <div 
          key={attr.key} 
          className={"flip-container"}
        >
          <div className={`flip-card delay-${ind+1}`}>
            <div className={`${EMPTY_CLASS} flip-back`} />
            <div 
              className={`aspect-square flex items-center justify-center text-white font-bold 
                flip-front
                ${getMatchClass(attr.key, guess?.comparison || [])}
              `}
            >
              {renderValue(attr, guess!)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const BoardRow = ({ guess, isCurrentGuess }: GuessRowProps) => {
  if (guess){
    return <GuessRow guess={guess} />
  }

  // Render empty row
  if (!isCurrentGuess) {
    return <EmptyRow />
  }0-8

  return <SearchRow />
};

export default BoardRow;