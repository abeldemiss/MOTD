import React from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, Card, Divider } from 'react-native-paper';
import type { Credits } from '../../services/tmdb/types';

interface MovieCreditsProps {
  credits: Credits;
}

export function MovieCredits({ credits }: MovieCreditsProps) {
  const directors = credits.crew.filter(member => member.job === 'Director');
  const mainCast = credits.cast.slice(0, 10); // Show top 10 cast members

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/w185${path}`;
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.sectionTitle}>Cast & Crew</Text>
      
      {directors.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.subsectionTitle}>
            Director{directors.length > 1 ? 's' : ''}
          </Text>
          {directors.map(director => (
            <Text key={director.id} style={styles.directorName}>
              {director.name}
            </Text>
          ))}
        </View>
      )}

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.subsectionTitle}>Cast</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.castContainer}
      >
        {mainCast.map(actor => (
          <Card key={actor.id} style={styles.castCard}>
            {actor.profile_path ? (
              <Image
                source={{ uri: getImageUrl(actor.profile_path) }}
                style={styles.actorImage}
              />
            ) : (
              <View style={[styles.actorImage, styles.placeholderImage]}>
                <Text>No Image</Text>
              </View>
            )}
            <Card.Content style={styles.castInfo}>
              <Text variant="bodyMedium" numberOfLines={1}>
                {actor.name}
              </Text>
              <Text variant="bodySmall" style={styles.character} numberOfLines={2}>
                {actor.character}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  subsectionTitle: {
    marginBottom: 12,
    fontWeight: '500',
  },
  directorName: {
    fontSize: 16,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 16,
  },
  castContainer: {
    paddingVertical: 8,
  },
  castCard: {
    width: 140,
    marginRight: 12,
    overflow: 'hidden',
  },
  actorImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  castInfo: {
    padding: 8,
  },
  character: {
    marginTop: 4,
    opacity: 0.7,
  },
}); 