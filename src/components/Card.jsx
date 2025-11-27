import React, { useState, useEffect, useCallback } from 'react';
import { fetchCharacterImage, getRarityClass } from '../utils/imageUtils.js';
import { FALLBACK_IMAGE_URL } from '../utils/constants.js';

/**
 * Card Component - Displays a character card
 */
const Card = React.memo(({ character, position }) => {
  const [imageUrl, setImageUrl] = useState(character.imgUrl || null);
  const [imageLoading, setImageLoading] = useState(!character.imgUrl);
  
  const handleImageError = useCallback((e) => {
    console.log(`Image failed to load for ${character.name}, using fallback`);
    // Try alternative URL patterns
    const altName = character.name.replace(/\s+/g, '_');
    const altUrl = `https://static.wikia.nocookie.net/onepiece/images/thumb/${altName}_Anime_Infobox.png/200px-${altName}_Anime_Infobox.png`;
    
    if (e.target.src !== altUrl && e.target.src !== FALLBACK_IMAGE_URL) {
      e.target.src = altUrl;
    } else {
      e.target.src = FALLBACK_IMAGE_URL;
      setImageLoading(false);
    }
  }, [character.name]);

  // Fetch image dynamically if not provided
  useEffect(() => {
    if (!character.imgUrl && imageLoading) {
      fetchCharacterImage(character.name)
        .then(url => {
          if (url) {
            setImageUrl(url);
            setImageLoading(false);
          } else {
            setImageUrl(FALLBACK_IMAGE_URL);
            setImageLoading(false);
          }
        })
        .catch(error => {
          console.error(`Failed to fetch image for ${character.name}:`, error);
          setImageUrl(FALLBACK_IMAGE_URL);
          setImageLoading(false);
        });
    } else if (character.imgUrl) {
      setImageUrl(character.imgUrl);
      setImageLoading(false);
    }
  }, [character.name, character.imgUrl, imageLoading]);

  const rarityClass = getRarityClass(character.rank);
  const displayImageUrl = imageUrl || FALLBACK_IMAGE_URL;

  return (
    <div 
      className={`card-premium ${rarityClass} rounded-xl overflow-hidden relative group cursor-pointer animate-cardDraw3D`}
      role="img"
      aria-label={`${character.name} - ${position} - ${character.rank}`}
    >
      {/* Card Image with Overlay */}
      <div className="relative overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-20 sm:h-24 md:h-28 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <img 
            src={displayImageUrl} 
            alt={`${character.name} character card`}
            className="w-full h-20 sm:h-24 md:h-28 object-cover transition-transform duration-500 group-hover:scale-110" 
            onError={handleImageError}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Rarity Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-transparent via-transparent to-yellow-400/20" />
      </div>
      
      {/* Card Info */}
      <div className="p-2 sm:p-2.5 text-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative">
        {/* Name with Gold Gradient */}
        <div className="text-xs sm:text-sm font-black text-gold-gradient truncate mb-1">
          {character.name}
        </div>
        
        {/* Position Badge */}
        <div className="inline-block px-2 py-0.5 mb-1 rounded-md bg-gradient-to-r from-blue-900/80 to-blue-800/80 border border-blue-600/50">
          <span className="text-[9px] sm:text-[10px] font-bold text-blue-200">{position}</span>
        </div>
        
        {/* Rank Badge */}
        <div className="text-[8px] sm:text-[9px] font-semibold text-gray-400 mt-0.5">
          {character.rank}
        </div>
      </div>
      
      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
      </div>
    </div>
  );
});

Card.displayName = 'Card';
export default Card;

