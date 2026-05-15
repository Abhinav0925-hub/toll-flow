const mongoose = require('mongoose');

const FastTagSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true, uppercase: true },
  balance: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  history: [{
    amount: Number,
    type: { type: String, enum: ['Recharge', 'Deduction'] },
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FastTag', FastTagSchema);
