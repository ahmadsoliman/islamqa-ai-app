export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string | null;
  messages: Message[];
  lastUpdated: Date;
  isTouched: boolean;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function createInitialMessage(): Message {
  return {
    id: Date.now().toString(),
    text: `
مرحباً بك! أنا شيخ مسلم متخصص في الإجابة على الأسئلة الدينية وتقديم الفتاوى. يمكنني مساعدتك في المجالات التالية:

  🕌 العقيدة والتوحيد
  🤲 العبادات والطهارة
  💰 المعاملات المالية
  📖 الأحكام الشرعية
  🤝 الأخلاق والآداب
  👪 شؤون الأسرة والزواج
  📖 تفسير القرآن والحديث
  🤔 وغيرها من المواضيع الإسلامية

تفضل بطرح سؤالك، وسأبحث في الفتاوى المعتمدة لأقدم لك الإجابة المناسبة وفق الشريعة الإسلامية.`,
    sender: 'bot',
    timestamp: new Date(),
  };
}
