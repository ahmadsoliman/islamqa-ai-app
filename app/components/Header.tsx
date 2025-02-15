import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, fontSize, spacing } from '../constants/Colors';

interface HeaderProps {
  onMenuPress: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuPress, title }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onMenuPress} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color={Colors.text} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
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
    marginLeft: spacing.sm,
    flex: 1,
  },
});
