
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Protect all user routes
router.use(authMiddleware.protect);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/suppliers', authMiddleware.restrictTo('purchaser'), userController.getSuppliers);

module.exports = router;
