const mongoose = require('mongoose');

const VehicleEntrySchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, uppercase: true },
  vehicleType: { 
    type: String, 
    required: true, 
    enum: ['Car', 'Bike', 'Bus', 'Truck'] 
  },
  tollBooth: { type: mongoose.Schema.Types.ObjectId, ref: 'TollBooth', required: true },
  fastTagEnabled: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Completed'],
    default: 'Completed'
  },
  entryTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VehicleEntry', VehicleEntrySchema);
