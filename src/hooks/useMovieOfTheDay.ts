import { useState, useEffect, useRef } from 'react';
import { tmdbApi } from '../services/tmdb/api';
import type { Movie } from '../services/tmdb/types';
import { archiveMovie } from '../services/supabase/queries';
import { cacheStorage, CACHE_EXPIRY } from '../services/cache/storage';
import { format, startOfDay, endOfDay } from 'date-fns';

export const useMovieOfTheDay = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchDate = useRef<string | null>(null);

  const fetchMovieOfTheDay = async () => {
    try {
      const now = new Date();
      const today = startOfDay(now);
      const dateKey = format(today, 'yyyy-MM-dd');

      // Don't fetch if we already fetched today
      if (dateKey === lastFetchDate.current) {
        return;
      }

      setLoading(true);
      const cacheKey = cacheStorage.getMovieOfTheDayKey(dateKey);

      console.log('Cache key:', cacheKey);

      // Try to get from cache first
      const cachedMovie = await cacheStorage.get<Movie>(
        cacheKey,
        endOfDay(today).getTime() - now.getTime() // Expire at end of day
      );

      if (cachedMovie) {
        console.log('Found cached movie:', cachedMovie.title);
        setMovie(cachedMovie);
        lastFetchDate.current = dateKey;
        return;
      }

      console.log('Fetching popular movies for Movie of the Day');
      const response = await tmdbApi.getMoviesByDate(0, 0);
      
      // Filter out movies with no poster or overview
      const eligibleMovies = response.results.filter(movie => 
        movie.poster_path && 
        movie.overview
      );

      console.log('Eligible movies:', eligibleMovies.length);

      if (eligibleMovies.length === 0) {
        throw new Error('No eligible movies found');
      }

      // Get a random movie from the top 20 results
      const topMovies = eligibleMovies.slice(0, 20);
      const randomIndex = Math.floor(Math.random() * topMovies.length);
      const selectedMovie = topMovies[randomIndex];

      console.log('Selected movie:', selectedMovie.title, `(${selectedMovie.release_date})`);

      // Get full movie details
      const movieDetails = await tmdbApi.getMovieDetails(selectedMovie.id);
      
      // Cache the movie until end of day
      await cacheStorage.set(
        cacheKey, 
        movieDetails, 
        endOfDay(today).getTime() - now.getTime()
      );
      
      setMovie(movieDetails);
      await archiveMovie(movieDetails);
      lastFetchDate.current = dateKey;
      setError(null);
    } catch (err) {
      console.error('Error fetching movie of the day:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Check for day change every minute
  useEffect(() => {
    const checkDayChange = () => {
      const now = new Date();
      const currentDateKey = format(now, 'yyyy-MM-dd');

      // If it's a new day or we don't have a movie, fetch a new one
      if (currentDateKey !== lastFetchDate.current) {
        fetchMovieOfTheDay();
      }
    };

    // Initial fetch
    fetchMovieOfTheDay();

    // Check every minute for day changes
    const interval = setInterval(checkDayChange, 60000);

    return () => clearInterval(interval);
  }, []); // No dependencies needed

  const refetch = () => {
    lastFetchDate.current = null; // Reset the last fetch date to force a new fetch
    setError(null);
    return fetchMovieOfTheDay();
  };

  return { movie, loading, error, refetch };
}; 