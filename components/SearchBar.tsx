import React, { useState } from 'react';
import { TextInput, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, spacing } from '../constants/Colors';
import { useTranslation } from 'react-i18next';
import { getTextInputDirectionStyle } from '../utils/styles';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0.5));
  const { t, i18n } = useTranslation();

  const handleInput = (q: string) => {
    setQuery(q);
    onSearch(q);

    Animated.timing(fadeAnim, {
      toValue: q.length ? 1 : 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const handleSearch = () => {};

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <TextInput
        style={[styles.input, getTextInputDirectionStyle(i18n)]}
        value={query}
        onChangeText={handleInput}
        placeholder={t('searchConversations')}
        placeholderTextColor={Colors.text + '80'}
        onSubmitEditing={handleSearch}
      />
      <Pressable onPress={handleSearch} style={styles.searchButton}>
        <Ionicons name='search' size={20} color={Colors.primary} />
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
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: spacing.md,
    padding: spacing.sm,
    color: Colors.text,
  },
  searchButton: { position: 'absolute', right: 24 },
});
