import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { DebugGeography, Ump } from 'google-ump-react-native';
import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

import { Colors, fontSize, spacing } from '../constants/Colors';

export const PrivacySettings: React.FC<{}> = ({}) => {
  const { t } = useTranslation();
  const [isConsentFormAvailable, setIsConsentFormAvailable] = useState(false);

  async function showConsentForm() {
    if (isConsentFormAvailable) {
      const { status, canRequestAds } =
        await AdsConsent.showPrivacyOptionsForm();

      // Handle the updated consent status as needed
      Toast.show({
        type: 'success',
        text1: t('privacyChanged'),
        visibilityTime: 2000,
      });
    }
  }

  useEffect(() => {
    // You can find your test device id in the logs
    const TEST_DEVICE_ID = 'c6c6c8a5-9441-4fae-b800-bdc4e5897f3b';

    const setupConsentForm = async () => {
      await Ump.requestInfoUpdate({
        debugSettings: {
          debugGeography: DebugGeography.EEA,
          testDeviceIdentifiers: [TEST_DEVICE_ID],
        },
      });

      const { canRequestAds, isConsentFormAvailable } =
        await Ump.loadAndShowConsentFormIfRequired();

      if (canRequestAds) {
        await mobileAds().initialize();
      }

      if (isConsentFormAvailable) {
        setIsConsentFormAvailable(true);
      }
    };

    setupConsentForm();

    if (Ump.getConsentInformation().canRequestAds) {
      // initialize Mobile Ads SDK
      mobileAds().initialize();
    }
  }, []);

  return (
    <View>
      {isConsentFormAvailable && (
        <Pressable onPress={showConsentForm} style={styles.container}>
          <Text style={[styles.text]}>{t('showPrivacyForm')}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: fontSize.regular,
    color: Colors.text,
  },
});
