import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const GAME_STATES = {
  INIT: 'INIT',
  RPS: 'RPS',
  DRAWING: 'DRAWING',
  END: 'END'
};

const PLAYERS = {
  A: 'PlayerA',
  B: 'PlayerB'
};

const RPS_CHOICES = {
  ROCK: 'Rock',
  PAPER: 'Paper',
  SCISSORS: 'Scissors'
};

const TEAM_POSITIONS = [
  'Captain', 
  'Vice Captain', 
  'Tank', 
  'Swordsman', 
  'Healer', 
  'Sniper', 
  'Support 1', 
  'Support 2'
];

const MAX_TEAM_SIZE = TEAM_POSITIONS.length;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // Base delay in ms for exponential backoff
const TRANSITION_DELAY = 2000; // Delay before transitioning game states
const CARD_DRAW_DELAY = 1000; // Delay before drawing next card

// API Configuration
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyC_O666i7f2bp1gx7K6md5_GV-lT6PiZQU';

// Gemini API will be used for image fetching

// Character data - Images will be fetched dynamically via Google Image Search
// Organized by power tier based on One Piece universe
const CHARACTER_CARDS_MOCK = [
  // S-Tier (Yonko/Admirals/Legendary level)
  { name: 'Monkey D. Luffy', rank: 'Yonko (S-Tier)' },
  { name: 'Shanks', rank: 'Yonko (S-Tier)' },
  { name: 'Mihawk', rank: 'WSS (S-Tier)' },
  { name: 'Whitebeard', rank: 'Former Yonko (S-Tier)' },
  { name: 'Kaido', rank: 'Former Yonko (S-Tier)' },
  { name: 'Big Mom', rank: 'Former Yonko (S-Tier)' },
  { name: 'Blackbeard', rank: 'Yonko (S-Tier)' },
  { name: 'Akainu', rank: 'Fleet Admiral (S-Tier)' },
  { name: 'Aokiji', rank: 'Admiral (S-Tier)' },
  { name: 'Kizaru', rank: 'Admiral (S-Tier)' },
  { name: 'Fujitora', rank: 'Admiral (S-Tier)' },
  { name: 'Greenbull', rank: 'Admiral (S-Tier)' },
  { name: 'Sengoku', rank: 'Former Fleet Admiral (S-Tier)' },
  { name: 'Garp', rank: 'Hero of Marines (S-Tier)' },
  { name: 'Dragon', rank: 'Revolutionary Leader (S-Tier)' },
  
  // A-Tier (Commanders/Supernovas/Warlords)
  { name: 'Roronoa Zoro', rank: 'Commander (A-Tier)' },
  { name: 'Vinsmoke Sanji', rank: 'Commander (A-Tier)' },
  { name: 'Sabo', rank: 'Revolutionary Chief (A-Tier)' },
  { name: 'Ace', rank: 'Commander (A-Tier)' },
  { name: 'Yamato', rank: 'Kaido\'s Son (A-Tier)' },
  { name: 'Law', rank: 'Supernova (A-Tier)' },
  { name: 'Kid', rank: 'Supernova (A-Tier)' },
  { name: 'Boa Hancock', rank: 'Warlord (A-Tier)' },
  { name: 'Ben Beckman', rank: 'First Mate (A-Tier)' },
  { name: 'Lucky Roo', rank: 'Red Hair Commander (A-Tier)' },
  { name: 'Yasopp', rank: 'Red Hair Sniper (A-Tier)' },
  { name: 'Marco', rank: 'First Division Commander (A-Tier)' },
  { name: 'Jozu', rank: 'Third Division Commander (A-Tier)' },
  { name: 'Vista', rank: 'Fifth Division Commander (A-Tier)' },
  { name: 'King', rank: 'All-Star (A-Tier)' },
  { name: 'Queen', rank: 'All-Star (A-Tier)' },
  { name: 'Jack', rank: 'All-Star (A-Tier)' },
  { name: 'Katakuri', rank: 'Sweet Commander (A-Tier)' },
  { name: 'Smoothie', rank: 'Sweet Commander (A-Tier)' },
  { name: 'Cracker', rank: 'Sweet Commander (A-Tier)' },
  { name: 'Crocodile', rank: 'Warlord (A-Tier)' },
  { name: 'Doflamingo', rank: 'Warlord (A-Tier)' },
  { name: 'Kuma', rank: 'Warlord (A-Tier)' },
  { name: 'Moria', rank: 'Warlord (A-Tier)' },
  { name: 'Jinbe', rank: 'Warlord (A-Tier)' },
  { name: 'Rob Lucci', rank: 'CP9 Agent (A-Tier)' },
  { name: 'Kaku', rank: 'CP9 Agent (A-Tier)' },
  { name: 'Jabra', rank: 'CP9 Agent (A-Tier)' },
  { name: 'Magellan', rank: 'Prison Warden (A-Tier)' },
  { name: 'Shiryu', rank: 'Blackbeard Commander (A-Tier)' },
  { name: 'Ivankov', rank: 'Revolutionary Commander (A-Tier)' },
  { name: 'Vergo', rank: 'Donquixote Executive (A-Tier)' },
  
  // B-Tier (Crew Members/Mid-level fighters)
  { name: 'Smoker', rank: 'Vice Admiral (B-Tier)' },
  { name: 'Tashigi', rank: 'Captain (B-Tier)' },
  { name: 'Coby', rank: 'Captain (B-Tier)' },
  { name: 'Buggy', rank: 'Warlord (B-Tier)' },
  { name: 'Nami', rank: 'Navigator (B-Tier)' },
  { name: 'Usopp', rank: 'Sniper (B-Tier)' },
  { name: 'Chopper', rank: 'Doctor (B-Tier)' },
  { name: 'Robin', rank: 'Scholar (B-Tier)' },
  { name: 'Franky', rank: 'Shipwright (B-Tier)' },
  { name: 'Brook', rank: 'Musician (B-Tier)' },
  { name: 'Inazuma', rank: 'Revolutionary (B-Tier)' },
  { name: 'Koala', rank: 'Revolutionary (B-Tier)' },
  { name: 'Spandam', rank: 'CP9 Director (B-Tier)' },
  { name: 'Stussy', rank: 'CP0 Agent (B-Tier)' },
  { name: 'Caesar Clown', rank: 'Scientist (B-Tier)' },
  { name: 'Perona', rank: 'Thriller Bark Officer (B-Tier)' },
  { name: 'Hody Jones', rank: 'Fishman Captain (B-Tier)' },
  { name: 'Pekoms', rank: 'Big Mom Officer (B-Tier)' },
  { name: 'Tamago', rank: 'Big Mom Officer (B-Tier)' },
  { name: 'Pell', rank: 'Alabasta Guard (B-Tier)' },
  { name: 'Mr 3', rank: 'Baroque Works (B-Tier)' },
  { name: 'Mr 2 Bon Clay', rank: 'Baroque Works (B-Tier)' },
  { name: 'Hachi', rank: 'Fishman (B-Tier)' },
  { name: 'Kuroobi', rank: 'Fishman (B-Tier)' },
  { name: 'Wapol', rank: 'Former King (B-Tier)' },
  { name: 'Alvida', rank: 'Pirate Captain (B-Tier)' },
  { name: 'Bellamy', rank: 'Pirate Captain (B-Tier)' },
  { name: 'Foxy', rank: 'Pirate Captain (B-Tier)' },
  { name: 'Kaya', rank: 'Civilian (B-Tier)' },
  { name: 'Helmeppo', rank: 'Marine Captain (B-Tier)' },
  { name: 'Coby Junior', rank: 'Marine (B-Tier)' },
  { name: 'Johnny', rank: 'Bounty Hunter (B-Tier)' },
  { name: 'Yosaku', rank: 'Bounty Hunter (B-Tier)' },
];

