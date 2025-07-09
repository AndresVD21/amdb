import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);


export default router;
