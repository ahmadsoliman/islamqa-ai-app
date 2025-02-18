import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, fontSize, spacing } from '../constants/Colors';

interface RemoveAdsButtonProps {
  onPress: () => void;
  loading: boolean;
}

export const RemoveAdsButton: React.FC<RemoveAdsButtonProps> = ({
  onPress,
  loading,
}) => (
  <Pressable style={styles.container} onPress={onPress} disabled={loading}>
    <Text style={styles.text}>
      {loading ? 'Loading...' : 'Remove Ads ($1.99)'}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    margin: spacing.md,
  },
  text: {
    color: Colors.text,
    fontSize: fontSize.small,
    fontWeight: '500',
  },
});
