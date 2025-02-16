# Movie of the Day App - Technical Specification

A mobile app that displays a randomly selected movie released on today's date in history, along with detailed information and streaming options.

## Tech Stack

- **Frontend:** React Native with TypeScript, Expo, and Expo Router
- **Backend:** Supabase
- **UI:** React Native Paper
- **API:** The Movie Database (TMDb)

## Core Features

### 1. Movie of the Day
- Randomly selects a movie released on today's date in a previous year
- Shows movie details (title, poster, release date, synopsis, cast & crew)
- Displays "On this date in [year]... [movie title] was released"
- Movies must be at least 1 year old and theatrical releases
- Updates daily based on user's local time

### 2. Archived Movies
- Browse previously featured movies
- Stored in database for quick access

### 3. Streaming & Purchase Options
- Direct links to watch or buy the movie
- Integration with multiple streaming platforms

## Technical Implementation

### Data Flow

#### Initial Setup
1. **TMDb Integration**
   - API key configuration
   - Fetch movie details, streaming links

2. **Supabase Database**
   ```sql
   -- Users table for future authentication
   Table: users
   - id (PK)
   - email
   - created_at
   - last_login
   - preferences (JSON)

   -- Main movies archive
   Table: archived_movies
   - id (PK)
   - movie_id (TMDb ID)
   - title
   - poster_url
   - release_date
   - synopsis
   - cast_and_crew (JSON)
   - streaming_links (JSON)
   - displayed_on (Date)
   - rating (Float)
   - vote_count (Integer)
   - genres (JSON)
   - runtime (Integer)
   - budget (Integer)
   - revenue (Integer)
   - language (String)

   -- For future user interactions
   Table: user_interactions
   - id (PK)
   - user_id (FK refs users.id)
   - movie_id (FK refs archived_movies.id)
   - favorite (Boolean)
   - rating (Integer)
   - review (Text)
   - created_at
   - updated_at
   ```

#### Movie Selection Algorithm
1. Get current date (user's timezone)
2. Query TMDb for movies released on this day
3. Filter for:
   - Movies > 1 year old
   - Theatrical releases
4. Randomly select one movie
5. Store in archived_movies

### Application Structure

#### Frontend Components
- `MovieOfTheDay.tsx`: Displays the movie of the day.
- `ArchivedMovies.tsx`: Displays the list of archived movies.
- `MovieDetails.tsx`: Displays detailed information about a movie.
- `StreamingLinks.tsx`: Displays streaming/purchase links.

#### Hooks
- `useMovieOfTheDay.ts`: Fetches and manages the movie of the day.
- `useArchivedMovies.ts`: Fetches and manages archived movies.

#### Routes
- `/` - Home (Movie of the Day)
- `/archived` - Archived Movies
- `/movie/:id` - Movie Details

### Backend
- **Supabase**:
  - Table: `archived_movies`
  - Functions:
    - `insertArchivedMovie(movie: Movie)`: Inserts a new movie into the archive.
    - `getArchivedMovies()`: Retrieves the list of archived movies.

## API Endpoints

### TMDb API
- **Movie Details**: `https://api.themoviedb.org/3/movie/{movie_id}`
- **Streaming Links**: `https://api.themoviedb.org/3/movie/{movie_id}/watch/providers`

### Supabase
- **Insert Movie**: `POST /rest/v1/archived_movies`
- **Fetch Archived Movies**: `GET /rest/v1/archived_movies`

## Future Enhancements
1. **User Accounts**:
   - Allow users to create accounts and save favorite movies.
2. **Notifications**:
   - Send daily notifications with the movie of the day.
3. **Search**:
   - Add a search feature to find movies by title, actor, or director.
4. **Reviews/Ratings**:
   - Allow users to rate and review movies.

## Project Structure

```
MOTD/
├── app/                      # Expo Router app directory
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home screen (Movie of the Day)
│   ├── archived/            # Archived movies routes
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   └── movie/              
│       ├── _layout.tsx
│       └── [id].tsx         # Dynamic movie details route
├── src/
│   ├── components/          # Reusable components
│   │   ├── common/          # Shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── movie/          # Movie-specific components
│   │   │   ├── MovieCard.tsx
│   │   │   ├── MovieDetails.tsx
│   │   │   └── StreamingLinks.tsx
│   │   └── layout/         # Layout components
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useMovieOfTheDay.ts
│   │   ├── useArchivedMovies.ts
│   │   └── useStreamingLinks.ts
│   ├── services/           # API and external services
│   │   ├── tmdb/          # TMDb API integration
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   └── supabase/      # Supabase integration
│   │       ├── client.ts
│   │       └── queries.ts
│   ├── utils/             # Utility functions
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── constants/         # App constants
│   │   ├── theme.ts
│   │   └── config.ts
│   └── types/            # TypeScript types
│       ├── movie.ts
│       └── api.ts
├── assets/              # Static assets
│   ├── images/
│   └── fonts/
└── config/             # Configuration files
    ├── app.config.ts
    └── theme.config.ts
```

---