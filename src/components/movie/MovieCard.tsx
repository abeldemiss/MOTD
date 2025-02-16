import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Text, Card, TouchableRipple, useTheme, MD3Theme } from 'react-native-paper';
import type { Movie } from '../../services/tmdb/types';

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // 16pt padding on each side
const POSTER_ASPECT_RATIO = 1.5;

export function MovieCard({ movie, onPress }: MovieCardProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <TouchableRipple
          onPress={onPress}
          style={styles.touchable}
          borderless
        >
          <View>
            <Image
              source={{ uri: posterUrl }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.content}>
              <Text variant="headlineMedium" style={styles.title}>
                {movie.title}
              </Text>
              <Text variant="bodyLarge" style={styles.date}>
                {new Date(movie.release_date).getFullYear()}
              </Text>
              <Text 
                variant="bodyMedium" 
                style={styles.overview}
                numberOfLines={3}
              >
                {movie.overview}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      </Card>
    </View>
  );
}

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
  cardContainer: {
    ...theme.dark 
      ? {
          // Glow effect for dark mode
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }
      : {
          // Dramatic drop shadow for light mode
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 16,
        }
  },
  card: {
    backgroundColor: theme.dark ? theme.colors.surface : theme.colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: theme.dark ? 1 : 0,
    borderColor: theme.dark ? `${theme.colors.primary}20` : 'transparent',
  },
  touchable: {
    borderRadius: 12,
  },
  poster: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 4,
    color: theme.colors.onSurface,
  },
  date: {
    marginBottom: 8,
    color: theme.colors.onSurfaceVariant,
  },
  overview: {
    color: theme.colors.onSurfaceVariant,
  },
}); 