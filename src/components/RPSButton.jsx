import React from 'react';
import { RPS_CHOICES } from '../utils/constants.js';

/**
 * RPSButton Component - Rock Paper Scissors choice button
 */
const RPSButton = React.memo(({ choice, player, isTurn, onClick, isSelected }) => {
  const getChoiceEmoji = (choice) => {
    switch(choice) {
      case RPS_CHOICES.ROCK: return '🪨';
      case RPS_CHOICES.PAPER: return '📄';
      case RPS_CHOICES.SCISSORS: return '✂️';
      default: return '';
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSelected && isTurn && onClick) {
      onClick(player, choice);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSelected || !isTurn}
      className={`px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black transition-all duration-300 text-sm sm:text-base transform relative overflow-hidden ${
        isSelected
          ? 'button-premium text-gray-900 ring-4 ring-yellow-300 scale-110 shadow-2xl' 
          : isTurn
            ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-red-500/50 cursor-pointer'
            : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed opacity-50'
      }`}
      style={{ pointerEvents: isSelected || !isTurn ? 'none' : 'auto' }}
      aria-label={`${player} choose ${choice}`}
      aria-pressed={isSelected}
    >
      <span className="relative z-10 flex items-center gap-2 pointer-events-none">
        <span className="text-lg">{getChoiceEmoji(choice)}</span>
        <span>{choice}</span>
      </span>
    </button>
  );
});

RPSButton.displayName = 'RPSButton';
export default RPSButton;

