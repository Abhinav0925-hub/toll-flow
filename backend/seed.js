require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const TollBooth = require('./models/TollBooth');
const FastTag = require('./models/FastTag');
const VehicleEntry = require('./models/VehicleEntry');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for Seeding...');

    // Wipe DB for clean slate
    await User.deleteMany({});
    await TollBooth.deleteMany({});
    await FastTag.deleteMany({});
    await VehicleEntry.deleteMany({});

    // 1. Create Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'System Admin',
      email: 'admin@tollflow.com',
      password: hashedPassword,
      role: 'admin'
    });

    // 2. Create Toll Booths
    const booth1 = await TollBooth.create({ name: 'Plaza Alpha', location: 'Highway 1 North', lanes: 4 });
    const booth2 = await TollBooth.create({ name: 'Plaza Beta', location: 'City Bypass', lanes: 2 });

    // 3. Create FastTags
    await FastTag.create([
      { vehicleNumber: 'MH01AB1234', balance: 500 },
      { vehicleNumber: 'DL04XY9999', balance: 1500 },
      { vehicleNumber: 'KA02CD5678', balance: 200 }
    ]);

    // 4. Create Historical Vehicle Entries (for charts)
    const types = ['Car', 'Bike', 'Bus', 'Truck'];
    const rates = { Car: 100, Bike: 50, Bus: 250, Truck: 350 };
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // Generate 5-15 vehicles per day
      const dailyCount = 5 + Math.floor(Math.random() * 10);
      for(let j=0; j<dailyCount; j++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const isFastTag = Math.random() > 0.5;
        const base = rates[type];
        const amount = isFastTag ? base * 0.9 : base;

        await VehicleEntry.create({
          vehicleNumber: `TEST${Math.floor(Math.random()*9000)+1000}`,
          vehicleType: type,
          tollBooth: Math.random() > 0.5 ? booth1._id : booth2._id,
          fastTagEnabled: isFastTag,
          amount: amount,
          paymentStatus: 'Completed',
          entryTime: d
        });
      }
    }

    console.log('TollFlow Database Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
