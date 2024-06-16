import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import client from '~services/redis';

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes interval
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  delayAfter: 1,
  delayMs: 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  store: new RedisStore({
    sendCommand: (...args) => client.call(...args),
  }),
  keyGenerator: (req, res) => {
    return req.ip;
  },
});
