import Constants from 'expo-constants';
import type { Movie, MovieResponse, WatchProviders, Credits, Genre, DiscoverParams } from './types';
import { format } from 'date-fns';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = Constants.expoConfig?.extra?.tmdbApiKey;

// Fix: Change from Bearer token to API key parameter
const getUrl = (endpoint: string) => {
  return `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
};

const headers = {
  'Content-Type': 'application/json',
};

export const tmdbApi = {
  async getMoviesByDate(month: number, day: number): Promise<MovieResponse> {
    const today = new Date();
    const lastYear = today.getFullYear() - 1;
    
    // Get popular movies from before last year
    const url = getUrl(`/discover/movie?sort_by=popularity.desc&vote_count.gte=1000&include_adult=false&language=en-US&primary_release_year=${lastYear}&page=1`);
    console.log('Fetching popular movies with URL:', url);
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    
    const data = await response.json();
    console.log('Found movies:', data.results.length);
    console.log('Top movies:', data.results.slice(0, 5).map((m: Movie) => 
      `${m.title} (${m.release_date})`
    ).join(', '));
    
    return data;
  },

  async getMovieDetails(movieId: number): Promise<Movie> {
    const response = await fetch(
      getUrl(`/movie/${movieId}`),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    return response.json();
  },

  async getWatchProviders(movieId: number): Promise<WatchProviders> {
    const response = await fetch(
      getUrl(`/movie/${movieId}/watch/providers`),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch watch providers');
    }
    
    return response.json();
  },

  async searchMovies(query: string, page = 1): Promise<MovieResponse> {
    const response = await fetch(
      getUrl(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    
    return response.json();
  },

  async searchPeople(query: string, page = 1): Promise<{
    results: {
      id: number;
      name: string;
      known_for_department: string;
      known_for: Movie[];
    }[];
    total_pages: number;
    total_results: number;
  }> {
    const response = await fetch(
      getUrl(`/search/person?query=${encodeURIComponent(query)}&page=${page}`),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to search people');
    }
    
    return response.json();
  },

  async getMoviesByPerson(personId: number, page = 1): Promise<MovieResponse> {
    const response = await fetch(
      getUrl(`/discover/movie?with_cast=${personId}&page=${page}`),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movies by person');
    }
    
    return response.json();
  },

  async getMovieCredits(movieId: number): Promise<Credits> {
    const response = await fetch(
      getUrl(`/movie/${movieId}/credits`),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie credits');
    }
    
    return response.json();
  },

  async getGenres(): Promise<{ genres: Genre[] }> {
    const response = await fetch(
      getUrl('/genre/movie/list'),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    
    return response.json();
  },

  async discoverMovies(params: DiscoverParams): Promise<MovieResponse> {
    const queryParams = new URLSearchParams({
      ...params,
      page: params.page?.toString() || '1',
    });

    const response = await fetch(
      getUrl(`/discover/movie?${queryParams}`),
      { headers }
    );
    
    if (!response.ok) {
      throw new Error('Failed to discover movies');
    }
    
    return response.json();
  },
}; 