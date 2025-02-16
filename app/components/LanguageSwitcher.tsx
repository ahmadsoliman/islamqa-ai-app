import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, fontSize, spacing } from '../constants/Colors';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <Pressable onPress={toggleLanguage} style={styles.container}>
      <Text style={styles.text}>
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  text: {
    fontSize: fontSize.regular,
    color: Colors.text,
  },
});
