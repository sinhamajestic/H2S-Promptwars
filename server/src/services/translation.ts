import { v2 } from '@google-cloud/translate';

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

let translateClient: v2.Translate | null = null;
if (apiKey) {
  translateClient = new v2.Translate({ key: apiKey });
}

export const translateText = async (text: string, targetLanguage: string) => {
  if (!translateClient) {
    console.warn('Translate client not initialized. Ensure GOOGLE_TRANSLATE_API_KEY is set.');
    return text; // Fallback to original text
  }

  try {
    const [translations] = await translateClient.translate(text, targetLanguage);
    return Array.isArray(translations) ? translations[0] : translations;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Fallback to original text on failure
  }
};
