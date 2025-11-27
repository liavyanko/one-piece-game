import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { GAME_STATES, CHARACTER_CARDS_MOCK, TEAM_POSITIONS, MAX_TEAM_SIZE } from '../utils/constants.js';
import { shuffleArray } from '../utils/gameLogic.js';
import { determineWinner } from '../utils/api.js';
import { getPlayerName } from '../utils/gameLogic.js';
import Button from '../components/Button.jsx';

/**
 * Initial Screen - Welcome and game rules
 */
const InitScreen = () => {
  const setGameState = useGameStore((state) => state.setGameState);
  const setPlayerNameA = useGameStore((state) => state.setPlayerNameA);
  const setPlayerNameB = useGameStore((state) => state.setPlayerNameB);
  const setTeamA = useGameStore((state) => state.setTeamA);
  const setTeamB = useGameStore((state) => state.setTeamB);
  const setGameStateStore = useGameStore((state) => state.setGameState);
  const setWinner = useGameStore((state) => state.setWinner);
  const setLoading = useGameStore((state) => state.setLoading);
  const setMessage = useGameStore((state) => state.setMessage);
  
  const [devClickCount, setDevClickCount] = useState(0);
  
  // Developer mode: Auto-fill teams and go to results
  const handleDevMode = async () => {
    // Set player names
    setPlayerNameA('Dev Player A');
    setPlayerNameB('Dev Player B');
    
    // Shuffle deck and auto-assign cards
    const shuffledDeck = shuffleArray(CHARACTER_CARDS_MOCK);
    
    // Auto-fill Team A
    const newTeamA = [];
    for (let i = 0; i < MAX_TEAM_SIZE; i++) {
      if (shuffledDeck.length > 0) {
        const card = shuffledDeck.shift();
        newTeamA.push({
          character: card,
          position: TEAM_POSITIONS[i]
        });
      }
    }
    
    // Auto-fill Team B
    const newTeamB = [];
    for (let i = 0; i < MAX_TEAM_SIZE; i++) {
      if (shuffledDeck.length > 0) {
        const card = shuffledDeck.shift();
        newTeamB.push({
          character: card,
          position: TEAM_POSITIONS[i]
        });
      }
    }
    
    setTeamA(newTeamA);
    setTeamB(newTeamB);
    setGameStateStore(GAME_STATES.END);
    setMessage('Developer Mode: Auto-filled teams. Determining winner...');
    
    // Auto-determine winner
    setLoading(true);
    try {
      const result = await determineWinner(newTeamA, newTeamB, 'Dev Player A', 'Dev Player B');
      setWinner(result);
      setMessage(`Judgment complete! The winner is ${getPlayerName(result.winner, 'Dev Player A', 'Dev Player B')}!`);
    } catch (error) {
      setWinner({
        winner: 'PlayerA',
        reasoning: 'Developer mode test - Auto-filled teams for testing purposes.'
      });
      setMessage('Developer mode: Test teams created.');
    } finally {
      setLoading(false);
    }
  };
  
  // Secret button: Click title 5 times
  const handleTitleClick = () => {
    const newCount = devClickCount + 1;
    setDevClickCount(newCount);
    if (newCount >= 5) {
      handleDevMode();
      setDevClickCount(0);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-fadeIn">
      {/* Premium Header with One Piece Theme */}
      <div className="mb-6 sm:mb-8">
        <div className="relative inline-block mb-4 animate-float" style={{ animationDuration: '3s' }}>
          <h1 
            onClick={handleTitleClick}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-gold-gradient mb-2 uppercase tracking-wider relative z-10 cursor-pointer select-none transition-transform hover:scale-105 active:scale-95"
            title={devClickCount > 0 ? `${5 - devClickCount} clicks remaining...` : ''}
          >
            🎩 ONE PIECE DRAFT
          </h1>
          <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-black text-yellow-600/30 blur-sm uppercase tracking-wider pointer-events-none">
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

      {/* Developer Mode Button - Visible for Testing */}
      <div className="mt-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <Button 
          onClick={handleDevMode}
          variant="secondary"
          size="md"
          className="relative opacity-70 hover:opacity-100 transition-opacity"
        >
          <span className="flex items-center gap-2 text-xs sm:text-sm">
            <span>🔧</span>
            <span>Developer Mode</span>
            <span className="text-[10px] opacity-75">(Auto-fill & Test)</span>
          </span>
        </Button>
        <p className="mt-2 text-[10px] text-gray-500 font-medium">Skip to results with auto-filled teams</p>
      </div>
    </div>
  );
};

export default InitScreen;

