import SearchRow from './SearchRow';

import { Guess, AttributeComparison } from '../types/Guess';
import { attributes } from '../types/Player';
import { 
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

import '../styles/animations.css';

interface GuessRowProps {
  guess: Guess | null;
  isCurrentGuess: boolean;
}

const EMPTY_CLASS = "aspect-square bg-gray-200"


const renderValue = (comparison: AttributeComparison | undefined) => {
  if (!comparison) return '?';

  const value = comparison.value;
  
  switch (comparison.attribute) {
    case 'nationality':
      const image_name = value.toLowerCase().replace(' ', '-')
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-1/2 flex items-center justify-center">
            <img 
              src={`/images/countries/${image_name}.svg`}
              alt={value}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      );
      
    case 'team':
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-1/2 flex items-center justify-center">
            <img 
              src={`/images/teams/${value.toLowerCase()}.svg`}
              alt={value}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      );
      
    default:
      // Original logic for other attributes (position, seasons, rating)
      return (
        <div className="flex items-center justify-between w-full h-full">
          {/* Empty left quarter */}
          <div className="w-1/4" />
          
          {/* Middle half with value */}
          <div className="w-1/2 flex items-center justify-center">
            <span>{value}</span>
          </div>
          
          {/* Right quarter with optional arrow */}
          <div className="w-1/4 flex items-center justify-start]-">
            {comparison.direction && (
              <span>
                {comparison.direction === 'higher' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              </span>
            )}
          </div>
        </div>
      );
  }
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
        <img 
          src={`/images/players/${guess.player.permalink}.png`}
          alt={guess.player.name}
          className="w-full h-full object-cover object-[center_top]"
        />
      </div>

      {attributes.map((attr, ind) => {
        const comparison = guess.comparison.find(c => c.attribute === attr.key);
        
        return (
          <div 
            key={attr.key} 
            className="flip-container"
          >
            <div className={`flip-card delay-${ind+1}`}>
              <div className={`${EMPTY_CLASS} flip-back`} />
              <div 
                className={`
                  aspect-square 
                  flex 
                  items-center 
                  justify-center 
                  text-white 
                  font-bold 
                  text-base 
                  md:text-2xl
                  flip-front
                  ${comparison.match}
                `}
              >
                {renderValue(comparison)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
// bg-[${comparison ? COLOR_MAP[comparison.match] : ''}]
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