import { google, Auth } from 'googleapis';
import jwt from 'jsonwebtoken';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI || 'http://localhost:3001/api/calendar/callback'
);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev';

export const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
  });
};

export const getTokensFromCode = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

// Encrypt tokens before sending to client as a cookie
export const encryptToken = (tokens: Auth.Credentials) => {
  return jwt.sign(tokens, JWT_SECRET, { expiresIn: '1h' });
};

export const decryptToken = (encryptedToken: string): Auth.Credentials => {
  return jwt.verify(encryptedToken, JWT_SECRET) as Auth.Credentials;
};

export const insertEvent = async (tokens: Auth.Credentials, eventData: { title: string, date: string, description: string }) => {
  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const event = {
    summary: eventData.title,
    description: eventData.description,
    start: {
      date: eventData.date, // Format: 'YYYY-MM-DD'
    },
    end: {
      date: eventData.date,
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return response.data;
};
