// Import necessary libraries
const mongoose = require('mongoose');
const LeaveEntitlement = require('../models/LeaveEntitlement'); // Assuming your model file is in a 'models' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data to seed
const defaultEntitlementValues = [
  { name: "Annual Leave 年假", entitlement: 15 },
  { name: "Compassionate Leave 丧假", entitlement: 3 },
  { name: "Medical leave 病假", entitlement: 30 },
  { name: "Hospitalisation leave 住院假", entitlement: 365 },
  { name: "Marriage Leave 婚假", entitlement: 3 },
  { name: "Maternity leave 产假", entitlement: 158 },
  { name: "Miscarriage Leave 流产假", entitlement: 45 },
  { name: "Natal Leave 受精相关假", entitlement: 365 },
  { name: "Paternity Leave 陪产假", entitlement: 20 },
  { name: "Unpaid Leave 无薪假", entitlement: 365 },
  { name: "Childcare Leave 育儿假", entitlement: 10 },
  { name: "Women's Day 三、八妇女节", entitlement: 0.5 },
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
