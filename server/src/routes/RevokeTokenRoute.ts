import express from 'express';
import { revokeToken } from '../utils/TokenUtils';

const router = express.Router();

router.post('/', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token non fourni' });
  }
  revokeToken(token);
  return res.status(200).json({ message: 'Token révoqué avec succès' });
});

export default router;
