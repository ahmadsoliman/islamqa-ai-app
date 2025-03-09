import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, fontSize, spacing } from '../constants/Colors';
import { useTranslation } from 'react-i18next';

const LoadingComponent = () => {
  const { t } = useTranslation();
  const [loadingState, setLoadingState] = useState(0);
  const [threeSec, setThreeSec] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setLoadingState(1);
    }, 7000);

    const timer2 = setTimeout(() => {
      setLoadingState(2);
    }, 27000);

    let threeSecTimer: NodeJS.Timeout;
    const countSec = () => {
      setThreeSec((prev) => (prev + 1) % 4);
      if (threeSecTimer) clearTimeout(threeSecTimer);
      threeSecTimer = setTimeout(countSec, 800);
    };
    threeSecTimer = setTimeout(countSec, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(threeSecTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((i) => (
            <Text
              key={i}
              style={[styles.dot, { opacity: threeSec > i ? 1 : 0.2 }]}
            >
              •
            </Text>
          ))}
        </View>

        <Text style={styles.text}>
          {loadingState === 0 && t('loadingState0')}
          {loadingState === 1 && t('loadingState1')}
          {loadingState === 2 && t('loadingState2')}
        </Text>

        {loadingState === 2 && (
          <Text style={styles.subText}>{t('loadingState2Subtext')}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.sm,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  text: {
    marginTop: 0,
    fontSize: fontSize.medium,
    color: Colors.text,
  },
  subText: {
    marginTop: 8,
    fontSize: fontSize.small,
    color: Colors.secondary,
  },
  dotsContainer: {
    flexDirection: 'row',
    padding: 0,
    margin: 0,
  },
  dot: {
    fontSize: 24,
    color: Colors.primary,
    marginHorizontal: 4,
  },
});

export default LoadingComponent;
