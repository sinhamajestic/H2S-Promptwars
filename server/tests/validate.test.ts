import { describe, it, expect, vi } from 'vitest';
import { validateRequest } from '../src/middleware/validate';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

describe('Validation Middleware', () => {
  const schema = z.object({
    body: z.object({
      message: z.string().min(1),
    }),
  });

  const middleware = validateRequest(schema);

  it('should call next() for valid requests', async () => {
    const req = { body: { message: 'hello' }, query: {}, params: {} } as Request;
    const res = {} as Response;
    const next = vi.fn() as NextFunction;

    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 for invalid requests', async () => {
    const req = { body: { message: '' }, query: {}, params: {} } as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
});
