
import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authMiddleware from '../middleware/auth.js';
const router = express.Router();

// Protect all user routes
router.use(authMiddleware.protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/suppliers', authMiddleware.restrictTo('purchaser'), userController.getSuppliers);

export default router;
