import rateLimit from 'express-rate-limit';

const maxRequests = process.env.RATE_LIMIT_PER_MIN ? parseInt(process.env.RATE_LIMIT_PER_MIN, 10) : 20;

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: maxRequests,
  message: { error: `Too many requests, please try again after 1 minute.` },
});
