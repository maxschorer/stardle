import React from 'react';
import Modal from './Modal';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How To Play">
      <div className="space-y-4">
        <p>
          <span className="font-semibold">Stardle</span> is a daily NBA player guessing game. 
          Try to guess the mystery NBA player in 8 attempts!
        </p>
        
        <div>
          <h3 className="text-lg font-bold mb-2">How It Works:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Type a player name and select from the dropdown</li>
            <li>After each guess, the color of the tiles will change to show how close your guess was</li>
            <li>You have 8 attempts to guess the player</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-2">Color Meanings:</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-600 rounded mr-2"></div>
              <span>Exact match</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded mr-2"></div>
              <span>Close match (e.g., ±1 year, similar position)</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-700 rounded mr-2"></div>
              <span>Incorrect</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-2">Attributes Compared:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Position:</strong> The player's primary position (PG, SG, SF, PF, C)</li>
            <li><strong>Rookie Year:</strong> The year the player entered the NBA</li>
            <li><strong>Seasons:</strong> Total number of NBA seasons played</li>
            <li><strong>All-Star Games:</strong> Number of All-Star game appearances</li>
            <li><strong>Rings:</strong> Number of NBA championships won</li>
            <li><strong>Career Points:</strong> Total career points scored</li>
          </ul>
        </div>
        
        <p className="italic">A new Stardle will be available each day!</p>
      </div>
      
      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Let's Play!
        </button>
      </div>
    </Modal>
  );
};

export default HowToPlayModal;