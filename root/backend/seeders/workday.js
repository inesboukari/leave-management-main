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
const workday = {
  currentWorkdaySelection: ["2024-04-10", "2024-04-11", "2024-04-12"],
  currentHolidaySelection: ["2024-04-13", "2024-04-14"],
  entity: "chengdu",
  initialWorkdaySelection: ["2024-04-10", "2024-04-11"],
  initialHolidaySelection: ["2024-04-13"],
  seeder: true
};

// Function to seed data
async function seedData() {
  try {

    await adminController.setWorkDay({ body: workday });


    console.log('Data seeded successfully');
    // mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}
