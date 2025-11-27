import React from 'react';

/**
 * EmptySlot Component - Displays an empty team position
 */
const EmptySlot = React.memo(({ position }) => (
  <div 
    className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-800/50 border-2 border-dashed border-yellow-600/40 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center h-[120px] sm:h-[140px] md:h-[160px] text-center relative overflow-hidden group"
    aria-label={`Empty slot for ${position}`}
  >
    {/* Animated Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
    </div>
    
    {/* Position Icon/Text */}
    <div className="relative z-10">
      <div className="text-xs sm:text-sm font-black text-gold-gradient mb-1">
        {position}
      </div>
      <div className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
        ⚓ Awaiting Card
      </div>
    </div>
    
    {/* Subtle Pulse Animation */}
    <div className="absolute inset-0 border-2 border-yellow-600/20 rounded-xl animate-pulse" />
  </div>
));

EmptySlot.displayName = 'EmptySlot';
export default EmptySlot;

