import { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

const GameOverModal = () => {
  const { 
    showGameOver, 
    setShowGameOver, 
    gameWon, 
    targetPlayer, 
    shareResults 
  } = useGame();

  if (!showGameOver) return null;
  useEffect(() => {
    // Play victory sound when modal opens with a win
    if (gameWon) {
      const audio = new Audio('/sounds/victory.mp3');
      audio.play();
    }

  }, [gameWon]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold">
              {gameWon ? "Congratulations! Today's player is" : "Game over.  Today's player is"}
            </h2>
            <button 
              onClick={() => setShowGameOver(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-6 bg-white p-3 rounded-lg">
                <img 
                  src={`/images/players/${targetPlayer?.permalink}.png`}
                  alt={targetPlayer?.name}
                  className="w-full h-full object-cover object-[center_top]"
                />
                
                {/* Player Name */}
                <h2 className="text-xl font-bold text-center">
                  {targetPlayer?.name}
                </h2>
                
                {/* Attributes Grid */}
                <div className="grid grid-cols-5 gap-4 w-full">
                  {/* Position */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Position</span>
                    <span className="text-base">{targetPlayer?.position}</span>
                  </div>
                  
                  {/* Nationality */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Country</span>
                    <span><img 
                      src={`/images/countries/${targetPlayer?.nationality.toLowerCase().replace(' ', '-')}.svg`}
                      alt={targetPlayer?.nationality}
                      className="w-full h-auto object-contain"
                    /></span>
                  </div>
                  
                  {/* Team */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Team</span>
                    <span><img 
                      src={`/images/teams/${targetPlayer?.team.toLowerCase()}.svg`}
                      alt={targetPlayer?.team}
                      className="w-full h-auto object-contain"
                    /></span>
                  </div>


                  
                  {/* Seasons */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">Seasons</span>
                    <span className="text-base">{targetPlayer?.seasons}</span>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold mb-1">2K Rating</span>
                    <span className="text-base">{targetPlayer?.rating}</span>
                  </div>
                </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={shareResults}
                className="w-1/2 bg-green-600 text-white font-medium py-2 px-4 rounded-3xl transition duration-150 flex gap-3 items-center justify-center"
              >
                Share
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            <p className="text-center text-black text-sm">
              Come back tomorrow for a new player!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;