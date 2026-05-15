require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas (TollFlow DB)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/booths', require('./routes/booths'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/fasttags', require('./routes/fasttags'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => res.send('TollFlow API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 TollFlow Server running on port ${PORT}`));
