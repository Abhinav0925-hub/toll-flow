const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// POST /api/auth/login -> Authenticate admin & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt: email="${email}", pass length=${password?.length}`);
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found!');
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch!');
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    } catch (jwtErr) {
      console.error('JWT Signing Error:', jwtErr);
      res.status(500).json({ msg: 'Token generation failed' });
    }
  } catch (err) {
    console.error('General Login Error:', err);
    res.status(500).json({ msg: 'Server Error: ' + err.message });
  }
});

// GET /api/auth/me -> Get current logged in user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
