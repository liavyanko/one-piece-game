import React, { useMemo } from 'react';
import { GAME_STATES, TEAM_POSITIONS, MAX_TEAM_SIZE } from '../utils/constants.js';
import Card from './Card.jsx';
import EmptySlot from './EmptySlot.jsx';
import Button from './Button.jsx';

/**
 * TeamDisplay Component - Displays a player's team with cards
 */
const TeamDisplay = React.memo(({ team, teamName, isCurrentPlayer, skipUsed, isRPSPhase, isExpanded, onPlaceCard, currentCard, gameState }) => {
  const filledCount = useMemo(() => team.filter(c => c !== null).length, [team]);
  const isCollapsed = !isExpanded && gameState === GAME_STATES.DRAWING;
  
  return (
    <div 
      className={`
        relative transition-all duration-500 ease-in-out
        ${isCurrentPlayer ? 'z-20' : 'z-10'}
        ${isCollapsed ? 'mb-[-180px] sm:mb-[-220px]' : 'mb-4'}
      `}
    >
      {/* Premium Deck Header */}
      <div 
        className={`
          card-premium rounded-t-2xl
          shadow-2xl p-4 sm:p-5 relative overflow-hidden
          ${isCurrentPlayer ? 'ring-4 ring-yellow-400/60 shadow-yellow-500/50 animate-pulse' : 'opacity-90'}
          transition-all duration-500
        `}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 via-amber-900/5 to-yellow-900/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_1px,transparent_1px)] bg-[length:25px_25px]" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gold-gradient uppercase tracking-wider">
              ⚓ {teamName}
            </h2>
            <div className="bg-gradient-to-br from-yellow-900/60 to-amber-900/60 px-3 py-1.5 rounded-full border-2 border-yellow-600/50 backdrop-blur-sm shadow-lg">
              <span className="text-xs sm:text-sm font-black text-yellow-200">{filledCount}/{MAX_TEAM_SIZE}</span>
            </div>
          </div>
          {!isRPSPhase && (
            <div className="flex items-center gap-2">
              {isCurrentPlayer && (
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-xl turn-indicator-pulse" />
                  <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 px-4 py-2 rounded-full border-2 border-yellow-300 shadow-lg turn-indicator-pulse">
                    <span className="text-[10px] sm:text-xs font-black text-gray-900 flex items-center gap-2">
                      <span className="animate-spin">⚡</span>
                      <span>YOUR TURN</span>
                      <span className="animate-bounce">⬇️</span>
                    </span>
                  </div>
                </div>
              )}
              <div className={`px-3 py-1.5 rounded-full border-2 text-[10px] sm:text-xs font-black backdrop-blur-sm shadow-lg ${
                skipUsed 
                  ? 'bg-gradient-to-r from-red-900/60 to-red-800/60 text-red-200 border-red-600/50' 
                  : 'bg-gradient-to-r from-green-900/60 to-green-800/60 text-green-200 border-green-600/50'
              }`}>
                Skip: {skipUsed ? '✗ Used' : '✓ Available'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Deck Content */}
      <div 
        className={`
          card-premium rounded-b-2xl border-t-0
          shadow-2xl overflow-visible relative
          transition-all duration-500 ease-in-out
          ${isCollapsed 
            ? 'max-h-0 opacity-0 pointer-events-none overflow-hidden' 
            : 'max-h-none opacity-100'
          }
        `}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[length:30px_30px]" />
        
        <div className="p-4 sm:p-5 relative z-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 bg-gray-950/30 rounded-xl backdrop-blur-sm border border-yellow-600/20">
            {TEAM_POSITIONS.map((position, index) => (
              <div key={index} className="relative" data-slot-index={index}>
                {team[index] ? (
                  <Card character={team[index].character} position={position} />
                ) : (
                  <EmptySlot position={position} />
                )}
                
                {isCurrentPlayer && gameState === GAME_STATES.DRAWING && !team[index] && currentCard && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPlaceCard(index);
                    }}
                    variant="primary"
                    size="sm"
                    className="mt-2 w-full"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="flex items-center justify-center gap-1">
                      <span>⚓</span>
                      <span>Place {position}</span>
                    </span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

TeamDisplay.displayName = 'TeamDisplay';
export default TeamDisplay;

