
const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed', 'awarded'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  rfqNumber: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  invitedSuppliers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  documents: [{
    name: String,
    url: String
  }],
  items: [{
    description: String,
    quantity: Number,
    unitPrice: Number,
    total: Number,
    gst: Number,
    totalWithGst: Number
  }],
  terms: [{
    description: String
  }],
  bidRounds: [{
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['pending', 'active', 'completed'],
      default: 'pending'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RFQ = mongoose.model('RFQ', rfqSchema);

module.exports = RFQ;
