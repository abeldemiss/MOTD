import React, { useState } from 'react';
import { StyleSheet, Modal, FlatList } from 'react-native';
import { List, Searchbar } from 'react-native-paper';
import { countries } from '../../utils/countries';

interface CountryPickerProps {
  value: string;
  onChange: (country: string) => void;
}

export function CountryPicker({ value, onChange }: CountryPickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

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
        <Searchbar
          placeholder="Search countries"
          value={search}
          onChangeText={setSearch}
          style={styles.searchbar}
        />

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
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    margin: 16,
  },
}); 