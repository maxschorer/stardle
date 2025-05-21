import React from 'react';
import { Guess, AttributeComparison } from '../types/Guess';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatNumber } from '../utils/gameUtils';

interface GuessRowProps {
  guess: Guess;
}

const GuessRow: React.FC<GuessRowProps> = ({ guess }) => {
  // Helper function to get background color based on match type
  const getBackgroundColor = (match: string) => {
    switch (match) {
      case 'exact': return 'bg-green-600';
      case 'close': return 'bg-yellow-500';
      default: return 'bg-gray-700';
    }
  };
  
  // Helper function to display attribute value
  const displayValue = (comparison: AttributeComparison) => {
    if (comparison.attribute === 'careerPoints') {
      return formatNumber(comparison.value);
    }
    return comparison.value;
  };

  return (
    <div className="grid grid-cols-7 gap-2 h-14 text-center animate-fadeIn">
      {/* Player name */}
      <div className="bg-gray-800 rounded flex items-center justify-center overflow-hidden px-2">
        <span className="truncate font-medium">{guess.player.name}</span>
      </div>
      
      {/* Attributes */}
      {guess.comparison.map((comparison, index) => (
        <div 
          key={`attr-${index}`}
          className={`${getBackgroundColor(comparison.match)} rounded flex flex-col items-center justify-center`}
        >
          <div className="flex items-center space-x-1">
            <span className="font-medium">{displayValue(comparison)}</span>
            
            {/* Show direction arrow for numeric attributes that aren't exact matches */}
            {comparison.match !== 'exact' && comparison.direction && (
              comparison.direction === 'higher' 
                ? <ArrowDown size={14} className="text-white" /> 
                : <ArrowUp size={14} className="text-white" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuessRow;