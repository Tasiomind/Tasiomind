import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import client from '~services/redis';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes interval
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  store: new RedisStore({
    sendCommand: (...args) => client.call(...args),
  }),
  keyGenerator: (req, res) => {
    return req.ip;
  },
  delayMs: 0,
});

export default apiLimiter;
