const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const VehicleEntry = require('../models/VehicleEntry');
const FastTag = require('../models/FastTag');
const TollBooth = require('../models/TollBooth');

const TOLL_RATES = {
  Car: 100,
  Bike: 50,
  Bus: 250,
  Truck: 350
};

// GET /api/vehicles -> Get all entries with pagination
router.get('/', auth, async (req, res) => {
  try {
    const entries = await VehicleEntry.find()
      .populate('tollBooth', 'name location')
      .sort({ entryTime: -1 })
      .limit(100); // Limit for demo
    res.json(entries);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/vehicles -> Add new vehicle entry with logic
router.post('/', auth, async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, tollBooth, fastTagEnabled } = req.body;
    
    const baseToll = TOLL_RATES[vehicleType];
    if (!baseToll) return res.status(400).json({ msg: 'Invalid vehicle type' });

    let finalAmount = baseToll;
    let paymentStatus = 'Pending'; // Default needs cash
    let usedFastTag = false;

    if (fastTagEnabled) {
      const tag = await FastTag.findOne({ vehicleNumber: vehicleNumber.toUpperCase(), status: 'Active' });
      if (tag) {
        const discountedToll = baseToll * 0.9; // 10% discount
        if (tag.balance >= discountedToll) {
          // Deduct from FastTag
          tag.balance -= discountedToll;
          tag.history.push({ amount: discountedToll, type: 'Deduction' });
          await tag.save();

          finalAmount = discountedToll;
          paymentStatus = 'Completed';
          usedFastTag = true;
        }
      }
    }

    const entry = new VehicleEntry({
      vehicleNumber: vehicleNumber.toUpperCase(),
      vehicleType,
      tollBooth,
      fastTagEnabled: usedFastTag,
      amount: finalAmount,
      paymentStatus
    });

    await entry.save();
    
    // Populate booth info for response
    await entry.populate('tollBooth', 'name location');
    
    res.json(entry);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT /api/vehicles/:id/pay -> Mark pending payment as completed (Cash Paid)
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const entry = await VehicleEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    
    entry.paymentStatus = 'Completed';
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
