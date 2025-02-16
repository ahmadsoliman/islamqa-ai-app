import { i18n } from 'i18next';
import { TextStyle } from 'react-native';

export const getTextDirectionStyle = (i18n: i18n): TextStyle => {
  return {
    textAlign: i18n.dir() === 'rtl' ? 'right' : 'left',
    direction: i18n.dir(),
  };
};
