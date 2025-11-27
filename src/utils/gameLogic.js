// ============================================================================
// GAME LOGIC UTILITIES
// ============================================================================

import { PLAYERS, RPS_CHOICES } from './constants.js';

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array
 */
export const shuffleArray = (array) => {
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
export const determineRPSWinner = (choiceA, choiceB) => {
  if (choiceA === choiceB) {
    return null; // Tie
  }

  const wins = {
    [RPS_CHOICES.ROCK]: RPS_CHOICES.SCISSORS,
    [RPS_CHOICES.PAPER]: RPS_CHOICES.ROCK,
    [RPS_CHOICES.SCISSORS]: RPS_CHOICES.PAPER,
  };

  return wins[choiceA] === choiceB ? PLAYERS.A : PLAYERS.B;
};

/**
 * Formats team data for AI analysis
 * @param {Array} team - Team array with character placements
 * @returns {string} - Formatted team string
 */
export const formatTeamForAI = (team) => {
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
export const isTeamComplete = (team) => {
  return team.every(slot => slot !== null);
};

/**
 * Delays execution by specified milliseconds
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validates player name
 * @param {string} name - Player name to validate
 * @returns {{ valid: boolean, error?: string }} - Validation result
 */
export const validatePlayerName = (name) => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Name cannot be empty' };
  }
  
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (trimmed.length > 20) {
    return { valid: false, error: 'Name must be 20 characters or less' };
  }
  
  // Allow letters, numbers, spaces, and common punctuation
  const validPattern = /^[a-zA-Z0-9\s'.-]+$/;
  if (!validPattern.test(trimmed)) {
    return { valid: false, error: 'Name contains invalid characters' };
  }
  
  return { valid: true };
};

/**
 * Gets player name with fallback
 * @param {string} playerId - Player ID (PlayerA or PlayerB)
 * @param {string} playerNameA - Player A's name
 * @param {string} playerNameB - Player B's name
 * @returns {string} - Player name or default
 */
export const getPlayerName = (playerId, playerNameA, playerNameB) => {
  if (playerId === PLAYERS.A) {
    return playerNameA || 'Player 1';
  }
  return playerNameB || 'Player 2';
};

