import { create } from 'zustand';
import { GAME_STATES, PLAYERS, MAX_TEAM_SIZE, CHARACTER_CARDS_MOCK } from '../utils/constants.js';
import { shuffleArray } from '../utils/gameLogic.js';

/**
 * Zustand store for game state management
 * Centralizes all game state for better performance and debugging
 */
export const useGameStore = create((set, get) => ({
  // Game State
  gameState: GAME_STATES.INIT,
  playerTurn: PLAYERS.A,
  
  // Players
  playerNameA: '',
  playerNameB: '',
  
  // Deck
  deck: [],
  
  // Teams
  teamA: Array(MAX_TEAM_SIZE).fill(null),
  teamB: Array(MAX_TEAM_SIZE).fill(null),
  
  // Skip tracking
  skipUsedA: false,
  skipUsedB: false,
  
  // Current card
  currentCard: null,
  
  // RPS
  rpsChoice: { PlayerA: null, PlayerB: null },
  rpsResult: '',
  
  // Results
  winner: null,
  loading: false,
  
  // UI State
  message: 'Welcome to the One Piece Card Draft! Build your ultimate pirate crew by drafting characters. Each player fills 8 positions (Captain, Vice Captain, Tank, Swordsman, Healer, Sniper, Support 1, Support 2). Take turns drawing cards and placing them strategically. You can skip once per game to get another card. When both crews are complete, AI judges the winner based on team strength, role suitability, and synergy. Ready to set sail?',
  error: null,

  // Actions
  setGameState: (state) => set({ gameState: state }),
  setPlayerTurn: (player) => set({ playerTurn: player }),
  setPlayerNameA: (name) => set({ playerNameA: name }),
  setPlayerNameB: (name) => set({ playerNameB: name }),
  setDeck: (deck) => set({ deck }),
  setTeamA: (team) => set({ teamA: team }),
  setTeamB: (team) => set({ teamB: team }),
  setSkipUsedA: (used) => set({ skipUsedA: used }),
  setSkipUsedB: (used) => set({ skipUsedB: used }),
  setCurrentCard: (card) => set({ currentCard: card }),
  setRpsChoice: (choice) => set((state) => ({ 
    rpsChoice: { ...state.rpsChoice, ...choice } 
  })),
  setRpsResult: (result) => set({ rpsResult: result }),
  setWinner: (winner) => set({ winner }),
  setLoading: (loading) => set({ loading }),
  setMessage: (message) => set({ message }),
  setError: (error) => set({ error }),

  // Complex Actions
  initializeDeck: () => {
    const shuffledDeck = shuffleArray(CHARACTER_CARDS_MOCK);
    set({ deck: shuffledDeck });
  },

  resetGame: () => {
    set({
      gameState: GAME_STATES.INIT,
      playerTurn: PLAYERS.A,
      deck: shuffleArray(CHARACTER_CARDS_MOCK),
      teamA: Array(MAX_TEAM_SIZE).fill(null),
      teamB: Array(MAX_TEAM_SIZE).fill(null),
      skipUsedA: false,
      skipUsedB: false,
      currentCard: null,
      rpsChoice: { PlayerA: null, PlayerB: null },
      rpsResult: '',
      winner: null,
      loading: false,
      message: 'Welcome to the One Piece Card Draft! Build your ultimate pirate crew by drafting characters. Each player fills 8 positions (Captain, Vice Captain, Tank, Swordsman, Healer, Sniper, Support 1, Support 2). Take turns drawing cards and placing them strategically. You can skip once per game to get another card. When both crews are complete, AI judges the winner based on team strength, role suitability, and synergy. Ready to set sail?',
      error: null,
      playerNameA: '',
      playerNameB: '',
    });
  },

  // Game actions
  drawCard: (player) => {
    const state = get();
    if (state.deck.length === 0) {
      set({ message: 'Deck is empty! Game will end when all positions are filled.' });
      return;
    }

    const [cardToDraw, ...restOfDeck] = state.deck;
    set({ 
      deck: restOfDeck,
      currentCard: cardToDraw
    });
  },

  // Computed getters
  getCurrentTeam: () => {
    const state = get();
    return state.playerTurn === PLAYERS.A ? state.teamA : state.teamB;
  },

  getCurrentSkipUsed: () => {
    const state = get();
    return state.playerTurn === PLAYERS.A ? state.skipUsedA : state.skipUsedB;
  },

  getCurrentPlayerName: () => {
    const state = get();
    return state.playerTurn === PLAYERS.A 
      ? (state.playerNameA || 'Player 1')
      : (state.playerNameB || 'Player 2');
  },
}));

