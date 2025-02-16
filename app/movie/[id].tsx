import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Text, Button, useTheme, MD3Theme } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tmdbApi } from '../../src/services/tmdb/api';
import { StreamingProviders } from '../../src/components/movie/StreamingProviders';
import { MovieCredits } from '../../src/components/movie/MovieCredits';
import type { Movie, WatchProviders, Credits } from '../../src/services/tmdb/types';
import { cacheStorage, CACHE_EXPIRY } from '../../src/services/cache/storage';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [providers, setProviders] = useState<WatchProviders | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const movieId = Number(id);
      const [movieData, watchProviders, creditsData] = await Promise.all([
        tmdbApi.getMovieDetails(movieId),
        tmdbApi.getWatchProviders(movieId),
        tmdbApi.getMovieCredits(movieId)
      ]);

      setMovie(movieData);
      setProviders(watchProviders);
      setCredits(creditsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
        <Button mode="contained" onPress={fetchMovieDetails}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={{ 
            uri: `https://image.tmdb.org/t/p/w780${movie.poster_path}` 
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>
            {new Date(movie.release_date).getFullYear()}
          </Text>
          
          <View style={styles.stats}>
            <Text style={styles.statItem}>
              ⭐️ {movie.vote_average.toFixed(1)}/10
            </Text>
            <Text style={styles.statItem}>
              ⏱ {movie.runtime} mins
            </Text>
          </View>

          <View style={styles.genres}>
            {movie.genres.map(genre => (
              <View key={genre.id} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.releaseDate}>
            <Text style={styles.releaseDateText}>
              {new Date(movie.release_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>

          <Text style={styles.sectionTitle}>Where to Watch</Text>
          {providers && <StreamingProviders providers={providers} />}

          {credits && <MovieCredits credits={credits} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  poster: {
    width: '100%',
    height: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.onBackground,
  },
  year: {
    fontSize: 18,
    marginBottom: 8,
    color: theme.colors.onSurfaceVariant,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    marginRight: 16,
    color: theme.colors.onSurfaceVariant,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  releaseDate: {
    marginBottom: 16,
  },
  releaseDateText: {
    color: theme.colors.onSurfaceVariant,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    color: theme.colors.onBackground,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: theme.colors.onBackground,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 16,
  }
}); 