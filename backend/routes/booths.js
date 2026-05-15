const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const TollBooth = require('../models/TollBooth');

// GET /api/booths -> Get all toll booths
router.get('/', auth, async (req, res) => {
  try {
    const booths = await TollBooth.find().sort({ createdAt: -1 });
    res.json(booths);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST /api/booths -> Add a new toll booth
router.post('/', auth, async (req, res) => {
  try {
    const newBooth = new TollBooth(req.body);
    const booth = await newBooth.save();
    res.json(booth);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT /api/booths/:id -> Update a toll booth
router.put('/:id', auth, async (req, res) => {
  try {
    const booth = await TollBooth.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(booth);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE /api/booths/:id -> Delete a toll booth
router.delete('/:id', auth, async (req, res) => {
  try {
    await TollBooth.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Booth removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
