import React from 'react';
import { I18nManager, Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { getTextDirectionStyle } from '../utils/styles';
import { setLanguage } from '@/utils/storage';

export const LanguageSwitcher: React.FC<{ onLanguageChange: () => void }> = ({
  onLanguageChange,
}) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);

    I18nManager.allowRTL(i18n.dir() === 'rtl');
    I18nManager.forceRTL(i18n.dir() === 'rtl');

    setLanguage(newLang);
    onLanguageChange();
  };

  return (
    <Pressable onPress={toggleLanguage} style={styles.container}>
      <Text style={[styles.text, getTextDirectionStyle(i18n)]}>
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
    fontWeight: 'bold',
    color: Colors.text,
  },
});
