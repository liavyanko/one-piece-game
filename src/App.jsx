import React, { useEffect } from 'react';
import { useGameStore } from './store/gameStore.js';
import { GAME_STATES } from './utils/constants.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import InitScreen from './screens/InitScreen.jsx';
import NameInputScreen from './screens/NameInputScreen.jsx';
import RPSScreen from './screens/RPSScreen.jsx';
import DraftScreen from './screens/DraftScreen.jsx';
import ResultsScreen from './screens/ResultsScreen.jsx';
import Button from './components/Button.jsx';

/**
 * Main App Component
 * Orchestrates game flow and renders appropriate screens
 */
const App = () => {
  const gameState = useGameStore((state) => state.gameState);
  const message = useGameStore((state) => state.message);
  const error = useGameStore((state) => state.error);
  const initializeDeck = useGameStore((state) => state.initializeDeck);
  const resetGame = useGameStore((state) => state.resetGame);

  // Initialize deck on mount
  useEffect(() => {
    initializeDeck();
  }, [initializeDeck]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen ocean-background p-2 sm:p-3 font-sans overflow-x-hidden relative" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ touchAction: 'none' }}>
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl animate-float" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-400/5 rounded-full blur-2xl animate-float" style={{ animationDuration: '7s', animationDelay: '2s' }} />
        </div>

        <div className="max-w-md mx-auto w-full relative z-10 min-h-screen flex flex-col" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Error Display */}
          {error && gameState !== GAME_STATES.INIT && (
            <div className="bg-gradient-to-r from-red-900/90 via-red-800/90 to-red-900/90 p-3 rounded-xl text-center font-bold text-xs text-red-100 border-2 border-red-500/50 shadow-xl mb-3 backdrop-blur-sm">
              <span className="inline-block mr-2">⚠️</span>
              {error}
            </div>
          )}

          {/* Status Message */}
          {message && gameState !== GAME_STATES.INIT && gameState !== GAME_STATES.NAME_INPUT && (
            <div className="bg-gradient-to-r from-yellow-900/80 via-amber-900/80 to-yellow-900/80 p-3 sm:p-4 rounded-xl text-center font-bold text-xs sm:text-sm text-amber-100 border-2 border-yellow-600/50 shadow-xl backdrop-blur-sm relative overflow-hidden mb-3">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              <span className="relative z-10">{message}</span>
            </div>
          )}

          {/* Game Screens */}
          {gameState === GAME_STATES.INIT && <InitScreen />}
          {gameState === GAME_STATES.NAME_INPUT && <NameInputScreen />}
          {gameState === GAME_STATES.RPS && <RPSScreen />}
          {gameState === GAME_STATES.DRAWING && <DraftScreen />}
          {gameState === GAME_STATES.END && <ResultsScreen />}

          {/* Reset Button (visible during game) */}
          {(gameState === GAME_STATES.RPS || gameState === GAME_STATES.DRAWING) && (
            <div className="mt-5 text-center">
              <Button
                onClick={resetGame}
                variant="secondary"
                size="sm"
              >
                🔄 Reset Game
              </Button>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

