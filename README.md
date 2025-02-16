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

- Daily movie suggestions
- Detailed movie information
- Streaming availability
- Fun facts about each movie
- Dark mode support
- Movie archive
