const mongoose = require('mongoose');

const TollBoothSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  lanes: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TollBooth', TollBoothSchema);
