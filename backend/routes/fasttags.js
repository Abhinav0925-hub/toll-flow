const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const FastTag = require('../models/FastTag');

// GET /api/fasttags -> Get all fasttags
router.get('/', auth, async (req, res) => {
  try {
    const tags = await FastTag.find().sort({ createdAt: -1 });
    res.json(tags);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/fasttags -> Register a new FastTag
router.post('/', auth, async (req, res) => {
  try {
    const { vehicleNumber, balance } = req.body;
    let tag = await FastTag.findOne({ vehicleNumber: vehicleNumber.toUpperCase() });
    
    if (tag) {
      return res.status(400).json({ msg: 'FastTag already exists for this vehicle' });
    }

    tag = new FastTag({
      vehicleNumber: vehicleNumber.toUpperCase(),
      balance: balance || 0,
      history: balance > 0 ? [{ amount: balance, type: 'Recharge' }] : []
    });

    await tag.save();
    res.json(tag);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT /api/fasttags/recharge/:id -> Recharge FastTag
router.put('/recharge/:id', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const tag = await FastTag.findById(req.params.id);
    
    if (!tag) return res.status(404).json({ msg: 'FastTag not found' });

    tag.balance += Number(amount);
    tag.history.push({ amount: Number(amount), type: 'Recharge' });
    
    await tag.save();
    res.json(tag);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
