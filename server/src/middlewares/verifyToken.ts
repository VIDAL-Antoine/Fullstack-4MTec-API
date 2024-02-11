import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret_key } from '../config';
import { isTokenRevoked } from '../utils/TokenUtils';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  if (isTokenRevoked(token)) {
    return res.status(401).json({ message: 'Le token fourni est révoqué. Veuillez en utiliser un autre.' });
  }

  jwt.verify(token, jwt_secret_key, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide' });
    }
    
    (req as any).userId = (decoded as { userId: string }).userId;
    next();
  });
};
