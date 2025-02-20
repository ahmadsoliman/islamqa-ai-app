import { Stack } from 'expo-router';
import * as myi18n from './i18n';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { I18nManager } from 'react-native';

import { AdBanner } from '../components/AdBanner';
import { usePurchases } from '../services/purchases';

export default function RootLayout() {
  myi18n.init();
  const { i18n } = useTranslation();
  const { isPro } = usePurchases();

  I18nManager.allowRTL(i18n.dir() === 'rtl');
  I18nManager.forceRTL(i18n.dir() === 'rtl');

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
