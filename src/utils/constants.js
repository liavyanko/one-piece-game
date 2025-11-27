// ============================================================================
// GAME CONSTANTS
// ============================================================================

export const GAME_STATES = {
  INIT: 'INIT',
  NAME_INPUT: 'NAME_INPUT',
  RPS: 'RPS',
  DRAWING: 'DRAWING',
  TEAM_COMPARISON: 'TEAM_COMPARISON',
  BATTLE_RESULTS: 'BATTLE_RESULTS',
  END: 'END' // Legacy - keeping for compatibility
};

export const PLAYERS = {
  A: 'PlayerA',
  B: 'PlayerB'
};

export const RPS_CHOICES = {
  ROCK: 'Rock',
  PAPER: 'Paper',
  SCISSORS: 'Scissors'
};

export const TEAM_POSITIONS = [
  'Captain', 
  'Vice Captain', 
  'Tank', 
  'Swordsman', 
  'Healer', 
  'Sniper', 
  'Support 1', 
  'Support 2'
];

export const MAX_TEAM_SIZE = TEAM_POSITIONS.length;
export const MAX_RETRIES = 3;
export const RETRY_DELAY_BASE = 1000; // Base delay in ms for exponential backoff
export const TRANSITION_DELAY = 2000; // Delay before transitioning game states
export const CARD_DRAW_DELAY = 1000; // Delay before drawing next card

// API Configuration
export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
export const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';

// API Key - Hardcoded for production (no environment variables or GitHub secrets)
// Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual Gemini API key
export const API_KEY = 'AIzaSyC_O666i7f2bp1gx7K6md5_GV-lT6PiZQU';

export const FALLBACK_IMAGE_URL = 'https://placehold.co/100x96/1e293b/ffffff?text=OP+Character';

// Character data - Images will be fetched dynamically
export const CHARACTER_CARDS_MOCK = [
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

// Character name to URL format mapping for known characters
export const CHARACTER_URL_MAP = {
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

