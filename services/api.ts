const API_URL = 'https://islamqaai.pythonanywhere.com/api';

export const sendMessage = async (
  message: string,
  chatId: string,
  userId: string
) => {
  try {
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
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
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
    const response = await fetch(API_URL + '/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: feedback.message,
        issue: feedback.issue,
        reasons: feedback.reasons,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit report');
    }
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};
