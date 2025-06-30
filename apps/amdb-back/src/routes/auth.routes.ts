import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

// ejemplo de ruta protegida
router.get('/auth/profile', authenticateJWT, (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
