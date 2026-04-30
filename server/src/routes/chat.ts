import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate.js';
import { callGemini } from '../services/gemini.js';
import { apiLimiter } from '../middleware/rateLimit.js';

export const chatRouter = Router();

const chatSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message is too long'),
  }),
});

chatRouter.post('/', apiLimiter, validateRequest(chatSchema), async (req, res) => {
  try {
    const { message } = req.body;
    const responseText = await callGemini(message);
    res.json({ response: responseText });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});
