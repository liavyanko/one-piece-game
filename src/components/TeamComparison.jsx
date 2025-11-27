import React, { useEffect, useState } from 'react';
import { TEAM_POSITIONS } from '../utils/constants.js';
import Card from './Card.jsx';
import EmptySlot from './EmptySlot.jsx';

/**
 * TeamComparison Component - Mobile-optimized aesthetic comparison view
 */
const TeamComparison = ({ teamA, teamB, playerNameA, playerNameB }) => {
  const [visibleCards, setVisibleCards] = useState(0);

  // Staggered reveal animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleCards(TEAM_POSITIONS.length);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full" style={{ maxWidth: '100%', overflow: 'visible' }}>
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 animate-fadeIn">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gold-gradient mb-2 animate-pulse">
          ⚔️ FINAL CREWS ⚔️
        </h3>
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-900/70 to-blue-800/70 border border-blue-600/50">
            <span className="font-bold text-blue-200">{playerNameA || 'Player 1'}</span>
          </div>
          <span className="text-yellow-400 font-black">VS</span>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-red-900/70 to-red-800/70 border border-red-600/50">
            <span className="font-bold text-red-200">{playerNameB || 'Player 2'}</span>
          </div>
        </div>
      </div>
      
      {/* Mobile-Optimized Comparison - Vertical Stack */}
      <div className="space-y-3 sm:space-y-4 w-full">
        {TEAM_POSITIONS.map((position, index) => {
          const cardA = teamA[index];
          const cardB = teamB[index];
          const isVisible = visibleCards > index;
          
          return (
            <div 
              key={index}
              className={`card-premium rounded-xl p-3 sm:p-4 border-2 border-yellow-600/30 relative w-full transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ 
                overflow: 'visible',
                position: 'relative',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Position Header - Enhanced */}
              <div className="text-center mb-3">
                <div className="inline-block px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-900/70 via-purple-900/70 to-blue-800/70 border-2 border-blue-600/50 shadow-lg">
                  <span className="text-xs sm:text-sm font-black text-blue-100">{position}</span>
                </div>
              </div>
              
              {/* Cards Layout - Mobile First */}
              <div className="relative w-full">
                {/* Player A Card - Top */}
                <div className="mb-2 sm:mb-3">
                  <div className="text-center mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-blue-300 bg-gradient-to-r from-blue-900/80 to-blue-800/80 px-2.5 py-1 rounded-full border border-blue-600/50 inline-block shadow-md">
                      {playerNameA || 'Player 1'}
                    </span>
                  </div>
                  <div className="w-full max-w-[200px] mx-auto">
                    {cardA ? (
                      <div className="transform transition-all duration-300 hover:scale-105">
                        <Card character={cardA.character} position={cardA.position} />
                      </div>
                    ) : (
                      <div className="transform scale-90">
                        <EmptySlot position={position} />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* VS Divider - Animated */}
                <div className="flex items-center justify-center my-2 sm:my-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                  <div className="mx-3 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-full px-3 sm:px-4 py-1.5 border-2 border-yellow-400 shadow-lg shadow-yellow-500/50 animate-pulse">
                    <span className="text-xs sm:text-sm font-black text-gray-900">VS</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                </div>
                
                {/* Player B Card - Bottom */}
                <div className="mt-2 sm:mt-3">
                  <div className="text-center mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-red-300 bg-gradient-to-r from-red-900/80 to-red-800/80 px-2.5 py-1 rounded-full border border-red-600/50 inline-block shadow-md">
                      {playerNameB || 'Player 2'}
                    </span>
                  </div>
                  <div className="w-full max-w-[200px] mx-auto">
                    {cardB ? (
                      <div className="transform transition-all duration-300 hover:scale-105">
                        <Card character={cardB.character} position={cardB.position} />
                      </div>
                    ) : (
                      <div className="transform scale-90">
                        <EmptySlot position={position} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamComparison;
