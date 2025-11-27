import React, { useState, useEffect, useCallback } from 'react';

// --- GAME SETTINGS ---
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

// Mock character list with unique image URLs (using a unique seed for each character for visual variety)
const CHARACTER_CARDS_MOCK = [
  // S-Tier (Yonko/Admirals/PK level) - Strong
  { name: 'Monkey D. Luffy', rank: 'Yonko (S-Tier)', imgUrl: 'https://picsum.photos/seed/luffy/100/140' },
  { name: 'Shanks', rank: 'Yonko (S-Tier)', imgUrl: 'https://picsum.photos/seed/shanks/100/140' },
  { name: 'Admiral Akainu', rank: 'Fleet Admiral (S-Tier)', imgUrl: 'https://picsum.photos/seed/akainu/100/140' },
  { name: 'Kaido', rank: 'Former Yonko (S-Tier)', imgUrl: 'https://picsum.photos/seed/kaido/100/140' },
  { name: 'Dracule Mihawk', rank: 'WSS (S-Tier)', imgUrl: 'https://picsum.photos/seed/mihawk/100/140' },
  
  // A-Tier (Commander/Supernova/Vice Admiral level) - Medium/Strong
  { name: 'Roronoa Zoro', rank: 'Commander (A-Tier)', imgUrl: 'https://picsum.photos/seed/zoro/100/140' },
  { name: 'Vinsmoke Sanji', rank: 'Commander (A-Tier)', imgUrl: 'https://picsum.photos/seed/sanji/100/140' },
  { name: 'Jinbe', rank: 'Tank/Fighter (A-Tier)', imgUrl: 'https://picsum.photos/seed/jinbe/100/140' },
  { name: 'Trafalgar Law', rank: 'Supernova (A-Tier)', imgUrl: 'https://picsum.photos/seed/law/100/140' },
  { name: 'Portgas D. Ace', rank: 'Commander (A-Tier)', imgUrl: 'https://picsum.photos/seed/ace/100/140' },

  // B-Tier (Standard Crew/Mid-level Marine) - Weak/Medium
  { name: 'Tony Tony Chopper', rank: 'Doctor (B-Tier)', imgUrl: 'https://picsum.photos/seed/chopper/100/140' },
  { name: 'Usopp', rank: 'Sniper (B-Tier)', imgUrl: 'https://picsum.photos/seed/usopp/100/140' },
  { name: 'Nami', rank: 'Navigator (B-Tier)', imgUrl: 'https://picsum.photos/seed/nami/100/140' },
  { name: 'Nico Robin', rank: 'Scholar (B-Tier)', imgUrl: 'https://picsum.photos/seed/robin/100/140' },
  { name: 'Buggy', rank: 'Warlord (B-Tier)', imgUrl: 'https://picsum.photos/seed/buggy/100/140' },
  { name: 'Coby', rank: 'Captain (B-Tier)', imgUrl: 'https://picsum.photos/seed/coby/100/140' },
];

// Reusable Tailwind classes for the 'Hearthstone' look
const FANTASY_BORDER = 'border-4 border-amber-600 shadow-lg shadow-yellow-900/50';
const FANTASY_CARD_FRAME = 'border-4 border-yellow-700 shadow-xl shadow-red-900/40 hover:shadow-2xl hover:shadow-red-900/70';

const PlayerBadge = ({ userId, isCurrent }) => (
  <div className={`p-2 rounded-full text-xs font-mono text-white transition-all ${isCurrent ? 'bg-red-700 ring-4 ring-amber-400 shadow-xl' : 'bg-gray-700'}`}>
    Player: {userId.substring(0, 8)}... {isCurrent ? '(YOUR TURN!)' : ''}
  </div>
);

const Card = ({ character, position }) => (
  // Enhanced Card Frame Style
  <div className={`bg-gray-100 ${FANTASY_CARD_FRAME} rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.05] transform`}>
    <img 
        src={character.imgUrl} 
        alt={character.name} 
        className="w-full h-24 object-cover border-b-2 border-yellow-700" 
        // Fallback for image loading issues
        onError={(e) => e.target.src = 'https://placehold.co/100x96/1e293b/ffffff?text=OP+Character'} 
    />
    <div className="p-2 text-center bg-gray-900 text-white border-t border-yellow-700">
      <div className="text-sm font-extrabold text-amber-300 truncate">{character.name}</div>
      <div className="text-xs text-yellow-500 mt-1 font-semibold border-t border-gray-700 pt-1">{position}</div>
      <div className="text-[10px] text-gray-400">{character.rank}</div>
    </div>
  </div>
);

