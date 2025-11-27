import React from 'react';
import { TEAM_POSITIONS } from '../utils/constants.js';
import Card from './Card.jsx';
import EmptySlot from './EmptySlot.jsx';

/**
 * TeamComparison Component - Shows both teams side-by-side for comparison
 */
const TeamComparison = ({ teamA, teamB, playerNameA, playerNameB }) => {
  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg sm:text-xl font-black text-gold-gradient text-center mb-4">
        ⚔️ FINAL CREWS ⚔️
      </h3>
      
      {/* Comparison Grid - Mobile Friendly */}
      <div className="space-y-3">
        {TEAM_POSITIONS.map((position, index) => {
          const cardA = teamA[index];
          const cardB = teamB[index];
          
          return (
            <div 
              key={index}
              className="card-premium rounded-xl p-3 sm:p-4 border-2 border-yellow-600/30 relative overflow-hidden"
            >
              {/* Position Header */}
              <div className="text-center mb-3">
                <div className="inline-block px-3 py-1 rounded-lg bg-gradient-to-r from-blue-900/60 to-blue-800/60 border border-blue-600/50">
                  <span className="text-xs sm:text-sm font-black text-blue-200">{position}</span>
                </div>
              </div>
              
              {/* Side-by-side Cards */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 relative">
                {/* Player A Card */}
                <div className="relative z-0">
                  <div className="text-center mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-blue-300 bg-gradient-to-r from-blue-900/70 to-blue-800/70 px-2 py-0.5 rounded border border-blue-600/50">
                      {playerNameA || 'Player 1'}
                    </span>
                  </div>
                  {cardA ? (
                    <div className="transform scale-[0.85] sm:scale-95 origin-center">
                      <Card character={cardA.character} position={cardA.position} />
                    </div>
                  ) : (
                    <div className="transform scale-90">
                      <EmptySlot position={position} />
                    </div>
                  )}
                </div>
                
                {/* VS Divider - Centered between cards */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-full px-2 sm:px-2.5 py-1 border-2 border-yellow-400 shadow-lg shadow-yellow-500/50">
                    <span className="text-[9px] sm:text-[10px] font-black text-gray-900">VS</span>
                  </div>
                </div>
                
                {/* Player B Card */}
                <div className="relative z-0">
                  <div className="text-center mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-red-300 bg-gradient-to-r from-red-900/70 to-red-800/70 px-2 py-0.5 rounded border border-red-600/50">
                      {playerNameB || 'Player 2'}
                    </span>
                  </div>
                  {cardB ? (
                    <div className="transform scale-[0.85] sm:scale-95 origin-center">
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
          );
        })}
      </div>
    </div>
  );
};

export default TeamComparison;

