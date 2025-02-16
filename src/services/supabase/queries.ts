import { supabase } from './client';
import type { Movie } from '../tmdb/types';

export const archiveMovie = async (movie: Movie) => {
  const { error } = await supabase.from('archived_movies').upsert({
    movie_id: movie.id,
    title: movie.title,
    poster_url: movie.poster_path,
    release_date: movie.release_date,
    synopsis: movie.overview,
    cast_and_crew: null, // To be implemented
    streaming_links: null, // To be implemented
    displayed_on: new Date().toISOString(),
    rating: movie.vote_average,
    vote_count: movie.vote_count,
    genres: movie.genres,
    runtime: movie.runtime,
    budget: movie.budget,
    revenue: movie.revenue,
    language: movie.original_language,
  });

  if (error) {
    throw error;
  }
};

interface UserRating {
  movie_id: number;
  user_id: string;
  rating: number;
  review: string | null;
  watched_at: string;
}

export const rateMovie = async (movieId: number, rating: number, review?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.from('user_ratings').upsert({
    movie_id: movieId,
    user_id: user.id,
    rating,
    review,
    watched_at: new Date().toISOString(),
  });

  if (error) throw error;
};

export const getUserRating = async (movieId: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_ratings')
    .select('*')
    .eq('movie_id', movieId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as UserRating | null;
};

interface WatchlistItem {
  movie_id: number;
  user_id: string;
  added_at: string;
  notes?: string;
}

export const addToWatchlist = async (movieId: number, notes?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase.from('watchlist').upsert({
    movie_id: movieId,
    user_id: user.id,
    added_at: new Date().toISOString(),
    notes,
  });

  if (error) throw error;
};

export const removeFromWatchlist = async (movieId: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('watchlist')
    .delete()
    .match({ movie_id: movieId, user_id: user.id });

  if (error) throw error;
};

export const getWatchlist = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('watchlist')
    .select(`
      *,
      movies:movie_id (
        id,
        title,
        poster_path,
        release_date,
        vote_average
      )
    `)
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const isInWatchlist = async (movieId: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('watchlist')
    .select('movie_id')
    .eq('movie_id', movieId)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}; 