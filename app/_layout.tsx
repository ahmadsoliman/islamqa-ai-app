import { Stack } from 'expo-router';
import * as myi18n from './i18n';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { I18nManager, Platform } from 'react-native';

import { AdBanner } from '../components/AdBanner';
import { usePurchases } from '../services/purchases';
import { useEffect, useState } from 'react';
import { preparePlayIntegrity } from '@/services/integrity';
import { Ump } from 'google-ump-react-native';
import { checkAppVersion } from '@/services/androidVersion';

const GOOGLE_CLOUD_PROJECT_NUMBER = '617383767131';

export default function RootLayout() {
  myi18n.init();
  const { i18n, t } = useTranslation();
  const { hasRemovedAds } = usePurchases();
  const [canShowAds, setCanShowAds] = useState(false);

  useEffect(() => {
    I18nManager.allowRTL(i18n.dir() === 'rtl');
    I18nManager.forceRTL(i18n.dir() === 'rtl');

    if (Platform.OS === 'android') checkAppVersion(t);

    // Ump.reset();
    const initMobileAds = async () => {
      if ((await Ump.requestInfoUpdate()).canRequestAds) {
        setCanShowAds(true);
      }
    };
    initMobileAds();

    preparePlayIntegrity(GOOGLE_CLOUD_PROJECT_NUMBER);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackButtonMenuEnabled: false,
        }}
      />
      {!hasRemovedAds && canShowAds && <AdBanner />}
    </I18nextProvider>
  );
}
