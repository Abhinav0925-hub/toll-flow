const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const VehicleEntry = require('../models/VehicleEntry');
const TollBooth = require('../models/TollBooth');

// GET /api/analytics/dashboard -> Get summary metrics and chart data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Total Vehicles Today
    const vehiclesToday = await VehicleEntry.countDocuments({ entryTime: { $gte: today } });

    // 2. Total Revenue Today (Only Completed payments)
    const revenueDocs = await VehicleEntry.aggregate([
      { $match: { entryTime: { $gte: today }, paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenueToday = revenueDocs.length > 0 ? revenueDocs[0].total : 0;

    // 3. Active Booths
    const activeBooths = await TollBooth.countDocuments({ isActive: true });

    // 4. FastTag Usage Today
    const fastTagCount = await VehicleEntry.countDocuments({ entryTime: { $gte: today }, fastTagEnabled: true });

    // 5. Vehicle Type Distribution (All time or last 7 days)
    const typeDistribution = await VehicleEntry.aggregate([
      { $group: { _id: '$vehicleType', count: { $sum: 1 } } }
    ]);
    const distributionFormat = typeDistribution.map(d => ({ name: d._id, value: d.count }));

    // 6. Last 7 Days Revenue Chart Data
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const weeklyRevenue = await VehicleEntry.aggregate([
      { $match: { entryTime: { $gte: last7Days }, paymentStatus: 'Completed' } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$entryTime" } }, 
          revenue: { $sum: '$amount' },
          vehicles: { $sum: 1 }
        } 
      },
      { $sort: { _id: 1 } }
    ]);

    // Format weekly revenue for Recharts
    const chartData = weeklyRevenue.map(d => ({
      date: d._id.slice(5), // 'MM-DD'
      revenue: d.revenue,
      vehicles: d.vehicles
    }));

    res.json({
      vehiclesToday,
      revenueToday,
      activeBooths,
      fastTagCount,
      typeDistribution: distributionFormat,
      chartData
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
