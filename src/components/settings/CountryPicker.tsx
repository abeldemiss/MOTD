import React, { useState } from 'react';
import { StyleSheet, Modal, FlatList, View } from 'react-native';
import { List, Searchbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { countries } from '../../utils/countries';

interface CountryPickerProps {
  value: string;
  onChange: (country: string) => void;
}

export function CountryPicker({ value, onChange }: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const theme = useTheme();

  const selectedCountry = countries.find(c => c.code === value);
  const filteredCountries = search.trim() 
    ? countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase().trim()))
    : countries;

  return (
    <>
      <List.Item
        title="Country"
        description={selectedCountry?.name || 'Select country'}
        left={props => <List.Icon {...props} icon="earth" />}
        onPress={() => setVisible(true)}
      />

      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Searchbar
              placeholder="Search countries"
              value={search}
              onChangeText={setSearch}
              style={styles.searchbar}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.code}
            renderItem={({ item }) => (
              <List.Item
                title={item.name}
                onPress={() => {
                  onChange(item.code);
                  setVisible(false);
                }}
              />
            )}
          />

          {filteredCountries.length === 0 && (
            <List.Item
              title="No countries found"
              description="Try a different search term"
            />
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  searchbar: {
    marginHorizontal: 16,
  },
}); 