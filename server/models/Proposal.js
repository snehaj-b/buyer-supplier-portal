
const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  rfq: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RFQ',
    required: true
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  deliveryDate: {
    type: Date,
    required: [true, 'Delivery date is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  documents: [{
    name: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;
