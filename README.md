# 🏴‍☠️ One Piece Card Draft Game

A mobile-optimized card drafting game inspired by Hearthstone, featuring One Piece characters. Players draft teams and compete with AI-powered judgment.

## Features

- 🎮 **Interactive Draft System**: Rock-Paper-Scissors to determine starting player
- 🎴 **Card Drafting**: Take turns drafting characters to fill team positions
- 🏆 **AI-Powered Judgment**: Uses Google Gemini API to determine battle winners
- 🖼️ **Dynamic Image Fetching**: Automatically fetches character images using Gemini API
- 📱 **Mobile-First Design**: Optimized for iOS Chrome and mobile browsers
- 🎨 **Hearthstone-Style UI**: Stacked deck interface with smooth animations
- ♿ **Accessible**: ARIA labels and keyboard navigation support

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Google Gemini API key (optional, for AI judgment feature)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (optional):
   ```bash
   cp .env.example .env
   # Edit .env and add your VITE_GEMINI_API_KEY
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

### Running on Mobile

1. Ensure your mobile device and computer are on the same Wi-Fi network
2. Find your computer's local IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```
3. On your mobile browser, navigate to: `http://YOUR_IP:5173`

## Game Rules

1. **Initialization**: Click "Start Game" to begin
2. **Rock-Paper-Scissors**: Both players choose to determine who goes first
3. **Drafting Phase**: 
   - Players take turns drawing cards
   - Each player can place a card in an empty position or skip (once per game)
   - Goal: Fill all 8 team positions
4. **AI Judgment**: When both teams are complete, AI analyzes and determines the winner

## Project Structure

```
One_Piece_Card_Game/
├── src/
│   ├── OnePieceCardDraft.jsx  # Main game component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## Code Quality Features

- ✅ **Comprehensive Error Handling**: Try-catch blocks and user-friendly error messages
- ✅ **Performance Optimized**: React.memo, useMemo, useCallback for efficient re-renders
- ✅ **Clean Code**: Well-organized constants, utility functions, and component structure
- ✅ **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- ✅ **Type Safety**: Constants for game states and player references
- ✅ **Environment Variables**: Secure API key management
- ✅ **Code Documentation**: JSDoc comments for functions

## Technologies

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Google Gemini API**: AI judgment (optional)

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

### API Key Setup

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the project root
3. Add: `VITE_GEMINI_API_KEY=your_key_here`
4. Restart the dev server

**Note**: The game works without an API key, but AI judgment will be unavailable.

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions welcome! Please ensure code follows the existing style and includes proper error handling.

