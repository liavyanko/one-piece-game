import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { PLAYERS, RPS_CHOICES } from '../utils/constants.js';
import { determineRPSWinner, getPlayerName } from '../utils/gameLogic.js';
import RPSButton from '../components/RPSButton.jsx';
import { useTimeoutManager } from '../hooks/useTimeoutManager.js';
import { TRANSITION_DELAY, GAME_STATES } from '../utils/constants.js';

/**
 * Rock-Paper-Scissors Screen
 */
const RPSScreen = () => {
  const rpsChoice = useGameStore((state) => state.rpsChoice);
  const rpsResult = useGameStore((state) => state.rpsResult);
  const playerNameA = useGameStore((state) => state.playerNameA);
  const playerNameB = useGameStore((state) => state.playerNameB);
  const setRpsChoice = useGameStore((state) => state.setRpsChoice);
  const setRpsResult = useGameStore((state) => state.setRpsResult);
  const setMessage = useGameStore((state) => state.setMessage);
  const setGameState = useGameStore((state) => state.setGameState);
  const setPlayerTurn = useGameStore((state) => state.setPlayerTurn);
  const drawCard = useGameStore((state) => state.drawCard);

  const { addTimeout } = useTimeoutManager();

  const handleRPS = (player, choice) => {
    setRpsChoice(prev => {
      const updated = { ...prev, [player]: choice };
      
      // Check if both players have chosen
      if (player === PLAYERS.B && updated[PLAYERS.A]) {
        const winner = determineRPSWinner(updated[PLAYERS.A], choice);
        
        if (winner === null) {
          // Tie - reset choices
          setRpsResult('Tie! Choose again.');
          setMessage('Tie! Both players must choose again.');
          return { PlayerA: null, PlayerB: null };
        } else {
          // Determine winner
          const winnerName = getPlayerName(winner, playerNameA, playerNameB);
          const resultText = `${winnerName} wins the draw! They will start first.`;
          setRpsResult(resultText);
          
          // Transition to drawing phase
          const timeoutId = setTimeout(() => {
            setGameState(GAME_STATES.DRAWING);
            setPlayerTurn(winner);
            drawCard(winner);
            const state = useGameStore.getState();
            if (state.currentCard) {
              setMessage(`${winnerName}'s turn. Drawn card: ${state.currentCard.name}. Choose a position or Skip.`);
            } else {
              setMessage(`Game begins! It is ${winnerName}'s turn.`);
            }
          }, TRANSITION_DELAY);
          
          addTimeout(timeoutId);
          return updated;
        }
      } else if (player === PLAYERS.A) {
        setMessage(`${playerNameA || 'Player 1'} has chosen. Awaiting ${playerNameB || 'Player 2'}'s choice...`);
      }
      
      return updated;
    });
  };

  return (
    <div className="text-center card-premium p-5 sm:p-6 rounded-2xl shadow-2xl border-2 border-yellow-600/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 via-transparent to-blue-900/10" />
      <h2 className="text-lg sm:text-xl font-black text-gold-gradient mb-5 relative z-10">
        ⚔️ Choose Your Weapon ⚔️
      </h2>
      
      {/* Player A's Turn - Premium Design */}
      {!rpsChoice.PlayerA && (
        <div className="p-5 rounded-xl border-2 border-dashed border-blue-500/60 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm relative z-10 animate-slideLeft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />
          <h3 className="text-base sm:text-lg font-black text-blue-200 mb-2 relative z-10">
            ⚓ {playerNameA || 'Player 1'} - Your Turn
          </h3>
          <p className="text-xs text-gray-300 mb-4 relative z-10">Choose your option. {playerNameB || 'Player 2'} cannot see your choice.</p>
          <div className="flex flex-wrap justify-center gap-2 relative z-10">
            <RPSButton 
              choice={RPS_CHOICES.ROCK} 
              player={PLAYERS.A} 
              isTurn={true}
              onClick={handleRPS}
              isSelected={false}
            />
            <RPSButton 
              choice={RPS_CHOICES.PAPER} 
              player={PLAYERS.A} 
              isTurn={true}
              onClick={handleRPS}
              isSelected={false}
            />
            <RPSButton 
              choice={RPS_CHOICES.SCISSORS} 
              player={PLAYERS.A} 
              isTurn={true}
              onClick={handleRPS}
              isSelected={false}
            />
          </div>
        </div>
      )}

      {/* Player A Has Chosen - Premium Locked State */}
      {rpsChoice.PlayerA && !rpsChoice.PlayerB && (
        <>
          <div className="mb-4 p-4 rounded-xl border-2 border-solid border-blue-500/60 bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm relative z-10 animate-pulse">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:15px_15px] opacity-30" />
            <h3 className="text-sm sm:text-base font-black text-blue-200 mb-2 relative z-10">⚓ {playerNameA || 'Player 1'}</h3>
            <p className="text-xs font-bold text-green-400 relative z-10">🔒 Choice Locked</p>
            <p className="text-xs text-gray-400 mt-1 relative z-10">Waiting for {playerNameB || 'Player 2'}...</p>
          </div>

          {/* Player B's Turn - Premium Design */}
          <div className="p-5 rounded-xl border-2 border-dashed border-red-500/60 bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-sm relative z-10 animate-slideRight">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />
            <h3 className="text-base sm:text-lg font-black text-red-200 mb-2 relative z-10">
              ⚓ {playerNameB || 'Player 2'} - Your Turn
            </h3>
            <p className="text-xs text-gray-300 mb-4 relative z-10">Choose your option. {playerNameA || 'Player 1'} cannot see your choice.</p>
            <div className="flex flex-wrap justify-center gap-2 relative z-10">
              <RPSButton 
                choice={RPS_CHOICES.ROCK} 
                player={PLAYERS.B} 
                isTurn={true}
                onClick={handleRPS}
                isSelected={false}
              />
              <RPSButton 
                choice={RPS_CHOICES.PAPER} 
                player={PLAYERS.B} 
                isTurn={true}
                onClick={handleRPS}
                isSelected={false}
              />
              <RPSButton 
                choice={RPS_CHOICES.SCISSORS} 
                player={PLAYERS.B} 
                isTurn={true}
                onClick={handleRPS}
                isSelected={false}
              />
            </div>
          </div>
        </>
      )}

      {/* Both Players Have Chosen - Premium Results Display */}
      {rpsChoice.PlayerA && rpsChoice.PlayerB && (
        <>
          <div className="mb-3 p-4 rounded-xl border-2 border-solid border-blue-500/60 bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm relative z-10 animate-slideLeft">
            <h3 className="text-sm sm:text-base font-black text-blue-200 mb-1 relative z-10">⚓ {playerNameA || 'Player 1'}</h3>
            <p className="text-xs font-bold text-blue-100 relative z-10">Choice: <span className="text-gold-gradient">{rpsChoice.PlayerA}</span></p>
          </div>
          <div className="mb-4 p-4 rounded-xl border-2 border-solid border-red-500/60 bg-gradient-to-br from-red-900/40 to-red-800/30 backdrop-blur-sm relative z-10 animate-slideRight">
            <h3 className="text-sm sm:text-base font-black text-red-200 mb-1 relative z-10">⚓ {playerNameB || 'Player 2'}</h3>
            <p className="text-xs font-bold text-red-100 relative z-10">Choice: <span className="text-gold-gradient">{rpsChoice.PlayerB}</span></p>
          </div>
          {rpsResult && (
            <div className="mt-5 text-base sm:text-lg font-black text-gold-gradient bg-gradient-to-r from-green-900/40 via-green-800/30 to-green-900/40 p-4 rounded-xl border-2 border-green-500/50 backdrop-blur-sm shadow-xl relative z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              <span className="relative z-10">{rpsResult}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RPSScreen;

