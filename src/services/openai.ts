import axios from 'axios';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_TIMEOUT_MS = 15000;

export async function generateAssistance({ prompt, apiKey, abortSignal }: { prompt: string; apiKey: string; abortSignal?: AbortSignal }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const response = await axios.post(
      OPENAI_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You help citizens write clear, compassionate descriptions for assistance applications.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: abortSignal || controller.signal,
      }
    );
    const content = (response as any)?.data?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('No content returned');
    return content as string;
  } catch (err: any) {
    if (axios.isCancel(err)) throw new Error('Request cancelled');
    if (err?.name === 'CanceledError') throw new Error('Request timed out');
    throw new Error(err?.response?.data?.error?.message || err.message || 'OpenAI request failed');
  } finally {
    clearTimeout(timeout);
  }
}
