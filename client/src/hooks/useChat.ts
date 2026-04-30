import { useState, useCallback } from 'react';
import { useUserContext } from '../store/userContext';
import { useTranslation } from './useTranslation';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useUserContext();
  const { translateText } = useTranslation();

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      
      let assistantContent = data.response;
      
      // Translate the incoming message if language is not English
      if (language !== 'en') {
        assistantContent = await translateText(assistantContent, language);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      let errorMsg = 'Error connecting to the server.';
      if (language !== 'en') {
        errorMsg = await translateText(errorMsg, language);
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  }, [language, translateText]);

  return { messages, isLoading, sendMessage };
};
