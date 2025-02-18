import { i18n } from 'i18next';
import { Platform, TextStyle, ViewStyle } from 'react-native';

export const getTextDirectionStyle = (i18n: i18n): TextStyle => {
  return {
    textAlign: i18n.dir() === 'rtl' && Platform.OS === 'web' ? 'right' : 'left',
    direction: i18n.dir(),
  };
};

export const getTextInputDirectionStyle = (i18n: i18n): TextStyle => {
  return {
    textAlign: i18n.dir() === 'rtl' ? 'right' : 'left',
    direction: i18n.dir(),
  };
};

export const getFlexDirectionStyle = (i18n: i18n): ViewStyle => {
  return {
    flexDirection:
      i18n.dir() === 'rtl' && Platform.OS === 'web' ? 'row-reverse' : 'row',
  };
};
