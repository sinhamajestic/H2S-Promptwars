import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate.js';
import { getAuthUrl, getTokensFromCode, encryptToken, decryptToken, insertEvent } from '../services/calendar.js';

export const calendarRouter = Router();

calendarRouter.get('/auth', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

calendarRouter.get('/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    const tokens = await getTokensFromCode(code);
    const encrypted = encryptToken(tokens);
    
    // Set an HttpOnly cookie with the encrypted tokens
    res.cookie('calendar_session', encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Redirect back to the frontend
    res.redirect('/');
  } catch (error) {
    console.error('Error during calendar callback:', error);
    res.status(500).send('Authentication failed');
  }
});

const eventSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  }),
});

calendarRouter.post('/event', validateRequest(eventSchema), async (req, res) => {
  const sessionCookie = req.cookies?.calendar_session;
  
  if (!sessionCookie) {
    return res.status(401).json({ error: 'Unauthorized. Please connect your calendar first.' });
  }

  try {
    const tokens = decryptToken(sessionCookie);
    const result = await insertEvent(tokens, req.body);
    res.json({ success: true, eventLink: result.htmlLink });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Failed to create event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

calendarRouter.get('/status', (req, res) => {
  const sessionCookie = req.cookies?.calendar_session;
  try {
    if (sessionCookie) {
      decryptToken(sessionCookie);
      return res.json({ connected: true });
    }
  } catch (e) {
    // invalid token
  }
  return res.json({ connected: false });
});
