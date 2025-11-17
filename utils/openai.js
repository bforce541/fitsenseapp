import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const askOpenAI = async (question) => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Please provide a concise fitness/health answer to this question (max 200 words): ${question}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300, // Roughly 200 words
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0]?.message?.content || 'No response received.';

    // Trim to approximately 200 words
    const words = answer.split(' ');
    const trimmedAnswer = words.slice(0, 200).join(' ');

    return trimmedAnswer;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message || 'Failed to get AI response. Please check your API key.'
    );
  }
};

