import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = 'skoll';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
};
