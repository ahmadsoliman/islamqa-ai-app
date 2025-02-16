import React, { useState } from 'react';
import { TextInput, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, spacing } from '../constants/Colors';
import { useTranslation } from 'react-i18next';
import { getTextDirectionStyle } from '../utils/styles';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const { i18n } = useTranslation();

  const handleSearch = () => {
    onSearch(query);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TextInput
        style={[styles.input, getTextDirectionStyle(i18n)]}
        value={query}
        onChangeText={setQuery}
        placeholder='Search messages...'
        placeholderTextColor={Colors.text + '80'}
        onSubmitEditing={handleSearch}
      />
      <Pressable onPress={handleSearch} style={styles.searchButton}>
        <Ionicons name='search' size={24} color={Colors.primary} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: Colors.secondaryBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: spacing.md,
    padding: spacing.sm,
    marginRight: spacing.sm,
    color: Colors.text,
  },
  searchButton: {
    padding: spacing.sm,
  },
});
