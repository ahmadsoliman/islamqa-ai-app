import { getIntegrityToken } from '@/services/integrity';
import { Message } from '@/types/chat';

export const MAX_CONVERSATION_LENGTH = 6;
export const API_URL =
  'https://islamqaai-api-617383767131.europe-west3.run.app/api';
// export const API_URL = 'https://islamqaai.pythonanywhere.com/api';
// export const API_URL = 'http://192.168.0.100:5001/api';

export const sendMessage = async (
  message: string,
  chatId: string,
  userId: string,
  conversation: Message[] = []
) => {
  try {
    const integrityToken = await getIntegrityToken(API_URL);

    const response = await fetch(API_URL + '/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        first_name: 'User',
        last_name: '',
        user_id: userId,
        message_id: Date.now().toString(),
        chat_id: chatId,
        integrity_token: integrityToken,
        chat_history: conversation.slice(
          conversation.length - MAX_CONVERSATION_LENGTH
        ),
      }),
    });

    if (!response.ok) {
      throw new Error(
        'Network response was not ok: ' + (await response.json()).error
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const reportMessage = async (feedback: {
  message: string;
  issue: string;
  reasons: string[];
}) => {
  try {
    const integrityToken = await getIntegrityToken(API_URL);

    const response = await fetch(API_URL + '/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: feedback.message,
        issue: feedback.issue,
        reasons: feedback.reasons,
        integrity_token: integrityToken,
      }),
    });

    if (!response.ok) {
      throw new Error(
        'Failed to submit report: ' + (await response.json()).error
      );
    }
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};
