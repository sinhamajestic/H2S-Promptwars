import { useCallback } from 'react';

export const useTranslation = () => {
  const translateText = useCallback(async (text: string, targetLanguage: string) => {
    if (!text || !targetLanguage || targetLanguage === 'en') return text;

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage }),
      });
      
      if (!res.ok) throw new Error('Translation failed');
      
      const data = await res.json();
      return data.translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  return { translateText };
};
