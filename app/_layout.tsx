import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';

export default function RootLayout() {
  const { i18n } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackButtonMenuEnabled: false,
          // direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
        }}
      />
    </I18nextProvider>
  );
}
