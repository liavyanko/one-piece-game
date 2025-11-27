# How to Get Working One Piece Character Image URLs

Since direct image URLs from the One Piece Wiki can be unreliable, here are several options:

## Option 1: Get URLs from One Piece Wiki (Recommended)

1. Visit https://onepiece.fandom.com
2. Search for each character
3. On the character page, right-click the main character image
4. Select "Copy image address" or "Open image in new tab"
5. Copy the direct image URL (should end in .png or .jpg)
6. Replace the imgUrl in the CHARACTER_CARDS_MOCK array

## Option 2: Use Image Hosting Services

1. Download character images from the One Piece Wiki or official sources
2. Upload them to a reliable image hosting service:
   - Imgur (imgur.com)
   - Cloudinary
   - Your own server/CDN
3. Use the direct image URLs from these services

## Option 3: Use Local Images

1. Create a `public/images` folder in your project
2. Download character images and save them there
3. Use relative paths like: `imgUrl: '/images/luffy.png'`

## Option 4: Use an Anime Character API

Consider using an API service that provides anime character images if available.

