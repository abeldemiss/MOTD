import React from 'react';
import { StyleSheet, FlatList, View, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, useTheme, MD3Theme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useArchivedMovies } from '../../src/hooks/useArchivedMovies';
import { MovieCard } from '../../src/components/movie/MovieCard';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ArchivedMoviesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = makeStyles(theme);
  const { movies, error, hasMore, isLoadingMore, loadMore, refresh } = useArchivedMovies();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const renderFooter = () => {
    if (!hasMore) return null;
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" />
        </View>
      );
    }
    return null;
  };

  const EmptyArchive = React.memo(() => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="archive-outline" 
        size={64} 
        color={theme.colors.onSurfaceVariant}
      />
      <Text 
        variant="headlineSmall" 
        style={[styles.emptyText, { marginTop: 16 }]}
      >
        No movies in archive yet
      </Text>
      <Text 
        variant="bodyMedium" 
        style={styles.emptyText}
      >
        Movies will appear here after they've been featured
      </Text>
    </View>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => router.push(`/movie/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<EmptyArchive />}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      />
    </SafeAreaView>
  );
}

const makeStyles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    padding: 16,
    flexGrow: 1,
    minHeight: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    paddingVertical: 32,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
}); 