const FALLBACK_IMAGE_URL = 'https://placehold.co/100x96/1e293b/ffffff?text=OP+Character';

// Modern One Piece Theme Styling Constants
const getRarityClass = (rank) => {
  if (rank.includes('S-Tier') || rank.includes('Yonko') || rank.includes('Admiral')) {
    return 'card-rarity-legendary';
  } else if (rank.includes('A-Tier') || rank.includes('Commander') || rank.includes('Supernova')) {
    return 'card-rarity-epic';
  } else {
    return 'card-rarity-rare';
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Determines RPS winner
 * @param {string} choiceA - Player A's choice
 * @param {string} choiceB - Player B's choice
 * @returns {string|null} - Winner ('PlayerA', 'PlayerB', or null for tie)
 */
const determineRPSWinner = (choiceA, choiceB) => {
  if (choiceA === choiceB) return null; // Tie
  
  const winConditions = {
    [RPS_CHOICES.ROCK]: RPS_CHOICES.SCISSORS,
    [RPS_CHOICES.SCISSORS]: RPS_CHOICES.PAPER,
    [RPS_CHOICES.PAPER]: RPS_CHOICES.ROCK
  };
  
  return winConditions[choiceA] === choiceB ? PLAYERS.A : PLAYERS.B;
};

/**
 * Formats team data for AI analysis
 * @param {Array} team - Team array with character placements
 * @returns {string} - Formatted team string
 */
const formatTeamForAI = (team) => {
  return team
    .filter(item => item !== null)
    .map(item => `* ${item.position}: ${item.character.name} (Rank: ${item.character.rank})`)
    .join('\n');
};

/**
 * Checks if all team slots are filled
 * @param {Array} team - Team array to check
 * @returns {boolean} - True if all slots filled
 */
const isTeamComplete = (team) => {
  return team.every(slot => slot !== null);
};

/**
 * Delays execution by specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Character name to URL format mapping for known characters
 * This ensures reliable image URLs for common characters
 */
const CHARACTER_URL_MAP = {
  'Monkey D. Luffy': 'Monkey_D._Luffy',
  'Shanks': 'Shanks',
  'Mihawk': 'Dracule_Mihawk',
  'Whitebeard': 'Edward_Newgate',
  'Kaido': 'Kaido',
  'Big Mom': 'Charlotte_Linlin',
  'Blackbeard': 'Marshall_D._Teach',
  'Akainu': 'Sakazuki',
  'Aokiji': 'Kuzan',
  'Kizaru': 'Borsalino',
  'Fujitora': 'Issho',
  'Greenbull': 'Aramaki',
  'Sengoku': 'Sengoku',
  'Garp': 'Monkey_D._Garp',
  'Dragon': 'Monkey_D._Dragon',
  'Roronoa Zoro': 'Roronoa_Zoro',
  'Vinsmoke Sanji': 'Sanji',
  'Sabo': 'Sabo',
  'Ace': 'Portgas_D._Ace',
  'Yamato': 'Yamato',
  'Law': 'Trafalgar_D._Water_Law',
  'Kid': 'Eustass_Kid',
  'Boa Hancock': 'Boa_Hancock',
  'Ben Beckman': 'Benn_Beckman',
  'Lucky Roo': 'Lucky_Roux',
  'Yasopp': 'Yasopp',
  'Marco': 'Marco',
  'Jozu': 'Jozu',
  'Vista': 'Vista',
  'King': 'King',
  'Queen': 'Queen',
  'Jack': 'Jack',
  'Katakuri': 'Charlotte_Katakuri',
  'Smoothie': 'Charlotte_Smoothie',
  'Cracker': 'Charlotte_Cracker',
  'Crocodile': 'Crocodile',
  'Doflamingo': 'Donquixote_Doflamingo',
  'Kuma': 'Bartholomew_Kuma',
  'Moria': 'Gecko_Moria',
  'Jinbe': 'Jinbe',
  'Rob Lucci': 'Rob_Lucci',
  'Kaku': 'Kaku',
  'Jabra': 'Jabra',
  'Magellan': 'Magellan',
  'Shiryu': 'Shiryu',
  'Ivankov': 'Emporio_Ivankov',
  'Vergo': 'Vergo',
  'Smoker': 'Smoker',
  'Tashigi': 'Tashigi',
  'Coby': 'Coby',
  'Buggy': 'Buggy',
  'Nami': 'Nami',
  'Usopp': 'Usopp',
  'Chopper': 'Tony_Tony_Chopper',
  'Robin': 'Nico_Robin',
  'Franky': 'Franky',
  'Brook': 'Brook',
};

/**
 * Fetches an image URL for a character using Gemini API with reliable fallbacks
 * @param {string} characterName - Name of the character to search for
 * @returns {Promise<string>} - Image URL or fallback URL
 */
const fetchCharacterImage = async (characterName) => {
  // Image cache to avoid repeated API calls
  const cacheKey = `img_${characterName}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached && cached !== FALLBACK_IMAGE_URL) {
    return cached;
  }

  // First, try using the known URL mapping
  if (CHARACTER_URL_MAP[characterName]) {
    const wikiName = CHARACTER_URL_MAP[characterName];
    const wikiUrl = `https://static.wikia.nocookie.net/onepiece/images/6/6f/${wikiName}_Anime_Infobox.png`;
    
    // Test if image loads (simple validation)
    try {
      const testResponse = await fetch(wikiUrl, { method: 'HEAD', mode: 'no-cors' });
      sessionStorage.setItem(cacheKey, wikiUrl);
      return wikiUrl;
    } catch (e) {
      // Try alternative path
      const altUrl = `https://static.wikia.nocookie.net/onepiece/images/thumb/${wikiName}_Anime_Infobox.png/200px-${wikiName}_Anime_Infobox.png`;
      sessionStorage.setItem(cacheKey, altUrl);
      return altUrl;
    }
  }

  // If API key is not configured, use fallback
  if (!API_KEY) {
    const fallbackName = characterName.replace(/\s+/g, '_').replace(/['"]/g, '');
    const fallbackUrl = `https://static.wikia.nocookie.net/onepiece/images/thumb/${fallbackName}_Anime_Infobox.png/200px-${fallbackName}_Anime_Infobox.png`;
    return fallbackUrl;
  }

  try {
    // Use Gemini to get the formatted character name for URL
    const prompt = `For the One Piece character "${characterName}", provide ONLY the exact character name as it appears in One Piece Wiki URLs. 

Examples:
- "Monkey D. Luffy" → "Monkey_D._Luffy"
- "Roronoa Zoro" → "Roronoa_Zoro"
- "Big Mom" → "Charlotte_Linlin"
- "Blackbeard" → "Marshall_D._Teach"

Respond with ONLY the formatted name (no URL, no explanation, just the name with underscores).`;

    const geminiUrl = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 10,
          topP: 0.5,
          maxOutputTokens: 50,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      let formattedName = data.candidates[0].content.parts[0].text.trim();
      
      // Clean up the response
      formattedName = formattedName.replace(/^```[\w]*\n?/g, '').replace(/\n?```$/g, '').trim();
      formattedName = formattedName.replace(/['"]/g, '').replace(/\s+/g, '_');
      
      // Construct the wiki URL
      const wikiUrl = `https://static.wikia.nocookie.net/onepiece/images/6/6f/${formattedName}_Anime_Infobox.png`;
      sessionStorage.setItem(cacheKey, wikiUrl);
      return wikiUrl;
    }
    
    // Fallback: construct URL from character name
    const fallbackName = characterName.replace(/\s+/g, '_').replace(/['"]/g, '');
    const fallbackUrl = `https://static.wikia.nocookie.net/onepiece/images/thumb/${fallbackName}_Anime_Infobox.png/200px-${fallbackName}_Anime_Infobox.png`;
    sessionStorage.setItem(cacheKey, fallbackUrl);
    return fallbackUrl;
    
  } catch (error) {
    console.error(`Error fetching image for ${characterName} via Gemini:`, error);
    // Final fallback: construct basic URL
    const fallbackName = characterName.replace(/\s+/g, '_').replace(/['"]/g, '');
    const fallbackUrl = `https://static.wikia.nocookie.net/onepiece/images/thumb/${fallbackName}_Anime_Infobox.png/200px-${fallbackName}_Anime_Infobox.png`;
    return fallbackUrl;
  }
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const PlayerBadge = React.memo(({ userId, isCurrent }) => (
  <div 
    className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-white transition-all duration-300 ${
      isCurrent 
        ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-600 ring-2 ring-yellow-400 shadow-lg shadow-red-900/50 animate-pulse' 
        : 'bg-gradient-to-r from-gray-700 to-gray-800 opacity-70'
    }`}
    aria-label={isCurrent ? `${userId} - Your turn` : userId}
  >
    <span className="text-gold-gradient">{userId.substring(0, 6)}</span> {isCurrent && '⚡ YOUR TURN'}
  </div>
));
PlayerBadge.displayName = 'PlayerBadge';

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
      className={`card-premium ${rarityClass} rounded-xl overflow-hidden relative group cursor-pointer`}
      role="img"
      aria-label={`${character.name} - ${position} - ${character.rank}`}
      style={{ animation: 'cardDraw 0.6s ease-out' }}
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

const RPSButton = React.memo(({ choice, player, isTurn, onClick, isSelected }) => {
  const getChoiceEmoji = (choice) => {
    switch(choice) {
      case 'Rock': return '🪨';
      case 'Paper': return '📄';
      case 'Scissors': return '✂️';
      default: return '';
    }
  };

  return (
    <button
      onClick={() => onClick(player, choice)}
      disabled={isSelected || !isTurn}
      className={`px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-black transition-all duration-300 text-sm sm:text-base transform relative overflow-hidden ${
        isSelected
          ? 'button-premium text-gray-900 ring-4 ring-yellow-300 scale-110 shadow-2xl' 
          : isTurn
            ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-red-500/50'
            : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed opacity-50'
      }`}
      aria-label={`${player} choose ${choice}`}
      aria-pressed={isSelected}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="text-lg">{getChoiceEmoji(choice)}</span>
        <span>{choice}</span>
      </span>
    </button>
  );
});
RPSButton.displayName = 'RPSButton';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [gameState, setGameState] = useState(GAME_STATES.INIT);
  const [playerTurn, setPlayerTurn] = useState(PLAYERS.A);
  const [deck, setDeck] = useState([]);
  const [teamA, setTeamA] = useState(Array(MAX_TEAM_SIZE).fill(null));
  const [teamB, setTeamB] = useState(Array(MAX_TEAM_SIZE).fill(null));
  const [skipUsedA, setSkipUsedA] = useState(false);
  const [skipUsedB, setSkipUsedB] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [rpsChoice, setRpsChoice] = useState({ PlayerA: null, PlayerB: null });
  const [rpsResult, setRpsResult] = useState('');
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Welcome to the One Piece Card Draft! Build your ultimate pirate crew by drafting characters. Each player fills 8 positions (Captain, Vice Captain, Tank, Swordsman, Healer, Sniper, Support 1, Support 2). Take turns drawing cards and placing them strategically. You can skip once per game to get another card. When both crews are complete, AI judges the winner based on team strength, role suitability, and synergy. Ready to set sail?');
  const [error, setError] = useState(null);

  // Refs for cleanup
  const timeoutRefs = useRef([]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const allSlotsFilled = useMemo(() => 
    isTeamComplete(teamA) && isTeamComplete(teamB),
    [teamA, teamB]
  );

  const deckEmpty = useMemo(() => deck.length === 0, [deck.length]);

  // ============================================================================
  // CLEANUP EFFECT
  // ============================================================================

  useEffect(() => {
    return () => {
      // Cleanup all timeouts on unmount
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // ============================================================================
  // DECK INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const shuffledDeck = shuffleArray(CHARACTER_CARDS_MOCK);
    setDeck(shuffledDeck);
  }, []);

  // ============================================================================
  // GAME LOGIC FUNCTIONS
  // ============================================================================

  /**
   * Draws a card from the deck for the current player
   */
  const drawCard = useCallback((player) => {
    if (deckEmpty) {
      setMessage('Deck is empty! Game will end when all positions are filled.');
      return;
    }

    if (deck.length === 0) {
      setMessage('Deck is empty! Awaiting final game results.');
      return;
    }

    const [cardToDraw, ...restOfDeck] = deck;
    setDeck(restOfDeck);
    setCurrentCard(cardToDraw);
    setMessage(`${player}'s turn. Drawn card: ${cardToDraw.name}. Choose a position or Skip.`);
  }, [deck, deckEmpty]);

  /**
   * Handles Rock-Paper-Scissors choice
   */
  const handleRPS = useCallback((player, choice) => {
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
          const resultText = `${winner} wins the draw! They will start first.`;
          setRpsResult(resultText);
          
          // Transition to drawing phase
          const timeoutId = setTimeout(() => {
            setGameState(GAME_STATES.DRAWING);
            setPlayerTurn(winner);
            setMessage(`Game begins! It is ${winner}'s turn.`);
            drawCard(winner);
          }, TRANSITION_DELAY);
          
          timeoutRefs.current.push(timeoutId);
          return updated;
        }
      } else if (player === PLAYERS.A) {
        setMessage(`Player A has chosen. Awaiting Player B's choice...`);
      }
      
      return updated;
    });
  }, [drawCard]);

  /**
   * Handles card placement or skip action
   */
  const handlePlacementOrSkip = useCallback((action) => {
    const isPlayerA = playerTurn === PLAYERS.A;
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
      setMessage(`${playerTurn} skipped the card. Drawing another card...`);
      
      // Keep the same player's turn and draw another card
      if (!allSlotsFilled && !deckEmpty) {
        const timeoutId = setTimeout(() => drawCard(playerTurn), CARD_DRAW_DELAY);
        timeoutRefs.current.push(timeoutId);
      } else if (deckEmpty) {
        // If deck is empty, then pass turn to opponent
        const nextPlayer = isPlayerA ? PLAYERS.B : PLAYERS.A;
        setPlayerTurn(nextPlayer);
        setMessage('Deck is empty. Passing turn to opponent.');
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

    // Check for game end
    const isTeamASlotsFull = isPlayerA ? isTeamComplete(newTeam) : isTeamComplete(teamA);
    const isTeamBSlotsFull = isPlayerA ? isTeamComplete(teamB) : isTeamComplete(newTeam);

    if (isTeamASlotsFull && isTeamBSlotsFull) {
      setGameState(GAME_STATES.END);
      setMessage('All positions filled! Game ended. Initiating AI Judgement...');
      const timeoutId = setTimeout(() => determineWinner(), TRANSITION_DELAY);
      timeoutRefs.current.push(timeoutId);
    } else {
      const nextPlayer = isPlayerA ? PLAYERS.B : PLAYERS.A;
      setPlayerTurn(nextPlayer);
      
      if (!allSlotsFilled && !deckEmpty) {
        const timeoutId = setTimeout(() => drawCard(nextPlayer), CARD_DRAW_DELAY);
        timeoutRefs.current.push(timeoutId);
      } else if (deckEmpty) {
        setMessage('Deck is empty. Game will end when all positions are filled.');
      }
    }
  }, [playerTurn, teamA, teamB, skipUsedA, skipUsedB, currentCard, allSlotsFilled, deckEmpty, drawCard]);

  /**
   * Determines winner using AI (Gemini API)
   */
  const determineWinner = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const teamAString = formatTeamForAI(teamA);
      const teamBString = formatTeamForAI(teamB);

      const userQuery = `Perform a deep, strategic analysis of the following two pirate crews and determine which one wins in an all-out, team-vs-team battle.

Analysis Criteria:

Character Strength: Overall combat power based on their rank (Yonko, Commander, etc.).

Role Suitability: How well each character fits their assigned role (Captain, Tank, Healer, etc.).

Team Synergy: The balance and effectiveness of the crew as a whole (e.g., does the Tank protect the Healer?).

Crew Data:

Crew A (Player A):

${teamAString}

Crew B (Player B):

${teamBString}

REQUIRED RESPONSE FORMAT: Return ONLY the JSON object defined in the System Instruction.`;

      const systemPrompt = `You are a highly experienced expert with encyclopedic knowledge of the 'One Piece' universe. Your role is to judge a battle between two pirate crews based on their composition. Your analysis MUST be objective, detailed, and focus on team synergy and role fulfillment. Your final output MUST be a JSON object only. The structure must be: { "winner": "PlayerA" | "PlayerB", "reasoning": "Your detailed, 2-3 sentence justification explaining the winner based on crew composition." }`;

      const apiUrl = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              winner: { 
                type: "STRING", 
                description: "The winning player (PlayerA or PlayerB)" 
              },
              reasoning: { 
                type: "STRING", 
                description: "Detailed justification for the decision based on strength and role suitability" 
              }
            },
            required: ["winner", "reasoning"]
          }
        }
      };

      let result = null;
      let lastError = null;

      // Retry logic with exponential backoff
      for (let retry = 0; retry < MAX_RETRIES; retry++) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (jsonText) {
            result = JSON.parse(jsonText);
            
            // Validate result structure - must be binary (PlayerA or PlayerB only)
            if (result.winner && (result.winner === PLAYERS.A || result.winner === PLAYERS.B)) {
              // Ensure winner is exactly PlayerA or PlayerB (binary result)
              result.winner = result.winner === PLAYERS.A ? PLAYERS.A : PLAYERS.B;
              break; // Success
            } else {
              throw new Error('Invalid response structure from API - winner must be PlayerA or PlayerB');
            }
          } else {
            throw new Error('API response missing content');
          }
        } catch (error) {
          lastError = error;
          console.error(`AI Judgment attempt ${retry + 1} failed:`, error);
          
          if (retry < MAX_RETRIES - 1) {
            // Exponential backoff
            await delay(RETRY_DELAY_BASE * Math.pow(2, retry));
          }
        }
      }

      setLoading(false);

      if (result && result.winner) {
        setWinner(result);
        setMessage(`Judgment complete! The winner is ${result.winner}.`);
        setError(null);
      } else {
        const errorMessage = lastError?.message || 'Unknown error occurred';
        setError(`AI Judgment failed: ${errorMessage}`);
        setWinner({ 
          winner: 'NONE', 
          reasoning: 'The AI could not determine a clear winner. Please try starting a new game.' 
        });
        setMessage('AI could not determine a clear winner.');
      }
    } catch (error) {
      setLoading(false);
      setError(`Unexpected error: ${error.message}`);
      setWinner({ 
        winner: 'NONE', 
        reasoning: 'An unexpected error occurred during AI judgment.' 
      });
    }
  }, [teamA, teamB]);

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];

    // Reset all state
    setGameState(GAME_STATES.INIT);
    setPlayerTurn(PLAYERS.A);
    setDeck(shuffleArray(CHARACTER_CARDS_MOCK));
    setTeamA(Array(MAX_TEAM_SIZE).fill(null));
    setTeamB(Array(MAX_TEAM_SIZE).fill(null));
    setSkipUsedA(false);
    setSkipUsedB(false);
    setCurrentCard(null);
    setRpsChoice({ PlayerA: null, PlayerB: null });
    setRpsResult('');
    setWinner(null);
    setLoading(false);
    setMessage('Welcome to the One Piece Card Draft! Build your ultimate pirate crew by drafting characters. Each player fills 8 positions (Captain, Vice Captain, Tank, Swordsman, Healer, Sniper, Support 1, Support 2). Take turns drawing cards and placing them strategically. You can skip once per game to get another card. When both crews are complete, AI judges the winner based on team strength, role suitability, and synergy. Ready to set sail?');
    setError(null);
  }, []);

  // ============================================================================
  // UI COMPONENTS
  // ============================================================================

  const TeamDisplay = React.memo(({ team, teamName, isCurrentPlayer, skipUsed, isRPSPhase, isExpanded, onPlaceCard }) => {
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
                  <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-600 px-3 py-1.5 rounded-full border-2 border-red-500/60 shadow-lg animate-pulse">
                    <span className="text-[10px] sm:text-xs font-black text-white">⚡ YOUR TURN</span>
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
                <div key={index} className="relative">
                  {team[index] ? (
                    <Card character={team[index].character} position={position} />
                  ) : (
                    <EmptySlot position={position} />
                  )}
                  
                  {isCurrentPlayer && gameState === GAME_STATES.DRAWING && !team[index] && currentCard && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onPlaceCard(index);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="mt-2 w-full button-premium text-gray-900 text-[10px] sm:text-xs font-black py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                      aria-label={`Place card as ${position}`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1">
                        <span>⚓</span>
                        <span>Place {position}</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-500" />
                    </button>
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

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen ocean-background p-2 sm:p-3 font-sans overflow-x-hidden relative" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ touchAction: 'none' }}>
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl animate-float" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-red-400/5 rounded-full blur-2xl animate-float" style={{ animationDuration: '7s', animationDelay: '2s' }} />
      </div>

      <div className="max-w-md mx-auto w-full relative z-10 min-h-screen flex flex-col" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Error Display - Modern Alert (only show when not in INIT state) */}
        {error && gameState !== GAME_STATES.INIT && (
          <div className="bg-gradient-to-r from-red-900/90 via-red-800/90 to-red-900/90 p-3 rounded-xl text-center font-bold text-xs text-red-100 border-2 border-red-500/50 shadow-xl mb-3 backdrop-blur-sm">
            <span className="inline-block mr-2">⚠️</span>
            {error}
          </div>
        )}

        {/* Phase 1: Initialization - Centered Opening Screen */}
        {gameState === GAME_STATES.INIT && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            {/* Premium Header with One Piece Theme */}
            <div className="mb-6 sm:mb-8">
              <div className="relative inline-block mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gold-gradient mb-2 uppercase tracking-wider relative z-10">
                  🎩 ONE PIECE DRAFT
                </h1>
                <div className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-black text-yellow-600/30 blur-sm uppercase tracking-wider">
                  🎩 ONE PIECE DRAFT
                </div>
              </div>
              
              {/* Game Rules & Explanation - Premium Design */}
              <div className="bg-gradient-to-r from-yellow-900/80 via-amber-900/80 to-yellow-900/80 p-4 sm:p-5 rounded-xl text-left font-medium text-xs sm:text-sm text-amber-100 border-2 border-yellow-600/50 shadow-xl backdrop-blur-sm relative overflow-hidden max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                <div className="relative z-10 space-y-3">
                  <div className="font-black text-gold-gradient text-sm sm:text-base mb-2 text-center">
                    ⚓ Welcome to the One Piece Card Draft! ⚓
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold text-yellow-200">🎮 How to Play:</p>
                    <ul className="list-disc list-inside space-y-1.5 ml-2 text-amber-100">
                      <li><strong>Rock-Paper-Scissors:</strong> Determine who goes first</li>
                      <li><strong>Draft Phase:</strong> Take turns drawing cards from the deck</li>
                      <li><strong>Build Your Crew:</strong> Fill 8 positions (Captain, Vice Captain, Tank, Swordsman, Healer, Sniper, Support 1, Support 2)</li>
                      <li><strong>Strategic Placement:</strong> Place characters in roles that match their strengths</li>
                      <li><strong>Skip Option:</strong> Skip once per game to get another card (stays your turn)</li>
                      <li><strong>Victory:</strong> First to complete their crew wins! AI judges based on team strength, role suitability, and synergy</li>
                    </ul>
                  </div>
                  
                  <div className="pt-2 border-t border-yellow-600/30">
                    <p className="text-center font-bold text-gold-gradient">Ready to set sail and build your legendary crew? 🏴‍☠️</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Start Button - Centered */}
            <div className="mt-6 sm:mt-8">
              <button 
                onClick={() => setGameState(GAME_STATES.RPS)} 
                className="button-premium text-gray-900 font-black py-5 px-12 rounded-2xl text-lg sm:text-xl relative glow-effect"
                aria-label="Start new game"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl">⚓</span>
                  <span>SET SAIL</span>
                  <span className="text-2xl">🏴‍☠️</span>
                </span>
              </button>
              <p className="mt-4 text-xs text-gray-400 font-medium">Begin Your Grand Adventure</p>
            </div>
          </div>
        )}

        {/* Status Message - Premium Design (for other game states) */}
        {gameState !== GAME_STATES.INIT && (
          <div className="text-center mb-4 sm:mb-5">
            <div className="relative inline-block mb-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gold-gradient mb-2 uppercase tracking-wider relative z-10">
                🎩 ONE PIECE DRAFT
              </h1>
              <div className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl font-black text-yellow-600/30 blur-sm uppercase tracking-wider">
                🎩 ONE PIECE DRAFT
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-900/80 via-amber-900/80 to-yellow-900/80 p-3 sm:p-4 rounded-xl text-center font-bold text-xs sm:text-sm text-amber-100 border-2 border-yellow-600/50 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              <span className="relative z-10">{message}</span>
            </div>
          </div>
        )}

        {/* Phase 2: Rock-Paper-Scissors - Premium Sequential System */}
        {gameState === GAME_STATES.RPS && (
          <div className="text-center card-premium p-5 sm:p-6 rounded-2xl shadow-2xl border-2 border-yellow-600/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/10 via-transparent to-blue-900/10" />
            <h2 className="text-lg sm:text-xl font-black text-gold-gradient mb-5 relative z-10">
              ⚔️ Choose Your Weapon ⚔️
            </h2>
            
            {/* Player A's Turn - Premium Design */}
            {!rpsChoice.PlayerA && (
              <div className="p-5 rounded-xl border-2 border-dashed border-blue-500/60 bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm relative z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />
                <h3 className="text-base sm:text-lg font-black text-blue-200 mb-2 relative z-10">
                  ⚓ Player A - Your Turn
                </h3>
                <p className="text-xs text-gray-300 mb-4 relative z-10">Choose your option. Player B cannot see your choice.</p>
                <div className="flex flex-wrap justify-center gap-2">
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
                <div className="mb-4 p-4 rounded-xl border-2 border-solid border-blue-500/60 bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm relative z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:15px_15px] opacity-30" />
                  <h3 className="text-sm sm:text-base font-black text-blue-200 mb-2 relative z-10">⚓ Player A</h3>
                  <p className="text-xs font-bold text-green-400 relative z-10">🔒 Choice Locked</p>
                  <p className="text-xs text-gray-400 mt-1 relative z-10">Waiting for Player B...</p>
                </div>

                {/* Player B's Turn - Premium Design */}
                <div className="p-5 rounded-xl border-2 border-dashed border-red-500/60 bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40 backdrop-blur-sm relative z-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50" />
                  <h3 className="text-base sm:text-lg font-black text-red-200 mb-2 relative z-10">
                    ⚓ Player B - Your Turn
                  </h3>
                  <p className="text-xs text-gray-300 mb-4 relative z-10">Choose your option. Player A cannot see your choice.</p>
                  <div className="flex flex-wrap justify-center gap-2">
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
                <div className="mb-3 p-4 rounded-xl border-2 border-solid border-blue-500/60 bg-gradient-to-br from-blue-900/40 to-blue-800/30 backdrop-blur-sm relative z-10">
                  <h3 className="text-sm sm:text-base font-black text-blue-200 mb-1 relative z-10">⚓ Player A</h3>
                  <p className="text-xs font-bold text-blue-100 relative z-10">Choice: <span className="text-gold-gradient">{rpsChoice.PlayerA}</span></p>
                </div>
                <div className="mb-4 p-4 rounded-xl border-2 border-solid border-red-500/60 bg-gradient-to-br from-red-900/40 to-red-800/30 backdrop-blur-sm relative z-10">
                  <h3 className="text-sm sm:text-base font-black text-red-200 mb-1 relative z-10">⚓ Player B</h3>
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
        )}

        {/* Phase 3: Drawing and Placement */}
        {gameState === GAME_STATES.DRAWING && (
          <div className="flex-1 flex flex-col min-h-0" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
            {/* Current Card Display - Premium Spotlight */}
            {currentCard && (
              <div className="relative z-30 mb-4 sm:mb-5 flex-shrink-0 animate-cardDraw">
                <div className="card-premium rounded-2xl p-4 sm:p-5 border-2 border-yellow-500/60 shadow-2xl relative overflow-hidden glow-effect">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-red-900/20 to-yellow-900/20" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />
                  
                  <div className="text-center mb-4 relative z-10">
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-gold-gradient uppercase tracking-wider mb-3">
                      ⚡ DRAWN CARD ⚡
                    </h3>
                    <div className="flex justify-center">
                      <div className="transform scale-110 sm:scale-125 transition-transform duration-300 hover:scale-[1.15]">
                        <Card character={currentCard} position="Unassigned" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium Skip Button */}
                  <div className="flex justify-center mt-4 relative z-10">
                    <button
                      onClick={() => handlePlacementOrSkip('SKIP')}
                      disabled={playerTurn === PLAYERS.A ? skipUsedA : skipUsedB}
                      className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-black transition-all duration-300 shadow-xl transform hover:scale-105 active:scale-95 text-sm sm:text-base relative overflow-hidden ${
                        (playerTurn === PLAYERS.A ? skipUsedA : skipUsedB)
                          ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-400 cursor-not-allowed border-2 border-gray-600'
                          : 'bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-800 hover:via-red-700 hover:to-red-800 text-white border-2 border-red-500/50 shadow-red-900/50'
                      }`}
                      aria-label="Skip this card"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span>⏭️</span>
                        <span>Skip Card (1x Use)</span>
                      </span>
                      {!(playerTurn === PLAYERS.A ? skipUsedA : skipUsedB) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stacked Decks - Scrollable Container */}
            <div className="relative flex-1 min-h-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain', touchAction: 'pan-y' }}>
              <div className="pb-4">
                <TeamDisplay 
                  team={teamA} 
                  teamName="Player A" 
                  isCurrentPlayer={playerTurn === PLAYERS.A}
                  skipUsed={skipUsedA}
                  isRPSPhase={false}
                  isExpanded={playerTurn === PLAYERS.A}
                  onPlaceCard={handlePlacementOrSkip}
                />
                
                <TeamDisplay 
                  team={teamB} 
                  teamName="Player B" 
                  isCurrentPlayer={playerTurn === PLAYERS.B}
                  skipUsed={skipUsedB}
                  isRPSPhase={false}
                  isExpanded={playerTurn === PLAYERS.B}
                  onPlaceCard={handlePlacementOrSkip}
                />
              </div>
            </div>
          </div>
        )}

        {/* Phase 4: Premium Results Display */}
        {gameState === GAME_STATES.END && (
          <div className="mt-5 p-5 sm:p-6 card-premium rounded-2xl shadow-2xl border-2 border-red-500/50 text-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 via-red-800/30 to-red-900/40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />
            
            <h2 className="text-2xl sm:text-3xl font-black text-gold-gradient mb-4 relative z-10">
              ⚔️ BATTLE RESULTS ⚔️
            </h2>
            
            {loading && (
              <div className="flex flex-col items-center justify-center space-y-3 text-sm font-bold text-red-200 relative z-10">
                <div className="relative">
                  <svg className="animate-spin h-8 w-8 text-gold-gradient" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
                </div>
                <span className="text-xs sm:text-sm text-gold-gradient font-black">AI Judge Analyzing Battle...</span>
              </div>
            )}

            {winner && !loading && (
              <div className="relative z-10">
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-gold-gradient my-6 drop-shadow-2xl animate-float">
                  <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                    🏆 WINNER: {winner.winner} 🏆
                  </div>
                </div>
                <div className="card-premium p-4 sm:p-5 rounded-xl border-2 border-yellow-600/40 shadow-xl text-left backdrop-blur-sm">
                  <h3 className="text-base sm:text-lg font-black text-gold-gradient mb-3 border-b-2 border-yellow-600/30 pb-2">
                    ⚖️ AI JUDGE RATIONALE:
                  </h3>
                  <p className="whitespace-pre-wrap text-xs sm:text-sm text-gray-200 leading-relaxed">{winner.reasoning}</p>
                </div>
                <button
                  onClick={resetGame}
                  className="mt-6 button-premium text-gray-900 font-black py-4 px-8 rounded-xl shadow-xl hover:scale-105 active:scale-95 relative glow-effect"
                  aria-label="Start a new game"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>⚓</span>
                    <span>New Adventure</span>
                    <span>🏴‍☠️</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Premium Reset Button (visible during game) */}
        {(gameState === GAME_STATES.RPS || gameState === GAME_STATES.DRAWING) && (
          <div className="mt-5 text-center">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-gray-500/50"
              aria-label="Reset game"
            >
              🔄 Reset Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
