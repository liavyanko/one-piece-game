# 🚀 Quick Start Guide

## Installation (One-Time Setup)

```bash
# Install dependencies
npm install
```

## Running the Game

### Development Mode (Local)
```bash
npm run dev
```
Then open: `http://localhost:5173`

### Development Mode (Mobile Access)
```bash
npm run dev
```

Then on your mobile device:
1. Ensure same Wi-Fi network as your computer
2. Find your computer's IP:
   - **Mac/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
   - **Windows**: `ipconfig` (look for IPv4 Address)
3. Open in mobile browser: `http://YOUR_IP:5173`

### Production Build
```bash
npm run build
npm run preview
```

## API Key Setup (Optional)

For AI judgment feature:

1. Get API key from: https://makersuite.google.com/app/apikey
2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Add your key:
   ```
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```
4. Restart dev server

**Note**: Game works without API key, but AI judgment won't be available.

## Game Instructions

1. **Start**: Click "Start Game"
2. **RPS**: Both players choose Rock/Paper/Scissors
3. **Draft**: Take turns placing cards or skip (once per game)
4. **Win**: Fill all 8 positions, AI determines winner

## Troubleshooting

### Can't access from mobile?
- Check firewall settings
- Ensure same Wi-Fi network
- Try `http://0.0.0.0:5173` instead

### Images not loading?
- Character images use Wiki URLs (may be unreliable)
- Check browser console for errors
- Images have fallback placeholders

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

Check `README.md` for detailed documentation.

