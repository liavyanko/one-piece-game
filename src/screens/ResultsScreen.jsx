import React, { useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { PLAYERS } from '../utils/constants.js';
import { getPlayerName } from '../utils/gameLogic.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Button from '../components/Button.jsx';
import TeamComparison from '../components/TeamComparison.jsx';

/**
 * Results Screen - Displays battle results and winner
 */
const ResultsScreen = () => {
  const winner = useGameStore((state) => state.winner);
  const loading = useGameStore((state) => state.loading);
  const playerNameA = useGameStore((state) => state.playerNameA);
  const playerNameB = useGameStore((state) => state.playerNameB);
  const teamA = useGameStore((state) => state.teamA);
  const teamB = useGameStore((state) => state.teamB);
  const resetGame = useGameStore((state) => state.resetGame);
  
  const battleResultsRef = useRef(null);

  const scrollToBattleResults = () => {
    if (battleResultsRef.current) {
      battleResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
      <div className="flex-1 space-y-4 pb-6">
        {/* Team Comparison Section - At the Top */}
        <div className="mt-5 p-5 sm:p-6 card-premium rounded-2xl shadow-2xl border-2 border-blue-500/50 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />
          
          <div className="relative z-10">
            <TeamComparison 
              teamA={teamA}
              teamB={teamB}
              playerNameA={playerNameA}
              playerNameB={playerNameB}
            />
            
            {/* See Battle Results Button */}
            <div className="mt-6">
              <Button
                onClick={scrollToBattleResults}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>⚔️</span>
                  <span>See Battle Results</span>
                  <span>⬇️</span>
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Battle Results Section - Below Team Comparison */}
        <div 
          ref={battleResultsRef}
          className="p-5 sm:p-6 card-premium rounded-2xl shadow-2xl border-2 border-red-500/50 text-center relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />
          
          <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient mb-4 relative z-10">
            ⚔️ BATTLE RESULTS ⚔️
          </h2>

          {loading && (
            <div className="relative z-10">
              <LoadingSpinner 
                size="lg" 
                text="AI Judge Analyzing Battle..." 
                className="mb-6"
              />
            </div>
          )}

          {winner && !loading && (
            <div className="relative z-10 animate-fadeIn space-y-6">
              {/* Winner Announcement */}
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-gold-gradient my-6 drop-shadow-2xl animate-float">
                <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  🏆 WINNER: {getPlayerName(winner.winner, playerNameA, playerNameB)} 🏆
                </div>
              </div>
              
              {/* AI Judge Rationale */}
              <div className="card-premium p-4 sm:p-5 rounded-xl border-2 border-yellow-600/40 shadow-xl text-left backdrop-blur-sm">
                <h3 className="text-base sm:text-lg font-black text-gold-gradient mb-3 border-b-2 border-yellow-600/30 pb-2">
                  ⚖️ AI JUDGE RATIONALE:
                </h3>
                <p className="whitespace-pre-wrap text-xs sm:text-sm text-gray-200 leading-relaxed">{winner.reasoning}</p>
              </div>
              
              {/* Reset Button */}
              <Button
                onClick={resetGame}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>⚓</span>
                  <span>New Adventure</span>
                  <span>🏴‍☠️</span>
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
