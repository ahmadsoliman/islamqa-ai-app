const API_URL =
  'https://ahmadsoliman.app.n8n.cloud/webhook/2102e6c1-0ac3-41f1-9dd1-476b4f325b96';

export const sendMessage = async (message: string) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        first_name: 'User',
        last_name: '',
        user_id: '1',
        message_id: Date.now().toString(),
        chat_id: '1',
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
