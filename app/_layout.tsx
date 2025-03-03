import { Stack } from 'expo-router';
import * as myi18n from './i18n';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { I18nManager } from 'react-native';

import { AdBanner } from '../components/AdBanner';
import { usePurchases } from '../services/purchases';
import { useEffect } from 'react';
import { preparePlayIntegrity } from '@/services/integrity';

const GOOGLE_CLOUD_PROJECT_NUMBER = '617383767131';

export default function RootLayout() {
  const { i18n } = useTranslation();
  const { isPro } = usePurchases();

  useEffect(() => {
    myi18n.init();

    I18nManager.allowRTL(i18n.dir() === 'rtl');
    I18nManager.forceRTL(i18n.dir() === 'rtl');

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
      {!isPro && <AdBanner />}
    </I18nextProvider>
  );
}
