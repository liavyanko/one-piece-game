import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { GAME_STATES, PLAYERS, MAX_TEAM_SIZE, CARD_DRAW_DELAY, TRANSITION_DELAY, TEAM_POSITIONS } from '../utils/constants.js';
import { isTeamComplete, getPlayerName } from '../utils/gameLogic.js';
import { determineWinner } from '../utils/api.js';
import { useTimeoutManager } from '../hooks/useTimeoutManager.js';
import Card from '../components/Card.jsx';
import TeamDisplay from '../components/TeamDisplay.jsx';
import Button from '../components/Button.jsx';

/**
 * Draft Screen - Main game phase where players draft cards
 */
const DraftScreen = () => {
  const currentCard = useGameStore((state) => state.currentCard);
  const playerTurn = useGameStore((state) => state.playerTurn);
  const teamA = useGameStore((state) => state.teamA);
  const teamB = useGameStore((state) => state.teamB);
  const skipUsedA = useGameStore((state) => state.skipUsedA);
  const skipUsedB = useGameStore((state) => state.skipUsedB);
  const playerNameA = useGameStore((state) => state.playerNameA);
  const playerNameB = useGameStore((state) => state.playerNameB);
  const deck = useGameStore((state) => state.deck);
  const setCurrentCard = useGameStore((state) => state.setCurrentCard);
  const setTeamA = useGameStore((state) => state.setTeamA);
  const setTeamB = useGameStore((state) => state.setTeamB);
  const setSkipUsedA = useGameStore((state) => state.setSkipUsedA);
  const setSkipUsedB = useGameStore((state) => state.setSkipUsedB);
  const setPlayerTurn = useGameStore((state) => state.setPlayerTurn);
  const setGameState = useGameStore((state) => state.setGameState);
  const setMessage = useGameStore((state) => state.setMessage);
  const setError = useGameStore((state) => state.setError);
  const setWinner = useGameStore((state) => state.setWinner);
  const setLoading = useGameStore((state) => state.setLoading);
  const drawCard = useGameStore((state) => state.drawCard);
  const getCurrentSkipUsed = useGameStore((state) => state.getCurrentSkipUsed);

  const { addTimeout } = useTimeoutManager();

  const allSlotsFilled = useMemo(() => 
    isTeamComplete(teamA) && isTeamComplete(teamB),
    [teamA, teamB]
  );

  const deckEmpty = useMemo(() => deck.length === 0, [deck.length]);

  // Draw card wrapper
  const handleDrawCard = useCallback((player) => {
    drawCard(player);
    const state = useGameStore.getState();
    if (state.currentCard) {
      const playerName = getPlayerName(player, playerNameA, playerNameB);
      setMessage(`${playerName}'s turn. Drawn card: ${state.currentCard.name}. Choose a position or Skip.`);
    }
  }, [playerNameA, playerNameB, drawCard, setMessage]);

  // Handle placement or skip
  const handlePlacementOrSkip = useCallback((action) => {
    const state = useGameStore.getState();
    const isPlayerA = state.playerTurn === PLAYERS.A;
    const currentTeam = isPlayerA ? teamA : teamB;
    const setTeam = isPlayerA ? setTeamA : setTeamB;
    const setSkipUsed = isPlayerA ? setSkipUsedA : setSkipUsedB;
    const skipUsed = isPlayerA ? skipUsedA : skipUsedB;
    
    // Handle Skip
    if (action === 'SKIP') {
      if (skipUsed) {
        setError('Skip already used!');
        return;
      }
      
      setSkipUsed(true);
      setCurrentCard(null);
      const playerName = getPlayerName(state.playerTurn, playerNameA, playerNameB);
      setMessage(`${playerName} skipped the card. Drawing another card...`);
      
      // Keep the same player's turn and draw another card
      if (!allSlotsFilled && !deckEmpty) {
        const timeoutId = setTimeout(() => handleDrawCard(playerTurn), CARD_DRAW_DELAY);
        addTimeout(timeoutId);
      } else if (deckEmpty) {
        // If deck is empty, then pass turn to opponent
        const nextPlayer = isPlayerA ? PLAYERS.B : PLAYERS.A;
        const nextPlayerName = getPlayerName(nextPlayer, playerNameA, playerNameB);
        setPlayerTurn(nextPlayer);
        setMessage(`Deck is empty. Passing turn to ${nextPlayerName}.`);
      }
      return;
    }

    // Handle Placement
    const slotIndex = parseInt(action, 10);
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= MAX_TEAM_SIZE) {
      setError('Invalid slot index!');
      return;
    }

    if (!currentCard) {
      setError('No card to place!');
      return;
    }

    if (currentTeam[slotIndex] !== null) {
      setError('Slot already occupied!');
      return;
    }

    const newTeam = [...currentTeam];
    newTeam[slotIndex] = { 
      character: currentCard, 
      position: TEAM_POSITIONS[slotIndex] 
    };
    setTeam(newTeam);
    setCurrentCard(null);
    setError(null);
    setMessage(`${currentCard.name} successfully placed as ${TEAM_POSITIONS[slotIndex]}!`);

    // Check for game end - need to get fresh state after team update
    const updatedState = useGameStore.getState();
    const updatedTeamA = isPlayerA ? newTeam : updatedState.teamA;
    const updatedTeamB = isPlayerA ? updatedState.teamB : newTeam;
    const isTeamASlotsFull = isTeamComplete(updatedTeamA);
    const isTeamBSlotsFull = isTeamComplete(updatedTeamB);

    if (isTeamASlotsFull && isTeamBSlotsFull) {
      setGameState(GAME_STATES.END);
      setMessage('All positions filled! Game ended. Initiating AI Judgement...');
      const timeoutId = setTimeout(async () => {
        setLoading(true);
        try {
          // Get fresh state after team updates
          const finalState = useGameStore.getState();
          const finalTeamA = isPlayerA ? newTeam : finalState.teamA;
          const finalTeamB = isPlayerA ? finalState.teamB : newTeam;
          const result = await determineWinner(finalTeamA, finalTeamB, playerNameA, playerNameB);
          const winnerName = getPlayerName(result.winner, playerNameA, playerNameB);
          setWinner(result);
          setMessage(`Judgment complete! The winner is ${winnerName}!`);
          setError(null);
        } catch (error) {
          setError(`AI Judgment failed: ${error.message}`);
          setWinner({ 
            winner: 'NONE', 
            reasoning: 'The AI could not determine a clear winner. Please try starting a new game.' 
          });
        } finally {
          setLoading(false);
        }
      }, TRANSITION_DELAY);
      addTimeout(timeoutId);
    } else {
      const nextPlayer = isPlayerA ? PLAYERS.B : PLAYERS.A;
      setPlayerTurn(nextPlayer);
      
      if (!allSlotsFilled && !deckEmpty) {
        const timeoutId = setTimeout(() => handleDrawCard(nextPlayer), CARD_DRAW_DELAY);
        addTimeout(timeoutId);
      } else if (deckEmpty) {
        setMessage('Deck is empty. Game will end when all positions are filled.');
      }
    }
  }, [allSlotsFilled, deckEmpty, playerNameA, playerNameB, handleDrawCard, addTimeout, setTeamA, setTeamB, setSkipUsedA, setSkipUsedB, setCurrentCard, setError, setMessage, setPlayerTurn, setGameState, setLoading, setWinner, currentCard, playerTurn, teamA, teamB, skipUsedA, skipUsedB]);

  // Card ref for scrolling into view
  const cardRef = useRef(null);

  // Initial card draw on mount
  useEffect(() => {
    if (currentCard === null && !deckEmpty) {
      handleDrawCard(playerTurn);
    }
  }, []);

  // Scroll card into view when a new card is drawn
  useEffect(() => {
    if (currentCard && cardRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [currentCard]);

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
      {/* Current Card Display - Sticky at top when scrolled */}
      {currentCard && (
        <div 
          ref={cardRef}
          className="sticky top-0 z-50 mb-3 sm:mb-4 flex-shrink-0 animate-cardSlideIn bg-gradient-to-b from-gray-900/98 via-gray-900/95 to-transparent pb-3 -mx-2 px-2 backdrop-blur-md border-b border-yellow-600/20"
          style={{ 
            marginTop: '-8px',
            paddingTop: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="card-premium rounded-2xl p-3 sm:p-4 border-2 border-yellow-500/60 shadow-2xl relative overflow-hidden glow-effect max-w-xs mx-auto">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-red-900/20 to-yellow-900/20 animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />
            
            <div className="text-center mb-3 relative z-10">
              <h3 className="text-xs sm:text-sm font-black text-gold-gradient uppercase tracking-wider mb-2 animate-pulse">
                ⚡ NEW CARD ⚡
              </h3>
              <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
                <div className="transform scale-90 sm:scale-100">
                  <Card character={currentCard} position="Unassigned" />
                </div>
              </div>
            </div>
            
            {/* Premium Skip Button - Compact */}
            <div className="flex justify-center mt-2 relative z-10">
              <Button
                onClick={() => handlePlacementOrSkip('SKIP')}
                disabled={getCurrentSkipUsed()}
                variant={getCurrentSkipUsed() ? 'disabled' : 'danger'}
                size="sm"
              >
                <span className="flex items-center gap-1.5">
                  <span>⏭️</span>
                  <span>Skip (1x)</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stacked Decks - Scrollable Container */}
      <div className="relative flex-1 min-h-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain', touchAction: 'pan-y' }}>
        <div className="pb-4">
          <TeamDisplay 
            team={teamA} 
            teamName={playerNameA || 'Player 1'} 
            isCurrentPlayer={playerTurn === PLAYERS.A}
            skipUsed={skipUsedA}
            isRPSPhase={false}
            isExpanded={playerTurn === PLAYERS.A}
            onPlaceCard={handlePlacementOrSkip}
            currentCard={currentCard}
            gameState={GAME_STATES.DRAWING}
          />
          
          <TeamDisplay 
            team={teamB} 
            teamName={playerNameB || 'Player 2'} 
            isCurrentPlayer={playerTurn === PLAYERS.B}
            skipUsed={skipUsedB}
            isRPSPhase={false}
            isExpanded={playerTurn === PLAYERS.B}
            onPlaceCard={handlePlacementOrSkip}
            currentCard={currentCard}
            gameState={GAME_STATES.DRAWING}
          />
        </div>
      </div>
    </div>
  );
};

export default DraftScreen;
