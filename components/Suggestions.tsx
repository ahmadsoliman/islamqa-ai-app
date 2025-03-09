import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, spacing } from '../constants/Colors';
import { useTranslation } from 'react-i18next';
import { ARABIC_SUGGESTIONS, ENGLISH_SUGGESTIONS } from '@/app/i18n';

interface SuggestionsProps {
  onSelect: (text: string) => void;
  suggestions?: string[];
}

const Suggestions = ({ onSelect, suggestions }: SuggestionsProps) => {
  const { i18n } = useTranslation();

  suggestions =
    suggestions || i18n.language === 'ar'
      ? ARABIC_SUGGESTIONS
      : ENGLISH_SUGGESTIONS;

  return (
    <View style={styles.container}>
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={index}
          style={styles.button}
          onPress={() => onSelect(suggestion)}
        >
          <Text style={styles.text}>{suggestion}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    paddingInline: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'scroll',
  },
  button: {
    backgroundColor: Colors.secondaryBackground,
    padding: 12,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.xl,
    // width: '100%',
    // height: spacing.xl,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Suggestions;
