// Import necessary libraries
const mongoose = require('mongoose');
const LeaveEntitlement = require('../models/LeaveEntitlement'); // Assuming your model file is in a 'models' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leave', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data to seed
const sampleLeaveEntitlements = [
  {
    leaveEntitlement: [
      { type: 'Annual Leave', entitlement: 20 },
      { type: 'Sick Leave', entitlement: 10 },
      // Add more leave entitlement data as needed
    ],
    entity: 'Company ABC'
  },
  {
    leaveEntitlement: [
      { type: 'Annual Leave', entitlement: 25 },
      { type: 'Sick Leave', entitlement: 12 },
      // Add more leave entitlement data as needed
    ],
    entity: 'Company XYZ'
  }
];

// Function to seed data
async function seedData() {
  try {
    // Clear existing data
    await LeaveEntitlement.deleteMany();

    // Insert sample data
    await LeaveEntitlement.insertMany(sampleLeaveEntitlements);

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Call the seed function
seedData();
