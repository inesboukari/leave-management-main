// Import necessary libraries
const mongoose = require('mongoose');
const TeamCalendar = require('../models/TeamCalendar'); // Assuming your model file is in a 'models' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data to seed
const sampleTeamCalendars = [
  {
    approvedLeave: [
      {
        leaveType: 'Annual Leave',
        timePeriod: '2024',
        staffName: 'John Doe',
        startDateUnix: '1648896000', // Unix timestamp for April 3, 2024
        endDateUnix: '1648982400', // Unix timestamp for April 4, 2024
        numOfDaysTaken: '2',
        submittedOn: '2024-04-05',
        quotaUsed: 2,
        coveringEmail: 'manager@example.com',
        reportingEmail: 'hr@example.com',
        leaveClassification: 'Paid',
        remarks: 'Vacation trip',
        status: 'Approved',
        year: 2024
      },
      // Add more approved leave data as needed
    ],
    team: 'Engineering Team'
  },
  {
    approvedLeave: [
      {
        leaveType: 'Sick Leave',
        timePeriod: '2024',
        staffName: 'Alice Smith',
        startDateUnix: '1649054400', // Unix timestamp for April 5, 2024
        numOfDaysTaken: '1',
        submittedOn: '2024-04-05',
        quotaUsed: 1,
        coveringEmail: 'manager@example.com',
        reportingEmail: 'hr@example.com',
        leaveClassification: 'Paid',
        remarks: 'Flu',
        status: 'Approved',
        year: 2024
      },
      // Add more approved leave data as needed
    ],
    team: 'Marketing Team'
  }
  // Add more sample data as needed
];

// Function to seed data
async function seedData() {
  try {
    // Clear existing data
    await TeamCalendar.deleteMany();

    // Insert sample data
    await TeamCalendar.insertMany(sampleTeamCalendars);

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Call the seed function
seedData();
