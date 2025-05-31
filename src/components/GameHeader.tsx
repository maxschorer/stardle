import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const GameHeader = () => {
  const { setShowHowToPlay } = useGame();
  const navigate = useNavigate();
  
  return (
    <header className="bg-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-300">
          NBA-dle
        </Link>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/players')}
            className="text-white hover:text-gray-300"
            aria-label="Player list"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          
          <button 
            onClick={() => setShowHowToPlay(true)}
            className="text-white hover:text-gray-300"
            aria-label="How to play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;