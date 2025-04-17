
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone, company, userRole } = req.body;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use'
      });
    }
    
    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password,
      phone,
      company,
      userRole
    });
    
    // Generate token
    const token = signToken(newUser._id);
    
    // Remove password from output
    newUser.password = undefined;
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }
    
    // Generate token
    const token = signToken(user._id);
    
    // Remove password from output
    user.password = undefined;
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide your email'
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email'
      });
    }
    
    // TODO: Implement password reset token generation and email sending
    
    res.status(200).json({
      status: 'success',
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};
