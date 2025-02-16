import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEYS = {
  MOVIE_OF_THE_DAY: 'motd:movieOfTheDay',
  MOVIE_DETAILS: 'motd:movieDetails:',
  WATCH_PROVIDERS: 'motd:watchProviders:',
  ARCHIVED_MOVIES: 'motd:archivedMovies',
  MOVIE_CREDITS: 'motd:movieCredits:',
} as const;

const CACHE_EXPIRY = {
  MOVIE_OF_THE_DAY: 24 * 60 * 60 * 1000, // 24 hours
  MOVIE_DETAILS: 7 * 24 * 60 * 60 * 1000, // 7 days
  WATCH_PROVIDERS: 24 * 60 * 60 * 1000, // 24 hours
  ARCHIVED_MOVIES: 60 * 60 * 1000, // 1 hour
} as const;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const cacheStorage = {
  async set<T>(key: string, data: T, expiryTime: number): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  },

  async get<T>(key: string, expiryTime: number): Promise<T | null> {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const cacheItem: CacheItem<T> = JSON.parse(cached);
    const isExpired = Date.now() - cacheItem.timestamp > expiryTime;

    if (isExpired) {
      await AsyncStorage.removeItem(key);
      return null;
    }

    return cacheItem.data;
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  getMovieOfTheDayKey(date: string): string {
    return `${CACHE_KEYS.MOVIE_OF_THE_DAY}:${date}`;
  },

  getMovieDetailsKey(movieId: number): string {
    return `${CACHE_KEYS.MOVIE_DETAILS}${movieId}`;
  },

  getWatchProvidersKey(movieId: number): string {
    return `${CACHE_KEYS.WATCH_PROVIDERS}${movieId}`;
  },

  getMovieCreditsKey(movieId: number): string {
    return `${CACHE_KEYS.MOVIE_CREDITS}${movieId}`;
  },

  async clearAll(): Promise<void> {
    const keys = Object.values(CACHE_KEYS);
    await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
  },
};

export { CACHE_KEYS, CACHE_EXPIRY }; 