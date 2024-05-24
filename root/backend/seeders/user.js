// Import necessary libraries
const mongoose = require('mongoose');
const adminController = require('../controllers/admin.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    seedData(); 
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Sample data to seed
const sampleLeaves = [
  {
    name: 'john doe',
    isAdmin: 'admin',
    password: 'password',
    email: 'johndoe@example.com',
    createdOn: new Date().toISOString(),
    lastUpdatedOn: new Date().toISOString(),
    reportingEmail: 'reporting@example.com',
    coveringEmail: 'covering@example.com',
    leave: {},
    leaveHistory: {},
    staffLeave: {}
  },
  {
    name: 'User 2',
    isAdmin: 'admin',
    password: 'password',
    email: 'reporting@example.com',
    createdOn: new Date().toISOString(),
    lastUpdatedOn: new Date().toISOString(),
    reportingEmail: 'reporting@example.com',
    coveringEmail: 'covering@example.com',
    leave: {},
    leaveHistory: {},
    staffLeave: {}
  },
  {
    name: 'User 3',
    isAdmin: 'admin',
    password: 'password',
    email: 'covering@example.com',
    createdOn: new Date().toISOString(),
    lastUpdatedOn: new Date().toISOString(),
    reportingEmail: 'reporting@example.com',
    coveringEmail: 'covering@example.com',
    leave: {},
    leaveHistory: {},
    staffLeave: {}
  }


];

// Function to seed data
async function seedData() {
  try {
    // Iterate over sampleLeaves and call postCreateUser for each user
    for (const user of sampleLeaves) {
      await adminController.postCreateUser({ body: user });
    }

    console.log('Data seeded successfully');
    // mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}


