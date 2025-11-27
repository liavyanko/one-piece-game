import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { GAME_STATES } from '../utils/constants.js';
import Button from '../components/Button.jsx';

/**
 * Initial Screen - Welcome and game rules
 */
const InitScreen = () => {
  const setGameState = useGameStore((state) => state.setGameState);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-fadeIn">
      {/* Premium Header with One Piece Theme */}
      <div className="mb-6 sm:mb-8">
        <div className="relative inline-block mb-4 animate-float" style={{ animationDuration: '3s' }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gold-gradient mb-2 uppercase tracking-wider relative z-10">
            🎩 ONE PIECE DRAFT
          </h1>
          <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-black text-yellow-600/30 blur-sm uppercase tracking-wider">
            🎩 ONE PIECE DRAFT
          </div>
        </div>
        
        {/* Game Rules & Explanation - Premium Design */}
        <div className="bg-gradient-to-r from-yellow-900/80 via-amber-900/80 to-yellow-900/80 p-4 sm:p-5 rounded-xl text-left font-medium text-xs sm:text-sm text-amber-100 border-2 border-yellow-600/50 shadow-xl backdrop-blur-sm relative overflow-hidden max-w-lg mx-auto animate-slideUp">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div className="relative z-10 space-y-3">
            <div className="font-black text-gold-gradient text-sm sm:text-base mb-2 text-center">
              ⚓ Welcome to the One Piece Card Draft! ⚓
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold text-yellow-200">🎮 How to Play:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2 text-amber-100">
                <li><strong>Rock-Paper-Scissors:</strong> Determine who goes first</li>
                <li><strong>Draft Phase:</strong> Take turns drawing cards from the deck</li>
                <li><strong>Build Your Crew:</strong> Fill 8 positions (Captain, Vice Captain, Tank, Swordsman, Healer, Sniper, Support 1, Support 2)</li>
                <li><strong>Strategic Placement:</strong> Place characters in roles that match their strengths</li>
                <li><strong>Skip Option:</strong> Skip once per game to get another card (stays your turn)</li>
                <li><strong>Victory:</strong> First to complete their crew wins! AI judges based on team strength, role suitability, and synergy</li>
              </ul>
            </div>
            
            <div className="pt-2 border-t border-yellow-600/30">
              <p className="text-center font-bold text-gold-gradient">Ready to set sail and build your legendary crew? 🏴‍☠️</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Start Button - Centered */}
      <div className="mt-6 sm:mt-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <Button 
          onClick={() => setGameState(GAME_STATES.NAME_INPUT)} 
          variant="primary"
          size="xl"
          className="relative glow-effect"
        >
          <span className="flex items-center gap-3">
            <span className="text-2xl">⚓</span>
            <span>SET SAIL</span>
            <span className="text-2xl">🏴‍☠️</span>
          </span>
        </Button>
        <p className="mt-4 text-xs text-gray-400 font-medium">Begin Your Grand Adventure</p>
      </div>
    </div>
  );
};

export default InitScreen;

