import express from 'express';
import { register, login, checkUsername, checkEmail } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/check-username/:username', checkUsername);
router.post('/check-email/:email', checkEmail);

export default router;
