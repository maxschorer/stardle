import { useGame } from '../contexts/GameContext';
import { attributes } from '../types/Player';
import BoardRow from './BoardRow';

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

const GameBoard = () => {
  const { guesses, MAX_ATTEMPTS, gameOver } = useGame();

  return (
    <div className="game-board w-full max-w-[600px] mx-auto space-y-1">
      <AttributeHeaders />
      {guesses.map((guess, index) => (
        <BoardRow 
          key={index}
          guess={guess}
          isCurrentGuess={false}
        />
      ))}
      {[...Array(MAX_ATTEMPTS - guesses.length)].map((_, index) => (
        <BoardRow 
          key={`empty-${index}`}
          guess={null}
          isCurrentGuess={index === 0 && !gameOver} // true for first empty row, false for the rest
        />
      ))}
    </div>
  );
};

export default GameBoard;