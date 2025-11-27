import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { GAME_STATES } from '../utils/constants.js';
import { validatePlayerName } from '../utils/gameLogic.js';
import Button from '../components/Button.jsx';

/**
 * Name Input Screen - Players enter their names
 */
const NameInputScreen = () => {
  const playerNameA = useGameStore((state) => state.playerNameA);
  const playerNameB = useGameStore((state) => state.playerNameB);
  const setPlayerNameA = useGameStore((state) => state.setPlayerNameA);
  const setPlayerNameB = useGameStore((state) => state.setPlayerNameB);
  const setGameState = useGameStore((state) => state.setGameState);
  const setMessage = useGameStore((state) => state.setMessage);
  const setError = useGameStore((state) => state.setError);
  const [errorA, setErrorA] = useState('');
  const [errorB, setErrorB] = useState('');

  const handleNameAChange = (e) => {
    const value = e.target.value;
    setPlayerNameA(value);
    const validation = validatePlayerName(value);
    setErrorA(validation.valid ? '' : validation.error || '');
    if (validation.valid) {
      setError('');
    }
  };

  const handleNameBChange = (e) => {
    const value = e.target.value;
    setPlayerNameB(value);
    const validation = validatePlayerName(value);
    setErrorB(validation.valid ? '' : validation.error || '');
    if (validation.valid) {
      setError('');
    }
  };

  const handleContinue = () => {
    const validationA = validatePlayerName(playerNameA);
    const validationB = validatePlayerName(playerNameB);

    if (!validationA.valid) {
      setErrorA(validationA.error || '');
      setError('Please fix Player 1 name');
      return;
    }

    if (!validationB.valid) {
      setErrorB(validationB.error || '');
      setError('Please fix Player 2 name');
      return;
    }

    setMessage(`Welcome ${playerNameA.trim()} and ${playerNameB.trim()}! Let's determine who goes first.`);
    setError('');
    setGameState(GAME_STATES.RPS);
  };

  const canContinue = playerNameA.trim() && playerNameB.trim() && !errorA && !errorB;

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-fadeIn">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient mb-6 animate-slideDown">
          ⚓ Enter Player Names ⚓
        </h2>
        
        {/* Player A Name Input */}
        <div className="card-premium p-5 rounded-2xl border-2 border-blue-500/60 relative overflow-visible animate-slideLeft">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-blue-900/20 pointer-events-none" />
          <div className="relative z-20">
            <label className="block text-sm font-bold text-blue-200 mb-3">
              🏴‍☠️ Player 1 Name
            </label>
            <input
              type="text"
              value={playerNameA}
              onChange={handleNameAChange}
              onFocus={(e) => e.target.select()}
              placeholder="Enter Player 1 name..."
              className="w-full px-4 py-3 rounded-xl bg-gray-900/90 border-2 border-blue-500/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-center font-bold text-lg relative z-20"
              maxLength={20}
              autoFocus
              autoComplete="off"
              style={{ pointerEvents: 'auto', WebkitUserSelect: 'text' }}
            />
            {errorA && (
              <p className="mt-2 text-xs text-red-400 font-medium">{errorA}</p>
            )}
          </div>
        </div>

        {/* Player B Name Input */}
        <div className="card-premium p-5 rounded-2xl border-2 border-red-500/60 relative overflow-visible animate-slideRight">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-red-800/10 to-red-900/20 pointer-events-none" />
          <div className="relative z-20">
            <label className="block text-sm font-bold text-red-200 mb-3">
              🏴‍☠️ Player 2 Name
            </label>
            <input
              type="text"
              value={playerNameB}
              onChange={handleNameBChange}
              onFocus={(e) => e.target.select()}
              placeholder="Enter Player 2 name..."
              className="w-full px-4 py-3 rounded-xl bg-gray-900/90 border-2 border-red-500/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300 text-center font-bold text-lg relative z-20"
              maxLength={20}
              autoComplete="off"
              style={{ pointerEvents: 'auto', WebkitUserSelect: 'text' }}
            />
            {errorB && (
              <p className="mt-2 text-xs text-red-400 font-medium">{errorB}</p>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          variant="primary"
          size="lg"
          className="w-full"
        >
          <span className="flex items-center justify-center gap-2">
            <span>⚔️</span>
            <span>Continue to Rock-Paper-Scissors</span>
            <span>⚔️</span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default NameInputScreen;

