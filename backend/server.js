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

// Seed Route (for cloud deployment)
app.get('/api/seed', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const User = require('./models/User');
    const TollBooth = require('./models/TollBooth');
    const FastTag = require('./models/FastTag');
    const VehicleEntry = require('./models/VehicleEntry');
    await User.deleteMany({});
    await TollBooth.deleteMany({});
    await FastTag.deleteMany({});
    await VehicleEntry.deleteMany({});
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({ name: 'System Admin', email: 'admin@tollflow.com', password: hashedPassword, role: 'admin' });
    const booth1 = await TollBooth.create({ name: 'Plaza Alpha', location: 'Highway 1 North', lanes: 4 });
    const booth2 = await TollBooth.create({ name: 'Plaza Beta', location: 'City Bypass', lanes: 2 });
    await FastTag.create([
      { vehicleNumber: 'MH01AB1234', balance: 500 },
      { vehicleNumber: 'DL04XY9999', balance: 1500 },
      { vehicleNumber: 'KA02CD5678', balance: 200 }
    ]);
    const types = ['Car', 'Bike', 'Bus', 'Truck'];
    const rates = { Car: 100, Bike: 50, Bus: 250, Truck: 350 };
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dailyCount = 5 + Math.floor(Math.random() * 10);
      for (let j = 0; j < dailyCount; j++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const isFastTag = Math.random() > 0.5;
        const base = rates[type];
        await VehicleEntry.create({
          vehicleNumber: 'TEST' + (Math.floor(Math.random()*9000)+1000),
          vehicleType: type, tollBooth: Math.random() > 0.5 ? booth1._id : booth2._id,
          fastTagEnabled: isFastTag, amount: isFastTag ? base * 0.9 : base,
          paymentStatus: 'Completed', entryTime: d
        });
      }
    }
    res.json({ success: true, message: 'Database seeded!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => res.send('TollFlow API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 TollFlow Server running on port ${PORT}`));
