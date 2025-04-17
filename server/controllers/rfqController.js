
const RFQ = require('../models/RFQ');
const User = require('../models/User');
const Proposal = require('../models/Proposal');
const sendEmail = require('../utils/email');

// Create a new RFQ
exports.createRFQ = async (req, res) => {
  try {
    const { 
      title, description, category, quantity, budget, deadline, 
      documents, items, terms, bidRounds 
    } = req.body;
    
    // Generate RFQ number
    const user = await User.findById(req.user._id);
    let rfqCount = user.rfqVersions.get('count') || 0;
    rfqCount++;
    
    // Update user's rfq count
    user.rfqVersions.set('count', rfqCount);
    await user.save({ validateBeforeSave: false });
    
    // Create RFQ number format: ORG-YYYY-COUNT
    const year = new Date().getFullYear();
    const orgPrefix = user.company.slice(0, 3).toUpperCase();
    const rfqNumber = `${orgPrefix}-${year}-${rfqCount.toString().padStart(3, '0')}`;
    
    const newRFQ = await RFQ.create({
      title,
      description,
      category,
      quantity,
      budget,
      deadline: new Date(deadline),
      status: 'draft',
      rfqNumber,
      version: 1,
      createdBy: req.user._id,
      organization: user.company,
      documents,
      items: items || [],
      terms: terms || [],
      bidRounds: bidRounds || []
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        rfq: newRFQ
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get RFQs created by the logged-in purchaser
exports.getMyRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: rfqs.length,
      data: {
        rfqs
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get RFQs available to the logged-in supplier
exports.getAvailableRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({
      status: 'published',
      $or: [
        { invitedSuppliers: { $in: [req.user._id] } },
        { invitedSuppliers: { $size: 0 } } // Public RFQs (no specific invites)
      ]
    }).sort({ deadline: 1 });
    
    res.status(200).json({
      status: 'success',
      results: rfqs.length,
      data: {
        rfqs
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get a specific RFQ by ID
exports.getRFQById = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id)
      .populate('createdBy', 'fullName company email')
      .populate('invitedSuppliers', 'fullName company email');
    
    if (!rfq) {
      return res.status(404).json({
        status: 'fail',
        message: 'RFQ not found'
      });
    }
    
    // Check if the user has access to this RFQ
    if (
      req.user.userRole === 'purchaser' && rfq.createdBy._id.toString() !== req.user._id.toString() ||
      req.user.userRole === 'supplier' && 
      rfq.status !== 'published' && 
      !rfq.invitedSuppliers.some(supplier => supplier._id.toString() === req.user._id.toString()) &&
      rfq.invitedSuppliers.length > 0
    ) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to access this RFQ'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        rfq
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update an RFQ
exports.updateRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    
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
        message: 'You do not have permission to update this RFQ'
      });
    }
    
    // Prevent updating published or closed RFQs
    if (rfq.status !== 'draft') {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot update RFQ in "${rfq.status}" status`
      });
    }
    
    const updatedRFQ = await RFQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        rfq: updatedRFQ
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Create new version of an RFQ
exports.createNewVersion = async (req, res) => {
  try {
    const originalRFQ = await RFQ.findById(req.params.id);
    
    if (!originalRFQ) {
      return res.status(404).json({
        status: 'fail',
        message: 'RFQ not found'
      });
    }
    
    // Check if the user is the creator of this RFQ
    if (originalRFQ.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to create a new version of this RFQ'
      });
    }
    
    // Create a new version
    const newVersion = originalRFQ.version + 1;
    
    // Create new RFQ with incremented version
    const newRFQ = new RFQ({
      ...originalRFQ.toObject(),
      _id: undefined,
      version: newVersion,
      status: 'draft',
      createdAt: Date.now()
    });
    
    await newRFQ.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        rfq: newRFQ
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Delete an RFQ
exports.deleteRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    
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
        message: 'You do not have permission to delete this RFQ'
      });
    }
    
    await RFQ.findByIdAndDelete(req.params.id);
    
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

// Invite suppliers to an RFQ
exports.inviteSuppliers = async (req, res) => {
  try {
    const { supplierIds } = req.body;
    
    if (!supplierIds || !Array.isArray(supplierIds)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide an array of supplier IDs'
      });
    }
    
    const rfq = await RFQ.findById(req.params.id);
    
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
        message: 'You do not have permission to invite suppliers to this RFQ'
      });
    }
    
    // Find the suppliers
    const suppliers = await User.find({
      _id: { $in: supplierIds },
      userRole: 'supplier'
    });
    
    if (suppliers.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No valid suppliers found'
      });
    }
    
    // Add suppliers to RFQ
    rfq.invitedSuppliers = [...new Set([...rfq.invitedSuppliers, ...suppliers.map(s => s._id)])];
    await rfq.save();
    
    // Send email notifications to suppliers
    for (const supplier of suppliers) {
      try {
        await sendEmail({
          email: supplier.email,
          subject: `You've been invited to submit a proposal for "${rfq.title}" (${rfq.rfqNumber} v${rfq.version})`,
          message: `
            Dear ${supplier.fullName},
            
            You have been invited to submit a proposal for the Request for Quotation (RFQ) titled "${rfq.title}" (${rfq.rfqNumber} v${rfq.version}) by ${req.user.company}.
            
            Please log in to your account to view the details and submit your proposal.
            
            Thank you,
            ProcureFlow Team
          `
        });
      } catch (err) {
        console.error(`Failed to send email to ${supplier.email}:`, err);
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        rfq
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Publish an RFQ
exports.publishRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    
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
        message: 'You do not have permission to publish this RFQ'
      });
    }
    
    // Check if RFQ is in draft status
    if (rfq.status !== 'draft') {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot publish RFQ in "${rfq.status}" status`
      });
    }
    
    rfq.status = 'published';
    await rfq.save();
    
    // Send notifications to invited suppliers
    if (rfq.invitedSuppliers.length > 0) {
      const suppliers = await User.find({
        _id: { $in: rfq.invitedSuppliers }
      });
      
      for (const supplier of suppliers) {
        try {
          await sendEmail({
            email: supplier.email,
            subject: `New RFQ Published: "${rfq.title}" (${rfq.rfqNumber} v${rfq.version})`,
            message: `
              Dear ${supplier.fullName},
              
              A new Request for Quotation (RFQ) titled "${rfq.title}" (${rfq.rfqNumber} v${rfq.version}) has been published by ${req.user.company}.
              
              Please log in to your account to view the details and submit your proposal.
              
              Thank you,
              ProcureFlow Team
            `
          });
        } catch (err) {
          console.error(`Failed to send email to ${supplier.email}:`, err);
        }
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        rfq
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Close an RFQ
exports.closeRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    
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
        message: 'You do not have permission to close this RFQ'
      });
    }
    
    // Check if RFQ is in published status
    if (rfq.status !== 'published') {
      return res.status(400).json({
        status: 'fail',
        message: `Cannot close RFQ in "${rfq.status}" status`
      });
    }
    
    rfq.status = 'closed';
    await rfq.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        rfq
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Start a bid round
exports.startBidRound = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide start and end dates for the bid round'
      });
    }
    
    const rfq = await RFQ.findById(req.params.id);
    
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
        message: 'You do not have permission to start a bid round for this RFQ'
      });
    }
    
    // Create a new bid round
    const newBidRound = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'active'
    };
    
    // Add to RFQ
    rfq.bidRounds.push(newBidRound);
    await rfq.save();
    
    // Notify suppliers
    if (rfq.invitedSuppliers.length > 0) {
      const suppliers = await User.find({
        _id: { $in: rfq.invitedSuppliers }
      });
      
      for (const supplier of suppliers) {
        try {
          await sendEmail({
            email: supplier.email,
            subject: `New Bidding Round for "${rfq.title}" (${rfq.rfqNumber} v${rfq.version})`,
            message: `
              Dear ${supplier.fullName},
              
              A new bidding round has started for RFQ "${rfq.title}" (${rfq.rfqNumber} v${rfq.version}).
              
              Bidding period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}
              
              Please log in to your account to submit your proposal.
              
              Thank you,
              ProcureFlow Team
            `
          });
        } catch (err) {
          console.error(`Failed to send email to ${supplier.email}:`, err);
        }
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        rfq
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
