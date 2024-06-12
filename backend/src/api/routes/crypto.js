import express from 'express';
const router = express.Router();
import { encrypt, decrypt } from '~utils/crypto';

router.post('/encrypt', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  const encrypted = encrypt(text);
  res.json({ encrypted });
});

router.post('/decrypt', (req, res) => {
  const { encrypted } = req.body;
  if (!encrypted) {
    return res.status(400).json({ error: 'Encrypted text is required' });
  }
  const decrypted = decrypt(encrypted);
  res.json({ decrypted });
});

export default router;
