import React from 'react';
import { TEAM_POSITIONS } from '../utils/constants.js';
import Card from './Card.jsx';
import EmptySlot from './EmptySlot.jsx';

/**
 * TeamComparison Component - Shows both teams side-by-side for comparison
 */
const TeamComparison = ({ teamA, teamB, playerNameA, playerNameB }) => {
  return (
    <div className="w-full space-y-3 sm:space-y-4" style={{ maxWidth: '100%', overflow: 'visible' }}>
      <h3 className="text-base sm:text-lg md:text-xl font-black text-gold-gradient text-center mb-3 sm:mb-4 px-2">
        ⚔️ FINAL CREWS ⚔️
      </h3>
      
      {/* Comparison Grid - Mobile Optimized for iOS Chrome */}
      <div className="space-y-2.5 sm:space-y-3 w-full">
        {TEAM_POSITIONS.map((position, index) => {
          const cardA = teamA[index];
          const cardB = teamB[index];
          
          return (
            <div 
              key={index}
              className="card-premium rounded-xl p-2.5 sm:p-3 md:p-4 border-2 border-yellow-600/30 relative w-full"
              style={{ 
                overflow: 'visible',
                position: 'relative',
                minHeight: 'auto'
              }}
            >
              {/* Position Header */}
              <div className="text-center mb-2 sm:mb-3">
                <div className="inline-block px-2.5 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-blue-900/60 to-blue-800/60 border border-blue-600/50">
                  <span className="text-[10px] sm:text-xs md:text-sm font-black text-blue-200">{position}</span>
                </div>
              </div>
              
              {/* Side-by-side Cards - Fixed Layout */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 relative w-full" style={{ position: 'relative', minHeight: '140px' }}>
                {/* Player A Card */}
                <div className="relative w-full" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="text-center mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-300 bg-gradient-to-r from-blue-900/70 to-blue-800/70 px-1.5 sm:px-2 py-0.5 rounded border border-blue-600/50 inline-block">
                      {playerNameA || 'Player 1'}
                    </span>
                  </div>
                  <div className="w-full" style={{ position: 'relative', transform: 'scale(0.9)', transformOrigin: 'center' }}>
                    {cardA ? (
                      <Card character={cardA.character} position={cardA.position} />
                    ) : (
                      <EmptySlot position={position} />
                    )}
                  </div>
                </div>
                
                {/* VS Divider - Fixed Position */}
                <div 
                  className="absolute left-1/2 top-1/2 z-30 pointer-events-none"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                    zIndex: 30
                  }}
                >
                  <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1 border-2 border-yellow-400 shadow-lg shadow-yellow-500/50 whitespace-nowrap">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-gray-900">VS</span>
                  </div>
                </div>
                
                {/* Player B Card */}
                <div className="relative w-full" style={{ position: 'relative', zIndex: 1 }}>
                  <div className="text-center mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-red-300 bg-gradient-to-r from-red-900/70 to-red-800/70 px-1.5 sm:px-2 py-0.5 rounded border border-red-600/50 inline-block">
                      {playerNameB || 'Player 2'}
                    </span>
                  </div>
                  <div className="w-full" style={{ position: 'relative', transform: 'scale(0.9)', transformOrigin: 'center' }}>
                    {cardB ? (
                      <Card character={cardB.character} position={cardB.position} />
                    ) : (
                      <EmptySlot position={position} />
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

