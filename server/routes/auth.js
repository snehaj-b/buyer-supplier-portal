
import express from 'express';
import * as authController from '../controllers/authController.js';
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.get('/verify', authController.protect, authController.verifyToken);

export default router;
