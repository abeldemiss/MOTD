import React from 'react';
import { StyleSheet, View, Image, Linking, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import type { WatchProviders } from '../../services/tmdb/types';

interface StreamingProvidersProps {
  providers: WatchProviders;
  countryCode?: string;
}

export const StreamingProviders = ({ 
  providers, 
  countryCode = 'US' 
}: StreamingProvidersProps) => {
  const countryProviders = providers.results[countryCode];
  
  if (!countryProviders) {
    return (
      <View style={styles.container}>
        <Text>No streaming information available for your region.</Text>
      </View>
    );
  }

  const renderProviderSection = (
    title: string, 
    providerList?: Provider[]
  ) => {
    if (!providerList?.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.providerList}
        >
          {providerList.map((provider) => (
            <View key={provider.provider_id} style={styles.provider}>
              <Image
                source={{ 
                  uri: `https://image.tmdb.org/t/p/original${provider.logo_path}` 
                }}
                style={styles.providerLogo}
              />
              <Text style={styles.providerName}>
                {provider.provider_name}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderProviderSection('Stream', countryProviders.flatrate)}
      {renderProviderSection('Rent', countryProviders.rent)}
      {renderProviderSection('Buy', countryProviders.buy)}
      <Button
        mode="outlined"
        onPress={() => Linking.openURL(countryProviders.link)}
        style={styles.justWatchButton}
      >
        View on JustWatch
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  providerList: {
    paddingHorizontal: 4,
  },
  provider: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  providerLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  providerName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  justWatchButton: {
    marginTop: 16,
    minHeight: 44,
  },
}); 