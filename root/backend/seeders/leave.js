// Import necessary libraries
const mongoose = require('mongoose');
const Leave = require('../models/Leave'); // Assuming your model file is in a 'models' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data to seed
const sampleLeaves = [
  {
    name: 'Annual Leave',
    type: 'Paid',
    entitlement: 20,
    pending: 5,
    used: 15,
    rollover: true,
    note: 'Some notes about annual leave',
    year: 2024,
    addedByUser: true
  },
  {
    name: 'Sick Leave',
    type: 'Paid',
    entitlement: 10,
    pending: 2,
    used: 8,
    rollover: false,
    note: 'Some notes about sick leave',
    year: 2024,
    addedByUser: true
  }
];

// Function to seed data
async function seedData() {
  try {
    // Clear existing data
    await Leave.deleteMany();

    // Insert sample data
    await Leave.insertMany(sampleLeaves);

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Call the seed function
seedData();
