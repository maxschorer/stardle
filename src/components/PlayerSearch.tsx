import React, { useState, useEffect, useRef } from 'react';
import { searchPlayers } from '../data/players';
import { Player } from '../types/Player';
import { Search } from 'lucide-react';

interface PlayerSearchProps {
  onSelectPlayer: (player: Player) => void;
  disabled?: boolean;
  excludedPlayerIds?: string[];
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ 
  onSelectPlayer, 
  disabled = false,
  excludedPlayerIds = []
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Player[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const searchResults = await searchPlayers(query);
          const filteredResults = searchResults.filter(
            player => !excludedPlayerIds.includes(player.id)
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
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, excludedPlayerIds]);

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

  const handleSelect = (player: Player) => {
    onSelectPlayer(player);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for an NBA player..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          disabled={disabled}
          className="w-full px-4 py-3 pl-10 bg-white text-gray-900 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white text-gray-900 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {results.map(player => (
            <div
              key={player.id}
              onClick={() => handleSelect(player)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            >
              <span>{player.name}</span>
              <span className="ml-2 text-sm text-gray-500">({player.position})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;