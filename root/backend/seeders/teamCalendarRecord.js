// Import necessary libraries
const mongoose = require('mongoose');
const TeamCalendarRecord = require('../models/TeamCalendarRecord'); // Assuming your model file is in a 'models' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data to seed
const sampleTeamCalendarRecords = [
  {
    type: 'Leave',
    start: '2024-04-03',
    end: '2024-04-04',
    startDateUnix: '1648896000', // Unix timestamp for April 3, 2024
    endDateUnix: '1648982400', // Unix timestamp for April 4, 2024
    staffName: 'John Doe',
    title: 'Annual Leave',
    status: 'Approved'
  },
  {
    type: 'Leave',
    start: '2024-04-05',
    end: '2024-04-05',
    startDateUnix: '1649054400', // Unix timestamp for April 5, 2024
    endDateUnix: '1649140800', // Unix timestamp for April 6, 2024
    staffName: 'Alice Smith',
    title: 'Sick Leave',
    status: 'Approved'
  }
  // Add more sample data as needed
];

// Function to seed data
async function seedData() {
  try {
    // Clear existing data
    await TeamCalendarRecord.deleteMany();

    // Insert sample data
    await TeamCalendarRecord.insertMany(sampleTeamCalendarRecords);

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Call the seed function
seedData();
