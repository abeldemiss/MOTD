# Expo Router Example

Use [`expo-router`](https://docs.expo.dev/router/introduction/) to build native navigation using files in the `app/` directory.

## 🚀 How to use

```sh
npx create-expo-app -e with-router
```

## 📝 Notes

- [Expo Router: Docs](https://docs.expo.dev/router/introduction/)

# Movie of the Day

A mobile app that suggests a different movie each day, providing details, streaming availability, and fun facts.

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the environment variables in `.env`:
   - `TMDB_API_KEY`: Get your API key from [TMDB](https://www.themoviedb.org/settings/api)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase project's anon/public key

⚠️ Never commit the `.env` file or share your API keys publicly!

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Follow the Expo CLI instructions to run the app on your device or emulator.

## Features

### Core Features
- Daily curated movie suggestions
- Detailed movie information and metadata
- US streaming availability through JustWatch integration
- Engaging movie fun facts
- Movie archive to browse past suggestions

### User Experience
- Modern, intuitive interface
- Dark mode support
- Daily notifications (optional)
- Offline support with caching
- Smooth animations and transitions

### Technical Details
- Built with Expo and React Native
- Uses TMDB API for movie data
- Supabase backend for data persistence
- TypeScript for type safety
- Follows Material Design 3 guidelines

## Notes
- Streaming availability information is currently limited to the United States
- The app requires an active internet connection for fetching new movies and streaming information
- Some features may require enabling notifications on your device
