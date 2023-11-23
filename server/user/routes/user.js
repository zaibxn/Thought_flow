// user/routes/user.js
import express from 'express';
import requireAuth from '../../auth/middleware/auth.js';
import { getUserProfile } from '../controllers/user.js';

const router = express.Router();

router.get('/profile', requireAuth, getUserProfile);

export default router;