const EmptySlot = ({ position }) => (
  // Enhanced Empty Slot Style (looks like an empty pedestal)
  <div className={`bg-gray-800 border-4 border-dashed border-yellow-800 rounded-xl p-3 flex flex-col items-center justify-center h-[160px] text-center opacity-70 shadow-inner shadow-gray-900`}>
    <div className="text-sm font-black text-amber-500">{position}</div>
    <div className="text-xs text-gray-400 mt-1">Awaiting Card</div>
  </div>
);

const App = () => {
  // Global context (API Key placeholder)
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const apiKey = ""; 

  // --- GAME STATE ---
  const [gameState, setGameState] = useState('INIT'); // INIT, RPS, DRAWING, END
  const [playerTurn, setPlayerTurn] = useState('PlayerA'); // PlayerA | PlayerB
  const [deck, setDeck] = useState([]);
  
  const [teamA, setTeamA] = useState(Array(8).fill(null));
  const [teamB, setTeamB] = useState(Array(8).fill(null));
  
  const [skipUsedA, setSkipUsedA] = useState(false);
  const [skipUsedB, setSkipUsedB] = useState(false);
  
  const [currentCard, setCurrentCard] = useState(null);
  const [rpsChoice, setRpsChoice] = useState({ PlayerA: null, PlayerB: null });
  const [rpsResult, setRpsResult] = useState('');
  
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Welcome to the One Piece Card Draft! Let\'s begin.');
  
  const allSlotsFilled = teamA.every(slot => slot !== null) && teamB.every(slot => slot !== null);

  // --- Deck Initialization ---
  useEffect(() => {
    // Shuffling the deck
    const shuffledDeck = [...CHARACTER_CARDS_MOCK]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    setDeck(shuffledDeck);
  }, []);

  // --- RPS Logic (Sequential Choice) ---
  const handleRPS = (player, choice) => {
    // 1. Set the player's choice
    setRpsChoice(prev => ({ ...prev, [player]: choice }));
    
    // 2. Check if both players have chosen (only if Player B is choosing)
    if (player === 'PlayerB' && rpsChoice.PlayerA) {
      const choiceA = rpsChoice.PlayerA;
      const choiceB = choice;
      let startingPlayer = null;
      let resultText = '';

      if (choiceA === choiceB) {
        resultText = 'Tie! Choose again.';
        setRpsChoice({ PlayerA: null, PlayerB: null }); // Reset for re-election
      } else if (
        (choiceA === 'Rock' && choiceB === 'Scissors') ||
        (choiceA === 'Scissors' && choiceB === 'Paper') ||
        (choiceA === 'Paper' && choiceB === 'Rock')
      ) {
        startingPlayer = 'PlayerA';
        resultText = 'Player A wins the draw! They will start first.';
      } else {
        startingPlayer = 'PlayerB';
        resultText = 'Player B wins the draw! They will start first.';
      }
      
      setRpsResult(resultText);
      
      if (startingPlayer) {
        setPlayerTurn(startingPlayer);
        setTimeout(() => {
          setGameState('DRAWING');
          setMessage(`Game begins! It is ${startingPlayer}'s turn.`);
          drawCard(startingPlayer);
        }, 2000);
      }
    } else if (player === 'PlayerA') {
        // If Player A just chose, update message and wait for Player B
        setMessage(`Player A has chosen. Awaiting Player B's choice...`);
    }
  };

  // --- Card Drawing Logic ---
  const drawCard = useCallback((player) => {
    if (deck.length === 0) {
      setMessage('Deck is empty! Awaiting final game results.');
      return;
    }

    const [cardToDraw, ...restOfDeck] = deck;
    setDeck(restOfDeck);
    setCurrentCard(cardToDraw);
    setMessage(`${player}'s turn. Drawn card: ${cardToDraw.name}. Choose a position or Skip.`);
  }, [deck]);

  // --- Placement or Skip Logic ---
  const handlePlacementOrSkip = (action) => {
    const isPlayerA = playerTurn === 'PlayerA';
    const currentTeam = isPlayerA ? teamA : teamB;
    const setTeam = isPlayerA ? setTeamA : setTeamB;
    const setSkipUsed = isPlayerA ? setSkipUsedA : setSkipUsedB;
    const skipUsed = isPlayerA ? skipUsedA : skipUsedB;
    
    // 1. Handle Skip
    if (action === 'SKIP' && !skipUsed) {
      setSkipUsed(true);
      setCurrentCard(null); // Discard the current card
      setMessage(`${playerTurn} skipped the card. Next player's turn.`);
      
      // Move to next player's turn
      const nextPlayer = isPlayerA ? 'PlayerB' : 'PlayerA';
      setPlayerTurn(nextPlayer);
      // NOTE: allSlotsFilled check here prevents drawing a card if the game is technically over 
      // but the state hasn't fully transitioned to 'END' yet.
      if (!allSlotsFilled) {
        setTimeout(() => drawCard(nextPlayer), 1000);
      }
      return;
    }

    // 2. Handle Placement
    const slotIndex = action;
    if (currentCard && slotIndex >= 0 && currentTeam[slotIndex] === null) {
      const newTeam = [...currentTeam];
      newTeam[slotIndex] = { character: currentCard, position: TEAM_POSITIONS[slotIndex] };
      setTeam(newTeam);
      setCurrentCard(null);
      setMessage(`${currentCard.name} successfully placed as ${TEAM_POSITIONS[slotIndex]}!`);

      // 3. Check for game end
      const nextPlayer = isPlayerA ? 'PlayerB' : 'PlayerA';
      // Determine if ALL slots are filled (for both teams)
      const isTeamASlotsFull = (isPlayerA ? newTeam : teamA).every(slot => slot !== null);
      const isTeamBSlotsFull = (isPlayerA ? teamB : newTeam).every(slot => slot !== null);

      if (isTeamASlotsFull && isTeamBSlotsFull) {
        setGameState('END');
        setMessage('All positions filled! Game ended. Initiating AI Judgement...');
        setTimeout(determineWinner, 2000);
      } else {
        // 4. Move to next turn and draw a card
        setPlayerTurn(nextPlayer);
        // NOTE: allSlotsFilled check here prevents drawing a card if the game is technically over 
        // but the state hasn't fully transitioned to 'END' yet.
        if (!allSlotsFilled) {
          setTimeout(() => drawCard(nextPlayer), 1000);
        }
      }
    }
  };

  // --- AI Judgment Logic (Gemini API Call) ---
  const determineWinner = async () => {
    setLoading(true);

    // FIX: Added .filter(item => item !== null) to prevent accessing properties 
    // on null if the array contains unfilled slots prematurely (addressing TypeError).
    const formatTeam = (team) => 
      team
        .filter(item => item !== null) // Filter out any empty slots (null)
        .map(item => `* ${item.position}: ${item.character.name} (Rank: ${item.character.rank})`).join('\n');

    const teamAString = formatTeam(teamA);
    const teamBString = formatTeam(teamB);

    // Prompt for the AI Judge
    const userQuery = `Perform a deep analysis of the following two pirate crews and determine which one wins in a team-vs-team battle. Consider the overall character strength, the suitability of the character for the role they are assigned (Captain, Tank, Healer, etc.), and the overall team synergy and balance. Justify your decision. The crews are:\n\nCrew A (Player A):\n${teamAString}\n\nCrew B (Player B):\n${teamBString}\n\nReturn ONLY the structured JSON as required.`;

    const systemPrompt = `You are a highly experienced expert with encyclopedic knowledge of the 'One Piece' universe. Your role is to judge a battle between two pirate crews based on their composition. Your output MUST be objective, well-reasoned, and in JSON format only. The structure must be: { "winner": "PlayerA" | "PlayerB", "reasoning": "Your detailed justification" }`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      tools: [{ "google_search": {} }], // Use search tool for up-to-date info
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            winner: { type: "STRING", description: "The winning player (PlayerA or PlayerB)" },
            reasoning: { type: "STRING", description: "Detailed justification for the decision based on strength and role suitability" }
          },
          required: ["winner", "reasoning"]
        }
      }
    };

    let result = null;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (jsonText) {
          result = JSON.parse(jsonText);
          break; // Exit retry loop on success
        } else {
            console.error("API response missing content.");
        }

      } catch (error) {
        console.error(`Attempt ${retries + 1} failed:`, error);
        retries++;
        if (retries < maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 2 ** retries * 1000));
        } else {
          setMessage('AI Judgment Error. Please try restarting the game.');
        }
      }
    }

    setLoading(false);

    if (result && result.winner) {
      setWinner(result);
      setMessage(`Judgment complete! The winner is ${result.winner}.`);
    } else {
      setWinner({ winner: 'NONE', reasoning: 'The AI could not determine a clear winner. Try starting a new game.' });
      setMessage('AI could not determine a clear winner.');
    }
  };

  // --- UI Components ---
  const TeamDisplay = ({ team, teamName, isCurrentPlayer, skipUsed, isRPSPhase }) => (
    // Team Container: Skewed frame style
    <div className={`bg-gray-800 p-6 rounded-2xl shadow-2xl ${FANTASY_BORDER} transform hover:scale-[1.01] transition-all`}>
      <h2 className="text-2xl font-black mb-4 text-center text-amber-500 border-b-2 border-amber-700 pb-2 uppercase tracking-wider">
        {teamName} Crew ({team.filter(c => c !== null).length}/8)
      </h2>
      {!isRPSPhase && (
        <div className="flex justify-center items-center mb-6 space-x-4">
          <PlayerBadge userId={teamName} isCurrent={isCurrentPlayer} />
          <div className={`p-1 px-3 text-xs rounded-full font-bold border-2 ${skipUsed ? 'bg-red-900 text-red-300 border-red-700' : 'bg-green-900 text-green-300 border-green-700'}`}>
            Skip Saved: {skipUsed ? 'Used' : 'Available'}
          </div>
        </div>
      )}

      {/* Grid container with a slight visual skew effect (to mimic a board piece) */}
      <div className="grid grid-cols-2 gap-5 transform skew-y-1 -skew-x-1 p-2 bg-gray-900 rounded-lg shadow-inner shadow-black">
        {TEAM_POSITIONS.map((position, index) => (
          <div key={index} className="relative transform -skew-y-1 skew-x-1"> {/* Counter-skew for content */}
            {team[index] ? (
              <Card character={team[index].character} position={position} />
            ) : (
              <EmptySlot position={position} />
            )}
            
            {/* Placement Button - Looks like a gold-etched button */}
            {isCurrentPlayer && gameState === 'DRAWING' && !team[index] && currentCard && (
              <button
                onClick={() => handlePlacementOrSkip(index)}
                className="mt-2 w-full bg-gradient-to-r from-green-600 to-green-800 text-white text-xs font-black py-2 rounded-lg transition-all shadow-lg hover:shadow-2xl hover:scale-[1.03] active:translate-y-0.5 active:shadow-sm border-b-4 border-green-900"
              >
                Place as {position}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const RPSButton = ({ choice, player, isTurn }) => (
    <button
      onClick={() => handleRPS(player, choice)}
      disabled={rpsChoice[player] !== null || !isTurn}
      className={`px-6 py-3 mx-2 rounded-xl font-black transition-all shadow-2xl text-lg transform hover:scale-105 active:scale-95 border-b-4 border-red-900 ${
        rpsChoice[player] === choice 
          ? 'bg-yellow-500 text-gray-900 ring-4 ring-yellow-300' 
          : isTurn
            ? 'bg-gradient-to-t from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-900'
      }`}
    >
      {choice}
    </button>
  );

  // --- Main Component ---
  return (
    // Richer fantasy background
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-900 p-4 font-sans flex flex-col items-center">
      {/* Main Container: Dark Wood/Stone Frame */}
      <div className="max-w-4xl w-full bg-gray-900 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-amber-800 transform skew-y-1 -skew-x-1">
        {/* Content wrapper to counter-skew */}
        <div className="transform -skew-y-1 skew-x-1">
          <h1 className="text-4xl font-black text-center text-amber-500 mb-6 border-b-4 border-red-700 pb-3 uppercase drop-shadow-lg">
            🏴‍☠️ ONE PIECE CREW DRAFT (Prototype)
          </h1>
          
          {/* Messages and Game Status */}
          <div className="bg-yellow-900/50 p-4 rounded-xl text-center font-bold text-amber-300 mb-6 border-2 border-amber-500 shadow-inner shadow-black">
            {message}
          </div>

          {/* Phase 1: Start */}
          {gameState === 'INIT' && (
            <div className="text-center">
              <button onClick={() => setGameState('RPS')} className="bg-gradient-to-r from-green-500 to-green-700 text-white font-black py-4 px-10 rounded-xl shadow-2xl shadow-green-900/70 transition-transform duration-300 hover:scale-[1.05] border-b-4 border-green-900">
                Start Game (Rock-Paper-Scissors)
              </button>
            </div>
          )}

          {/* Phase 2: Rock-Paper-Scissors */}
          {gameState === 'RPS' && (
            <div className="text-center bg-gray-800 p-6 rounded-xl shadow-xl border border-amber-700">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">Choose: Rock, Paper, or Scissors</h2>
              
              {/* Player A's Choice */}
              <div className="mb-8 p-4 rounded-xl border-4 border-dashed border-blue-600 bg-blue-900/50 shadow-inner shadow-black">
                <h3 className="text-xl font-extrabold text-blue-300 mb-3">Player A</h3>
                <RPSButton choice="Rock" player="PlayerA" isTurn={!rpsChoice.PlayerA} />
                <RPSButton choice="Paper" player="PlayerA" isTurn={!rpsChoice.PlayerA} />
                <RPSButton choice="Scissors" player="PlayerA" isTurn={!rpsChoice.PlayerA} />
                <p className="mt-4 text-sm font-medium text-gray-300">
                  {rpsChoice.PlayerA ? `Chosen: ${rpsChoice.PlayerA}` : 'Awaiting choice...'}
                </p>
              </div>

              {/* Player B's Choice */}
              <div className={`p-4 rounded-xl border-4 border-dashed ${rpsChoice.PlayerA ? 'border-red-600 bg-red-900/50' : 'border-gray-600 bg-gray-700/50'} shadow-inner shadow-black`}>
                <h3 className="text-xl font-extrabold text-red-300 mb-3">Player B</h3>
                <RPSButton choice="Rock" player="PlayerB" isTurn={!!rpsChoice.PlayerA && !rpsChoice.PlayerB} />
                <RPSButton choice="Paper" player="PlayerB" isTurn={!!rpsChoice.PlayerA && !rpsChoice.PlayerB} />
                <RPSButton choice="Scissors" player="PlayerB" isTurn={!!rpsChoice.PlayerA && !rpsChoice.PlayerB} />
                <p className="mt-4 text-sm font-medium text-gray-300">
                  {rpsChoice.PlayerB ? `Chosen: ${rpsChoice.PlayerB}` : 'Awaiting choice...'}
                </p>
              </div>
              
              {rpsResult && <div className="mt-8 text-2xl font-black text-green-500">{rpsResult}</div>}
            </div>
          )}

          {/* Phase 3: Drawing and Placement */}
          {gameState === 'DRAWING' && (
            <div className="text-center mb-8">
              {currentCard && (
                <div className="inline-block p-4 bg-gray-800 rounded-xl shadow-2xl border-4 border-red-700 transform scale-105 shadow-red-900/70">
                  <h3 className="text-xl font-black text-amber-400 mb-3 uppercase">CURRENT CARD DRAWN:</h3>
                  <Card character={currentCard} position="Unassigned" />
                  
                  <div className="mt-4 flex justify-center space-x-4">
                    {/* Skip Button: Metal/Dark Stone style */}
                    <button
                      onClick={() => handlePlacementOrSkip('SKIP')}
                      disabled={playerTurn === 'PlayerA' ? skipUsedA : skipUsedB}
                      className={`px-6 py-2 rounded-xl font-bold transition-all shadow-xl transform hover:scale-105 active:scale-95 border-b-4 ${
                        (playerTurn === 'PlayerA' ? skipUsedA : skipUsedB)
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-900'
                          : 'bg-gradient-to-r from-red-800 to-red-600 hover:from-red-900 hover:to-red-700 text-white border-red-900'
                      }`}
                    >
                      Skip Card (1 Time Use)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Team Displays */}
          <div className="flex flex-col md:flex-row gap-8 mt-6">
            <div className="flex-1">
              <TeamDisplay 
                team={teamA} 
                teamName="Player A" 
                isCurrentPlayer={playerTurn === 'PlayerA' && gameState === 'DRAWING'}
                skipUsed={skipUsedA}
                isRPSPhase={gameState === 'RPS'}
              />
            </div>
            <div className="flex-1">
              <TeamDisplay 
                team={teamB} 
                teamName="Player B" 
                isCurrentPlayer={playerTurn === 'PlayerB' && gameState === 'DRAWING'}
                skipUsed={skipUsedB}
                isRPSPhase={gameState === 'RPS'}
              />
            </div>
          </div>

          {/* Phase 4: AI Judgment Results */}
          {gameState === 'END' && (
            <div className="mt-8 p-6 bg-red-900/50 rounded-xl shadow-2xl border-4 border-red-700 text-center">
              <h2 className="text-3xl font-black text-amber-300 mb-4 drop-shadow-md">⚔️ BATTLE RESULTS ⚔️</h2>
              {loading && (
                <div className="flex items-center justify-center space-x-2 text-xl font-bold text-red-200">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  AI Judge is determining the winner... (Sending to Gemini API)
                </div>
              )}

              {winner && !loading && (
                <div>
                  <div className="text-5xl font-extrabold text-yellow-400 my-6 transform scale-y-110 drop-shadow-xl">
                    WINNER: {winner.winner}
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg border border-amber-600 shadow-md text-left">
                    <h3 className="text-xl font-bold text-amber-300 mb-2 border-b border-gray-600 pb-1">AI JUDGE RATIONALE:</h3>
                    <p className="whitespace-pre-wrap text-gray-300">{winner.reasoning}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div> {/* End of counter-skew wrapper */}
      </div>
    </div>
  );
};

export default App;