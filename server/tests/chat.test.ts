import { describe, it, expect, vi, beforeEach } from 'vitest';
import { chatRouter } from '../src/routes/chat';
import express from 'express';
import request from 'supertest';
import * as geminiService from '../src/services/gemini';

vi.mock('../src/services/gemini', () => ({
  callGemini: vi.fn(),
}));

describe('Chat Route', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/chat', chatRouter);
    vi.clearAllMocks();
  });

  it('should return a response from Gemini', async () => {
    const mockResponse = 'Hello from Gemini! Verify with your official election authority: https://vote.gov';
    vi.mocked(geminiService.callGemini).mockResolvedValue(mockResponse);

    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'How do I vote?' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ response: mockResponse });
    expect(geminiService.callGemini).toHaveBeenCalledWith('How do I vote?');
  });

  it('should return 400 if message is missing', async () => {
    const res = await request(app).post('/api/chat').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation failed');
  });
});
