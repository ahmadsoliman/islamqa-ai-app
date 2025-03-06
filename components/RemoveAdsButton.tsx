import React from 'react';
import { Image } from 'react-native';

import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { useTranslation } from 'react-i18next';

interface RemoveAdsButtonProps {
  onPress: () => void;
  loading: boolean;
  priceString: string;
}

export const RemoveAdsButton: React.FC<RemoveAdsButtonProps> = ({
  onPress,
  loading,
  priceString,
}) => {
  const { t } = useTranslation();

  return (
    <Pressable style={styles.container} onPress={onPress} disabled={loading}>
      <Image
        source={require('../assets/images/remove-ads-icon-64.png')}
        style={styles.icon}
      />
      <Text style={styles.text}>
        {loading ? t('loading') : `${t('removeAds')}`}
      </Text>
      <Text style={styles.price}>{loading ? '' : `(${priceString})`}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginRight: spacing.md,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  text: {
    color: Colors.primary,
    fontSize: fontSize.large,
    fontWeight: 'bold',
  },
  price: {
    color: Colors.text,
    fontSize: fontSize.small,
  },
  icon: {
    width: 28,
    height: 28,
    marginHorizontal: spacing.xs,
  },
});
