import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate.js';
import { translateText } from '../services/translation.js';
import { apiLimiter } from '../middleware/rateLimit.js';

export const translateRouter = Router();

const translateSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text cannot be empty'),
    targetLanguage: z.string().min(2, 'Invalid language code'),
  }),
});

translateRouter.post('/', apiLimiter, validateRequest(translateSchema), async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    const translatedText = await translateText(text, targetLanguage);
    res.json({ translation: translatedText });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
