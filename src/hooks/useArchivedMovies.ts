import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/client';
import type { Movie } from '../services/tmdb/types';

export const useArchivedMovies = (limit = 20) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMovies = async (startIndex = 0) => {
    try {
      if (startIndex > 0) {
        setIsLoadingMore(true);
      }

      const { data, error: supabaseError } = await supabase
        .from('archived_movies')
        .select('*')
        .order('displayed_on', { ascending: false })
        .range(startIndex, startIndex + limit - 1);

      if (supabaseError) throw supabaseError;

      if (data) {
        setMovies(prevMovies => 
          startIndex === 0 ? data : [...prevMovies, ...data]
        );
        setHasMore(data.length === limit);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load archived movies');
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchMovies(movies.length);
    }
  };

  const refresh = async () => {
    setError(null);
    await fetchMovies(0);
  };

  return { 
    movies,
    error,
    hasMore,
    isLoadingMore,
    loadMore,
    refresh
  };
}; 