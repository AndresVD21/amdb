import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite,
  updateFavoriteStatus
} from '../controllers/favorites.controller';

const router = Router();

// All routes are protected with authenticateJWT middleware
router.post('/', authenticateJWT, addToFavorites);
router.delete('/:malId', authenticateJWT, removeFromFavorites);
router.get('/', authenticateJWT, getFavorites);
router.get('/:malId/check', authenticateJWT, checkFavorite);
router.patch('/:malId/status', authenticateJWT, updateFavoriteStatus);

export default router;
