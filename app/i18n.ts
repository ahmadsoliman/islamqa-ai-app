import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      newConversation: 'New conversation',
      searchConversations: 'Search conversations...',
      deleteConversation: 'Delete Conversation',
      deleteConfirm: 'Are you sure you want to delete this conversation?',
      cancel: 'Cancel',
      delete: 'Delete',
      copy: 'Copy',
      share: 'Share',
      copied: 'Copied to clipboard',
      searchMessages: 'Search messages...',
      islamqaAI: 'IslamQA AI',
      apiErrorMessage: 'Sorry, I could not process your request.',
      promptPlaceholder: 'Type your question...',
      copyMessageOptions: 'Message options',
    },
  },
  ar: {
    translation: {
      newConversation: 'محادثة جديدة',
      searchConversations: 'ابحث في المحادثات...',
      deleteConversation: 'حذف المحادثة',
      deleteConfirm: 'هل أنت متأكد أنك تريد حذف هذه المحادثة؟',
      cancel: 'إلغاء',
      delete: 'حذف',
      copy: 'نسخ',
      share: 'مشاركة',
      copied: 'تم النسخ إلى الحافظة',
      searchMessages: 'ابحث في الرسائل...',
      islamqaAI: 'الإسلام سؤال وجواب AI',
      apiErrorMessage: 'عذرًا، لم أتمكن من معالجة طلبك.',
      promptPlaceholder: 'اكتب سؤالك...',
      copyMessageOptions: 'خيارات الرسالة',
    },
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (lang: 'ar' | 'en') => {
  i18n.changeLanguage(lang);
};

export default i18n;
