// Import necessary libraries
const mongoose = require('mongoose');
const LeaveEntitlement = require('/models/LeaveEntitlement'); // Assuming your model file is in a 'models' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data to seed
const defaultEntitlementValues = [
  { name: "Annual Leave ", entitlement: 3 },
  { name: "Compassionate Leave ", entitlement: 3 },
  { name: "Medical leave ", entitlement: 12},
  { name: "Hospitalisation leave ", entitlement: 10},
  { name: "Marriage Leave ", entitlement: 3 },
  { name: "Maternity leave ", entitlement: 1 },
  { name: "Paternity Leave ", entitlement: 1 },
  { name: "Unpaid Leave", entitlement: 3 },
  { name: "Childcare Leave", entitlement: 1 },
  
]

const defaultEntitlementValue = new LeaveEntitlement({
  "entity": "chengdu",
  "leaveEntitlement": defaultEntitlementValues
})

// Function to seed data
async function seedData() {
  try {

    // Insert sample data
    await LeaveEntitlement.insertMany(defaultEntitlementValue);

    console.log('Data seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Call the seed function
seedData();
