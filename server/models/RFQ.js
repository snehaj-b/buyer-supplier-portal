
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RFQ = mongoose.model('RFQ', rfqSchema);

module.exports = RFQ;
