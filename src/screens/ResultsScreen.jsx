import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { PLAYERS, GAME_STATES } from '../utils/constants.js';
import { getPlayerName } from '../utils/gameLogic.js';
import { determineWinner } from '../utils/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Button from '../components/Button.jsx';
import TeamComparison from '../components/TeamComparison.jsx';

/**
 * Team Comparison Screen - Shows final crews side-by-side
 */
const TeamComparisonScreen = () => {
  const playerNameA = useGameStore((state) => state.playerNameA);
  const playerNameB = useGameStore((state) => state.playerNameB);
  const teamA = useGameStore((state) => state.teamA);
  const teamB = useGameStore((state) => state.teamB);
  const loading = useGameStore((state) => state.loading);
  const setGameState = useGameStore((state) => state.setGameState);
  const setLoading = useGameStore((state) => state.setLoading);
  const setWinner = useGameStore((state) => state.setWinner);
  const setMessage = useGameStore((state) => state.setMessage);
  const setError = useGameStore((state) => state.setError);

  const handleSeeBattleResults = async () => {
    // Prevent multiple simultaneous calls
    if (loading) {
      return;
    }

    setLoading(true);
    setMessage('Initiating AI Judgment...');
    setError(null);
    
    try {
      const result = await determineWinner(teamA, teamB, playerNameA, playerNameB);
      const winnerName = getPlayerName(result.winner, playerNameA, playerNameB);
      
      // Only update state once with final result
      setWinner(result);
      setMessage(`Judgment complete! The winner is ${winnerName}!`);
      setError(null);
      setGameState(GAME_STATES.BATTLE_RESULTS);
    } catch (error) {
      // Only update on final error, not during retries
      if (error.message !== 'Request was cancelled') {
        console.error('AI Judgment error:', error);
        setError(`AI Judgment failed: ${error.message}`);
        setWinner({ 
          winner: 'PlayerA', 
          reasoning: `The AI could not determine a clear winner. Error: ${error.message}. Please try starting a new game.` 
        });
        setGameState(GAME_STATES.BATTLE_RESULTS);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col min-h-0 w-full"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain',
        touchAction: 'pan-y',
        position: 'relative',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Scrollable Content Area */}
      <div 
        className="flex-1 overflow-y-auto w-full"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
          touchAction: 'pan-y',
          flex: '1 1 auto',
          minHeight: 0
        }}
      >
        {/* Team Comparison Section */}
        <div className="mt-3 sm:mt-5 p-3 sm:p-4 md:p-6 card-premium rounded-2xl shadow-2xl border-2 border-blue-500/50 relative overflow-visible w-full max-w-full mb-24">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 rounded-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:30px_30px] rounded-2xl" />
          
          <div className="relative z-10 w-full">
            <TeamComparison 
              teamA={teamA}
              teamB={teamB}
              playerNameA={playerNameA}
              playerNameB={playerNameB}
            />
          </div>
        </div>
      </div>
      
      {/* Sticky Button at Bottom - Always Accessible */}
      <div 
        className="sticky bottom-0 left-0 right-0 w-full p-3 sm:p-4 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent backdrop-blur-md border-t border-yellow-600/30 z-50"
        style={{
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <Button
          onClick={handleSeeBattleResults}
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>⚔️</span>
                <span>See Battle Results</span>
                <span>⬇️</span>
              </>
            )}
          </span>
        </Button>
      </div>
    </div>
  );
};

/**
 * Battle Results Screen - Displays winner and AI rationale
 */
const BattleResultsScreen = () => {
  const winner = useGameStore((state) => state.winner);
  const loading = useGameStore((state) => state.loading);
  const playerNameA = useGameStore((state) => state.playerNameA);
  const playerNameB = useGameStore((state) => state.playerNameB);
  const resetGame = useGameStore((state) => state.resetGame);

  return (
    <div 
      className="flex-1 flex flex-col min-h-0 w-full"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain',
        touchAction: 'pan-y',
        position: 'relative',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <div 
        className="flex-1 overflow-y-auto w-full"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
          touchAction: 'pan-y',
          paddingBottom: '2rem'
        }}
      >
        {/* Battle Results Section */}
        <div className="mt-5 p-4 sm:p-6 card-premium rounded-2xl shadow-2xl border-2 border-red-500/50 text-center relative overflow-visible w-full max-w-full">
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

/**
 * Results Screen - Router component that shows appropriate screen based on game state
 */
const ResultsScreen = () => {
  const gameState = useGameStore((state) => state.gameState);
  
  if (gameState === GAME_STATES.TEAM_COMPARISON) {
    return <TeamComparisonScreen />;
  } else if (gameState === GAME_STATES.BATTLE_RESULTS || gameState === GAME_STATES.END) {
    return <BattleResultsScreen />;
  }
  
  // Fallback to team comparison if state is unclear
  return <TeamComparisonScreen />;
};

export default ResultsScreen;
