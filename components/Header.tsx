import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { useTranslation } from 'react-i18next';
import { getFlexDirectionStyle, getTextDirectionStyle } from '../utils/styles';

interface HeaderProps {
  onMenuPress: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress, title }) => {
  const { i18n } = useTranslation();

  return (
    <View style={[styles.container, getFlexDirectionStyle(i18n)]}>
      <Pressable onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name='menu' size={24} color={Colors.text} />
      </Pressable>
      <Text
        style={[styles.title, , getTextDirectionStyle(i18n)]}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.secondaryBackground,
  },
  menuButton: {
    padding: spacing.sm,
  },
  title: {
    fontSize: fontSize.medium,
    fontWeight: '500',
    color: Colors.text,
    marginHorizontal: spacing.sm,
    flex: 1,
  },
});
