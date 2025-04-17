
import express from 'express';
import * as rfqController from '../controllers/rfqController.js';
import * as authMiddleware from '../middleware/auth.js';
const router = express.Router();

// Protect all RFQ routes
router.use(authMiddleware.protect);

// Routes for purchasers
router.post('/', authMiddleware.restrictTo('purchaser'), rfqController.createRFQ);
router.get('/my-rfqs', authMiddleware.restrictTo('purchaser'), rfqController.getMyRFQs);
router.patch('/:id', authMiddleware.restrictTo('purchaser'), rfqController.updateRFQ);
router.delete('/:id', authMiddleware.restrictTo('purchaser'), rfqController.deleteRFQ);
router.post('/:id/invite', authMiddleware.restrictTo('purchaser'), rfqController.inviteSuppliers);
router.post('/:id/publish', authMiddleware.restrictTo('purchaser'), rfqController.publishRFQ);
router.post('/:id/close', authMiddleware.restrictTo('purchaser'), rfqController.closeRFQ);
router.post('/:id/version', authMiddleware.restrictTo('purchaser'), rfqController.createNewVersion);
router.post('/:id/bid-round', authMiddleware.restrictTo('purchaser'), rfqController.startBidRound);

// Routes for suppliers
router.get('/available', authMiddleware.restrictTo('supplier'), rfqController.getAvailableRFQs);
router.get('/:id', rfqController.getRFQById);

export default router;
