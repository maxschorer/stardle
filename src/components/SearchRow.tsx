import { useState, useEffect, useRef } from 'react';
import { searchPlayers } from '../data/players';
import { Player } from '../types/Player';
import { useGame } from '../contexts/GameContext';

const SearchRow = () => {
  const { loading, handleGuess, guesses } = useGame();
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Player[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [_, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const searchResults = await searchPlayers(query);
          const filteredResults = searchResults.filter(
            player => !guesses.some(guess => guess.player.id === player.id)
          );
          setResults(filteredResults);
          setIsOpen(filteredResults.length > 0);
        } catch (error) {
          console.error('Error searching players:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 100);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectPlayer = (player: Player) => {
    handleGuess(player);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  if (loading) {
    return <div>Loading players...</div>;
  }

  return (
    <div className="grid grid-cols-6 gap-1">
      {/* Profile icon cell */}
      <div className="aspect-square bg-white flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      </div>

      {/* Search input spanning 5 columns */}
      <div className="col-span-5 relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your guess ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full h-full bg-white text-black px-4 outline-none"
        />
        
        {isOpen && (
          <div 
            ref={resultsRef}
            className="absolute z-10 mt-1 w-full bg-white text-gray-900 shadow-lg max-h-60 overflow-auto"
          >
            {results.map(player => (
              <div
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <span>{player.name}</span>
                <span className="ml-2 text-sm text-gray-500">({player.position})</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRow;