import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation } from '../types/chat';

const STORAGE_KEY = 'islamqa_conversations';
const USER_ID_KEY = 'islamqa_user_id';

export const saveConversations = async (conversations: Conversation[]) => {
  try {
    const serialized = JSON.stringify(
      conversations.map((conv) => ({
        ...conv,
        messages: conv.messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        lastUpdated: conv.lastUpdated.toISOString(),
      }))
    );
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

export const loadConversations = async (): Promise<Conversation[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((conv: any) => ({
        ...conv,
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
        lastUpdated: new Date(conv.lastUpdated),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

export const getUserId = async (): Promise<string> => {
  try {
    let userId = await AsyncStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId =
        Math.random().toString(36).substring(2) + Date.now().toString(36);
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    console.error('Error with user ID:', error);
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
};
