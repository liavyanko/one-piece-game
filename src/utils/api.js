// ============================================================================
// API UTILITIES
// ============================================================================

import { API_KEY, GEMINI_API_BASE, GEMINI_MODEL, MAX_RETRIES, RETRY_DELAY_BASE, PLAYERS } from './constants.js';
import { formatTeamForAI, delay } from './gameLogic.js';
import { getPlayerName } from './gameLogic.js';

/**
 * Determines winner using AI (Gemini API)
 * @param {Array} teamA - Team A array
 * @param {Array} teamB - Team B array
 * @param {string} playerNameA - Player A's name
 * @param {string} playerNameB - Player B's name
 * @returns {Promise<{winner: string, reasoning: string}>} - Winner result
 */
export const determineWinner = async (teamA, teamB, playerNameA, playerNameB) => {
  if (!API_KEY || API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('API key not configured. Cannot determine winner.');
  }

  const teamAString = formatTeamForAI(teamA);
  const teamBString = formatTeamForAI(teamB);

  const userQuery = `Perform a deep, strategic analysis of the following two pirate crews and determine which one wins in an all-out, team-vs-team battle.

Analysis Criteria:

Character Strength: Overall combat power based on their rank (Yonko, Commander, etc.).

Role Suitability: How well each character fits their assigned role (Captain, Tank, Healer, etc.).

Team Synergy: The balance and effectiveness of the crew as a whole (e.g., does the Tank protect the Healer?).

Crew Data:

Crew A (${playerNameA || 'Player 1'}):

${teamAString}

Crew B (${playerNameB || 'Player 2'}):

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
        try {
          result = JSON.parse(jsonText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Raw text:', jsonText);
          throw new Error(`Failed to parse AI response: ${parseError.message}`);
        }
        
        // Validate result structure - must be binary (PlayerA or PlayerB only)
        if (result && result.winner) {
          // Normalize winner value - handle variations
          const winnerValue = result.winner.toString().trim();
          if (winnerValue === PLAYERS.A || winnerValue === 'PlayerA' || winnerValue === 'A') {
            result.winner = PLAYERS.A;
          } else if (winnerValue === PLAYERS.B || winnerValue === 'PlayerB' || winnerValue === 'B') {
            result.winner = PLAYERS.B;
          } else {
            throw new Error(`Invalid winner value: ${winnerValue}. Must be PlayerA or PlayerB`);
          }
          
          // Ensure reasoning exists
          if (!result.reasoning || result.reasoning.trim() === '') {
            result.reasoning = 'The AI determined the winner based on team composition and strategic analysis.';
          }
          
          break; // Success
        } else {
          throw new Error('Invalid response structure from API - missing winner field');
        }
      } else {
        console.error('API response structure:', data);
        throw new Error('API response missing content. Check API key and model configuration.');
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

  if (result && result.winner) {
    return result;
  } else {
    const errorMessage = lastError?.message || 'Unknown error occurred';
    throw new Error(`AI Judgment failed: ${errorMessage}`);
  }
};

