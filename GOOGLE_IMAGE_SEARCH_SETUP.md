# Dynamic Image Fetching with Gemini API

This application uses Gemini API to dynamically fetch character images based on their names. Gemini uses its knowledge of One Piece characters to construct accurate image URLs, eliminating the need to maintain a static list of image URLs.

## Setup Instructions

### Already Configured! ✅

The application already uses your existing Gemini API key that's configured for the game's AI judgment feature. No additional setup is required!

The Gemini API key is set in the code:
- **API Key**: Already configured (from your existing setup)
- **Model**: `gemini-2.5-flash-preview-09-2025`

### How It Works

1. When a character card is displayed, the app asks Gemini to provide the best image URL
2. Gemini uses its knowledge of One Piece characters to construct accurate wiki URLs
3. Images are cached in `sessionStorage` to avoid repeated API calls
4. If Gemini can't find a URL, it constructs one based on character name patterns

## How It Works

- When a card is displayed, the app asks Gemini to provide the best image URL for that character
- Gemini uses its knowledge to construct accurate One Piece Wiki URLs
- Results are cached in `sessionStorage` to avoid repeated API calls
- Images are fetched asynchronously with a loading spinner
- If Gemini can't provide a URL, it constructs one based on character name patterns

## API Quota & Limits

- **Gemini API Free Tier**: 15 requests per minute (RPM), 1,500 requests per day (RPD)
- **Paid Tier**: Higher limits available

For a typical game session:
- Each character image requires 1 API call
- With 75 characters, you'll use ~75 API calls per game
- Images are cached, so repeated views don't use additional calls
- The free tier should be sufficient for development and moderate usage

## Troubleshooting

### Images Not Loading

1. **Check API Key**: Ensure the Gemini API key is set correctly in the code
2. **Check API Quota**: Verify you haven't exceeded daily/minute limits
3. **Check Console**: Open browser console for error messages
4. **Check Network**: Ensure you have internet connection

### Fallback Images Showing

- This is normal if:
  - API key is not configured
  - API quota is exceeded
  - Network error occurs
  - Gemini can't find a suitable image URL

The app will gracefully fall back to constructed wiki URLs or placeholder images in these cases.

## Benefits of Using Gemini

✅ **No additional API setup** - Uses your existing Gemini API key  
✅ **Intelligent URL construction** - Gemini knows One Piece character names and formats  
✅ **Automatic caching** - Images are cached to minimize API calls  
✅ **Graceful fallbacks** - Multiple fallback strategies ensure images always load  

## Alternative: Static Images

If you prefer to use static images instead of dynamic fetching:

1. Add `imgUrl` property back to character objects
2. The app will use provided URLs instead of fetching
3. No API calls needed for those characters

