import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-4707665982612066/4427661755';

export const AdBanner = () => (
  <View style={styles.container}>
    {Platform.OS === 'android' && (
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={
          {
            // requestNonPersonalizedAdsOnly: true,
          }
        }
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 0,
  },
});
