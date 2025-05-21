import React from 'react';
import Modal from './Modal';
import { Player } from '../types/Player';
import { Share2 } from 'lucide-react';
import { formatNumber } from '../utils/gameUtils';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameWon: boolean;
  targetPlayer: Player | null;
  attempts: number;
  maxAttempts: number;
  onShare: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  gameWon,
  targetPlayer,
  attempts,
  maxAttempts,
  onShare
}) => {
  if (!targetPlayer) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={gameWon ? 'You Won!' : 'Game Over'}
    >
      <div className="space-y-4">
        {gameWon ? (
          <p className="text-center">
            Congratulations! You guessed the player in{' '}
            <span className="font-bold">{attempts}</span> attempts!
          </p>
        ) : (
          <p className="text-center">
            Better luck next time! The player was:
          </p>
        )}
        
        <div className="py-4 px-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold text-center mb-4">{targetPlayer.name}</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Position</p>
              <p className="font-medium">{targetPlayer.position}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Rookie Year</p>
              <p className="font-medium">{targetPlayer.rookieYear}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Seasons</p>
              <p className="font-medium">{targetPlayer.seasons}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">All-Star Games</p>
              <p className="font-medium">{targetPlayer.allStarGames}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Rings</p>
              <p className="font-medium">{targetPlayer.rings}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Career Points</p>
              <p className="font-medium">{formatNumber(targetPlayer.careerPoints)}</p>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm">
          A new Stardle will be available tomorrow!
        </p>
      </div>
      
      <div className="mt-6 space-y-3">
        <button
          onClick={onShare}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <Share2 size={18} className="mr-2" />
          Share Results
        </button>
        
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default GameOverModal;