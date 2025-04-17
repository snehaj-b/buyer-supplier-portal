
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    // Don't allow updating role or email (sensitive fields)
    const { userRole, email, password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Get all suppliers (for purchasers)
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await User.find({ userRole: 'supplier' })
      .select('fullName company email phone');
    
    res.status(200).json({
      status: 'success',
      results: suppliers.length,
      data: {
        suppliers
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
