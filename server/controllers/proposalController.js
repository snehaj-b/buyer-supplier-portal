
const Proposal = require('../models/Proposal');
const RFQ = require('../models/RFQ');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Submit a new proposal
exports.submitProposal = async (req, res) => {
  try {
    const { 
      rfqId, price, deliveryDate, description, documents, 
      itemizedQuote, termsAccepted, bidRound 
    } = req.body;
    
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
    
    // Check if supplier already submitted a proposal for this bid round
    const existingProposal = await Proposal.findOne({
      rfq: rfqId,
      supplier: req.user._id,
      bidRound: bidRound || 1
    });
    
    let newProposal;
    
    if (existingProposal) {
      // Create a new version of the proposal
      newProposal = await Proposal.create({
        rfq: rfqId,
        supplier: req.user._id,
        price,
        deliveryDate: new Date(deliveryDate),
        description,
        itemizedQuote: itemizedQuote || [],
        termsAccepted: termsAccepted || false,
        documents,
        bidRound: bidRound || 1,
        version: existingProposal.version + 1
      });
    } else {
      // Create new proposal
      newProposal = await Proposal.create({
        rfq: rfqId,
        supplier: req.user._id,
        price,
        deliveryDate: new Date(deliveryDate),
        description,
        itemizedQuote: itemizedQuote || [],
        termsAccepted: termsAccepted || false,
        documents,
        bidRound: bidRound || 1,
        version: 1
      });
    }
    
    // Get purchaser details to send notification
    const purchaser = await User.findById(rfq.createdBy);
    
    // Send email notification to purchaser
    try {
      await sendEmail({
        email: purchaser.email,
        subject: `New Proposal Received for "${rfq.title}" (${rfq.rfqNumber} v${rfq.version})`,
        message: `
          Dear ${purchaser.fullName},
          
          A new proposal (version ${newProposal.version}) has been submitted for your RFQ "${rfq.title}" (${rfq.rfqNumber} v${rfq.version}) by ${req.user.company}.
          
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
    // Get the latest version of each proposal
    const proposals = await Proposal.find({ supplier: req.user._id })
      .populate('rfq', 'title category budget deadline status rfqNumber version')
      .sort({ createdAt: -1 });
    
    // Group proposals by RFQ and bid round to get only the latest version
    const groupedProposals = proposals.reduce((acc, proposal) => {
      const key = `${proposal.rfq._id}-${proposal.bidRound}`;
      if (!acc[key] || proposal.version > acc[key].version) {
        acc[key] = proposal;
      }
      return acc;
    }, {});
    
    const latestProposals = Object.values(groupedProposals);
    
    res.status(200).json({
      status: 'success',
      results: latestProposals.length,
      data: {
        proposals: latestProposals
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all versions of a proposal
exports.getProposalVersions = async (req, res) => {
  try {
    const mainProposal = await Proposal.findById(req.params.id);
    
    if (!mainProposal) {
      return res.status(404).json({
        status: 'fail',
        message: 'Proposal not found'
      });
    }
    
    // Check if the user has access to this proposal
    if (
      (req.user.userRole === 'supplier' && mainProposal.supplier.toString() !== req.user._id.toString()) || 
      (req.user.userRole === 'purchaser' && 
        !(await RFQ.exists({ _id: mainProposal.rfq, createdBy: req.user._id }))
      )
    ) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this proposal'
      });
    }
    
    // Get all versions of the proposal
    const proposalVersions = await Proposal.find({
      rfq: mainProposal.rfq,
      supplier: mainProposal.supplier,
      bidRound: mainProposal.bidRound
    }).sort({ version: 1 });
    
    res.status(200).json({
      status: 'success',
      results: proposalVersions.length,
      data: {
        proposalVersions
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
    
    // Get all proposals for this RFQ, grouped by supplier and bid round
    const allProposals = await Proposal.find({ rfq: req.params.rfqId })
      .populate('supplier', 'fullName company email phone')
      .sort({ bidRound: -1, price: 1 });
    
    // Group by supplier and bid round to get only the latest version
    const groupedProposals = allProposals.reduce((acc, proposal) => {
      const key = `${proposal.supplier._id}-${proposal.bidRound}`;
      if (!acc[key] || proposal.version > acc[key].version) {
        acc[key] = proposal;
      }
      return acc;
    }, {});
    
    const latestProposals = Object.values(groupedProposals);
    
    res.status(200).json({
      status: 'success',
      results: latestProposals.length,
      data: {
        proposals: latestProposals
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
    
    // Create a new version instead of updating
    const newProposal = await Proposal.create({
      ...req.body,
      rfq: proposal.rfq._id,
      supplier: proposal.supplier,
      bidRound: proposal.bidRound,
      version: proposal.version + 1
    });
    
    res.status(200).json({
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
          subject: `Congratulations! Your proposal for "${proposal.rfq.title}" (${proposal.rfq.rfqNumber} v${proposal.rfq.version}) has been accepted`,
          message: `
            Dear ${proposal.supplier.fullName},
            
            We are pleased to inform you that your proposal for the RFQ "${proposal.rfq.title}" (${proposal.rfq.rfqNumber} v${proposal.rfq.version}) has been accepted.
            
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
            subject: `Update on your proposal for "${proposal.rfq.title}" (${proposal.rfq.rfqNumber} v${proposal.rfq.version})`,
            message: `
              Dear ${rejectedProposal.supplier.fullName},
              
              We regret to inform you that your proposal for the RFQ "${proposal.rfq.title}" (${proposal.rfq.rfqNumber} v${proposal.rfq.version}) has not been selected.
              
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

// Compare proposals for a specific RFQ
exports.compareProposals = async (req, res) => {
  try {
    const { proposalIds } = req.body;
    
    if (!proposalIds || !Array.isArray(proposalIds) || proposalIds.length < 2) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide at least two proposal IDs to compare'
      });
    }
    
    const proposals = await Proposal.find({
      _id: { $in: proposalIds }
    }).populate('supplier', 'fullName company email phone');
    
    if (proposals.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No proposals found with the provided IDs'
      });
    }
    
    // Check if the user is the creator of the RFQ
    const rfqId = proposals[0].rfq;
    const rfq = await RFQ.findById(rfqId);
    
    if (rfq.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to compare these proposals'
      });
    }
    
    res.status(200).json({
      status: 'success',
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
