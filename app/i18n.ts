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
      report: 'Report',
      provideFeedback: 'Provide feedback',
      feedbackPlaceholder:
        'What was the issue with the response? How could it be improved?',
      harmfulContent: 'This is harmful/unsafe',
      incorrectContent: "This isn't true",
      unhelpfulContent: "This isn't helpful",
      submit: 'Submit',
      reportSubmitted: 'Report submitted successfully',
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
      report: 'إبلاغ',
      provideFeedback: 'تقديم ملاحظات',
      feedbackPlaceholder: 'ما هي المشكلة في الرد؟ كيف يمكن تحسينه؟',
      harmfulContent: 'هذا محتوى ضار/غير آمن',
      incorrectContent: 'هذا غير صحيح',
      unhelpfulContent: 'هذا غير مفيد',
      submit: 'إرسال',
      reportSubmitted: 'تم إرسال التقرير بنجاح',
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
export const init = () => {};

export default i18n;
