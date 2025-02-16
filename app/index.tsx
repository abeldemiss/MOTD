import React from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button, useTheme, MD3Theme } from 'react-native-paper';
import { useMovieOfTheDay } from '../src/hooks/useMovieOfTheDay';
import { MovieCard } from '../src/components/movie/MovieCard';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRandomFunFact } from '../src/utils/movieFacts';

export default function HomeScreen() {
  const router = useRouter();
  const { movie, loading, error, refetch } = useMovieOfTheDay();
  const theme = useTheme();

  const styles = makeStyles(theme);

  const handleMoviePress = () => {
    if (movie) {
      router.push(`/movie/${movie.id}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={refetch}
            style={styles.retryButton}
          >
            Try Again
          </Button>
        </View>
      );
    }

    if (!movie) {
      return (
        <View style={styles.centerContainer}>
          <Text>No movie available</Text>
        </View>
      );
    }

    return (
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Movie of the Day
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
        </View>
        <View style={styles.cardContainer}>
          <MovieCard 
            movie={movie} 
            onPress={handleMoviePress}
          />
        </View>
        <View style={styles.additionalInfo}>
          <Text style={styles.infoText}>
            Runtime: {movie.runtime} minutes
          </Text>
          <Text style={styles.infoText}>
            Rating: {movie.vote_average.toFixed(1)}/10
          </Text>
          <Text style={styles.infoText}>
            Genres: {movie.genres.map(g => g.name).join(', ')}
          </Text>
          <View style={styles.funFactContainer}>
            <Text style={styles.funFactLabel}>Fun Fact</Text>
            <Text style={styles.funFactText}>
              {getRandomFunFact(movie)}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderContent()}
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.onBackground,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginTop: 8,
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  additionalInfo: {
    padding: 20,
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 16,
    elevation: 1,
    shadowColor: theme.dark ? theme.colors.primary : '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.dark ? 0.3 : 0.1,
    shadowRadius: 8,
  },
  infoText: {
    fontSize: 15,
    marginVertical: 6,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
    letterSpacing: 0.25,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.error,
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
  funFactContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.outline,
  },
  funFactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
    letterSpacing: 0.15,
  },
  funFactText: {
    fontSize: 15,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
    letterSpacing: 0.25,
  },
}); 