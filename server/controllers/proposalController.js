
const Proposal = require('../models/Proposal');
const RFQ = require('../models/RFQ');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Submit a new proposal
exports.submitProposal = async (req, res) => {
  try {
    const { rfqId, price, deliveryDate, description, documents } = req.body;
    
    // Check if RFQ exists and is published
    const rfq = await RFQ.findById(rfqId);
    
    if (!rfq) {
      return res.status(404).json({
        status: 'fail',
        message: 'RFQ not found'
      });
    }
    
    if (rfq.status !== 'published') {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot submit proposal to RFQ in "${rfq.status}" status`
      });
    }
    
    // Check if supplier is invited (if there are invited suppliers)
    if (
      rfq.invitedSuppliers.length > 0 && 
      !rfq.invitedSuppliers.some(supplier => supplier.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not invited to submit a proposal for this RFQ'
      });
    }
    
    // Check if supplier already submitted a proposal
    const existingProposal = await Proposal.findOne({
      rfq: rfqId,
      supplier: req.user._id
    });
    
    if (existingProposal) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already submitted a proposal for this RFQ'
      });
    }
    
    // Create new proposal
    const newProposal = await Proposal.create({
      rfq: rfqId,
      supplier: req.user._id,
      price,
      deliveryDate: new Date(deliveryDate),
      description,
      documents
    });
    
    // Get purchaser details to send notification
    const purchaser = await User.findById(rfq.createdBy);
    
    // Send email notification to purchaser
    try {
      await sendEmail({
        email: purchaser.email,
        subject: `New Proposal Received for "${rfq.title}"`,
        message: `
          Dear ${purchaser.fullName},
          
          A new proposal has been submitted for your RFQ "${rfq.title}" by ${req.user.company}.
          
          Please log in to your account to review the details.
          
          Thank you,
          ProcureFlow Team
        `
      });
    } catch (err) {
      console.error(`Failed to send email to ${purchaser.email}:`, err);
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        proposal: newProposal
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get proposals submitted by the logged-in supplier
exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ supplier: req.user._id })
      .populate('rfq', 'title category budget deadline status')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: proposals.length,
      data: {
        proposals
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get proposals for a specific RFQ
exports.getProposalsByRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.rfqId);
    
    if (!rfq) {
      return res.status(404).json({
        status: 'fail',
        message: 'RFQ not found'
      });
    }
    
    // Check if the user is the creator of this RFQ
    if (rfq.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view proposals for this RFQ'
      });
    }
    
    const proposals = await Proposal.find({ rfq: req.params.rfqId })
      .populate('supplier', 'fullName company email phone')
      .sort({ price: 1 });
    
    res.status(200).json({
      status: 'success',
      results: proposals.length,
      data: {
        proposals
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a specific proposal by ID
exports.getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('rfq')
      .populate('supplier', 'fullName company email phone');
    
    if (!proposal) {
      return res.status(404).json({
        status: 'fail',
        message: 'Proposal not found'
      });
    }
    
    // Check if the user has access to this proposal
    if (
      req.user.userRole === 'purchaser' && proposal.rfq.createdBy.toString() !== req.user._id.toString() ||
      req.user.userRole === 'supplier' && proposal.supplier._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this proposal'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        proposal
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update a proposal
exports.updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('rfq');
    
    if (!proposal) {
      return res.status(404).json({
        status: 'fail',
        message: 'Proposal not found'
      });
    }
    
    // Check if the user is the creator of this proposal
    if (proposal.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this proposal'
      });
    }
    
    // Check if RFQ is still published
    if (proposal.rfq.status !== 'published') {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot update proposal for RFQ in "${proposal.rfq.status}" status`
      });
    }
    
    // Check if proposal is not accepted or rejected
    if (proposal.status !== 'pending') {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot update proposal in "${proposal.status}" status`
      });
    }
    
    const updatedProposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        proposal: updatedProposal
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete a proposal
exports.deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('rfq');
    
    if (!proposal) {
      return res.status(404).json({
        status: 'fail',
        message: 'Proposal not found'
      });
    }
    
    // Check if the user is the creator of this proposal
    if (proposal.supplier.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this proposal'
      });
    }
    
    // Check if RFQ is still published
    if (proposal.rfq.status !== 'published') {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot delete proposal for RFQ in "${proposal.rfq.status}" status`
      });
    }
    
    // Check if proposal is not accepted
    if (proposal.status === 'accepted') {
      return res.status(400).json({
        status: 'fail',
        message: 'Cannot delete an accepted proposal'
      });
    }
    
    await Proposal.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update proposal status (for purchasers)
exports.updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid status (pending, accepted, or rejected)'
      });
    }
    
    const proposal = await Proposal.findById(req.params.id)
      .populate('rfq')
      .populate('supplier');
    
    if (!proposal) {
      return res.status(404).json({
        status: 'fail',
        message: 'Proposal not found'
      });
    }
    
    // Check if the user is the creator of the RFQ
    if (proposal.rfq.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to update this proposal status'
      });
    }
    
    // Update proposal status
    proposal.status = status;
    await proposal.save();
    
    // If accepting a proposal, update RFQ status to 'awarded' and reject other proposals
    if (status === 'accepted') {
      await RFQ.findByIdAndUpdate(proposal.rfq._id, { status: 'awarded' });
      
      // Reject all other proposals for this RFQ
      await Proposal.updateMany(
        { 
          rfq: proposal.rfq._id,
          _id: { $ne: proposal._id }
        },
        { status: 'rejected' }
      );
      
      // Notify all suppliers
      const otherProposals = await Proposal.find({
        rfq: proposal.rfq._id,
        _id: { $ne: proposal._id }
      }).populate('supplier');
      
      // Notify accepted supplier
      try {
        await sendEmail({
          email: proposal.supplier.email,
          subject: `Congratulations! Your proposal for "${proposal.rfq.title}" has been accepted`,
          message: `
            Dear ${proposal.supplier.fullName},
            
            We are pleased to inform you that your proposal for the RFQ "${proposal.rfq.title}" has been accepted.
            
            Please log in to your account for further details.
            
            Thank you,
            ProcureFlow Team
          `
        });
      } catch (err) {
        console.error(`Failed to send email to ${proposal.supplier.email}:`, err);
      }
      
      // Notify rejected suppliers
      for (const rejectedProposal of otherProposals) {
        try {
          await sendEmail({
            email: rejectedProposal.supplier.email,
            subject: `Update on your proposal for "${proposal.rfq.title}"`,
            message: `
              Dear ${rejectedProposal.supplier.fullName},
              
              We regret to inform you that your proposal for the RFQ "${proposal.rfq.title}" has not been selected.
              
              We appreciate your participation and hope to work with you in the future.
              
              Thank you,
              ProcureFlow Team
            `
          });
        } catch (err) {
          console.error(`Failed to send email to ${rejectedProposal.supplier.email}:`, err);
        }
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        proposal
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
