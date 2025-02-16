import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import { I18nManager } from 'react-native';

export default function RootLayout() {
  const { i18n } = useTranslation();

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
    </I18nextProvider>
  );
}
