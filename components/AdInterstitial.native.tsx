import React from 'react';
import { useEffect } from 'react';
import {
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

const interstitialAdUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-4707665982612066/6559001076';

export const AdInterstitial: React.FC<{
  showAd: boolean;
}> = ({ showAd }) => {
  useEffect(() => {
    if (showAd) {
      const interstitial =
        InterstitialAd.createForAdRequest(interstitialAdUnitId);
      const unsubscribe = interstitial.addAdEventListener(
        AdEventType.LOADED,
        () => {
          interstitial.show();
        }
      );
      interstitial.load();
      return () => unsubscribe();
    }
  }, [showAd]);

  return <> </>;
};
