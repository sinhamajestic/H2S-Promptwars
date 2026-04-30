import { Router } from 'express';
import { apiLimiter } from '../middleware/rateLimit.js';

export const placesRouter = Router();

placesRouter.get('/config', apiLimiter, (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Maps API key is not configured on the server.' });
  }
  // Return the key safely over the secure proxy.
  res.json({ apiKey });
});
