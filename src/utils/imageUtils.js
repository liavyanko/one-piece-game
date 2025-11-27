// ============================================================================
// IMAGE UTILITY FUNCTIONS
// ============================================================================

import { API_KEY, GEMINI_API_BASE, GEMINI_MODEL, FALLBACK_IMAGE_URL, CHARACTER_URL_MAP } from './constants.js';

// Request deduplication map to prevent race conditions
const imageFetchCache = new Map();
const pendingRequests = new Map();

/**
 * Fetches an image URL for a character using Gemini API with reliable fallbacks
 * @param {string} characterName - Name of the character to search for
 * @returns {Promise<string>} - Image URL or fallback URL
 */
export const fetchCharacterImage = async (characterName) => {
  // Check if request is already pending (prevent race conditions)
  if (pendingRequests.has(characterName)) {
    return pendingRequests.get(characterName);
  }

  // Image cache to avoid repeated API calls
  const cacheKey = `img_${characterName}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached && cached !== FALLBACK_IMAGE_URL) {
    return cached;
  }

  // Create promise for this request
  const fetchPromise = (async () => {
    try {
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
    } finally {
      // Remove from pending requests
      pendingRequests.delete(characterName);
    }
  })();

  // Store promise to prevent duplicate requests
  pendingRequests.set(characterName, fetchPromise);
  
  return fetchPromise;
};

/**
 * Preloads all character images
 * @param {Array} characters - Array of character objects
 * @returns {Promise<void>}
 */
export const preloadCharacterImages = async (characters) => {
  const preloadPromises = characters.map(char => 
    fetchCharacterImage(char.name).catch(err => {
      console.warn(`Failed to preload image for ${char.name}:`, err);
      return FALLBACK_IMAGE_URL;
    })
  );
  
  await Promise.allSettled(preloadPromises);
};

/**
 * Gets rarity class for card styling
 * @param {string} rank - Character rank
 * @returns {string} - CSS class name
 */
export const getRarityClass = (rank) => {
  if (rank.includes('S-Tier') || rank.includes('Yonko') || rank.includes('Admiral')) {
    return 'card-rarity-legendary';
  } else if (rank.includes('A-Tier') || rank.includes('Commander') || rank.includes('Supernova')) {
    return 'card-rarity-epic';
  } else {
    return 'card-rarity-rare';
  }
};

