import { GoogleGenerativeAI } from '@google/generative-ai';
import { systemPrompt } from '../prompts/system-prompt.js';

// Initialize the client. Relies on GEMINI_API_KEY being set in process.env
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const callGemini = async (userMessage: string) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.2, // Low temperature for factual, procedural answers
      }
    });

    return response.response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate response from assistant.');
  }
};
