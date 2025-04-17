
import express from 'express';
import * as proposalController from '../controllers/proposalController.js';
import * as authMiddleware from '../middleware/auth.js';
const router = express.Router();

// Protect all proposal routes
router.use(authMiddleware.protect);

// Routes for suppliers
router.post('/', authMiddleware.restrictTo('supplier'), proposalController.submitProposal);
router.get('/my-proposals', authMiddleware.restrictTo('supplier'), proposalController.getMyProposals);
router.get('/versions/:id', authMiddleware.restrictTo('supplier'), proposalController.getProposalVersions);
router.patch('/:id', authMiddleware.restrictTo('supplier'), proposalController.updateProposal);
router.delete('/:id', authMiddleware.restrictTo('supplier'), proposalController.deleteProposal);

// Routes for purchasers
router.get('/rfq/:rfqId', authMiddleware.restrictTo('purchaser'), proposalController.getProposalsByRFQ);
router.patch('/:id/status', authMiddleware.restrictTo('purchaser'), proposalController.updateProposalStatus);
router.post('/compare', authMiddleware.restrictTo('purchaser'), proposalController.compareProposals);

// Common routes
router.get('/:id', proposalController.getProposalById);

export default router;
