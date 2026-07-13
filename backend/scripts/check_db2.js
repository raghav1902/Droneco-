const mongoose = require('mongoose');
const User = require('../src/models/user.model.js');
const Role = require('../src/models/role.model.js');

async function run() {
  try {
    const MONGO_URI = "mongodb+srv://raghavkakrania5_db_user:C7jXxNBcteUIWuVK@cluster0.pvwprfq.mongodb.net/institutemanagment";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const roles = await Role.find({});
    console.log("ROLES IN DB:", roles);

    const adminEmail = "admin@institute.com";
    const user = await User.findOne({ email: adminEmail }).populate("role");
    
    console.log(`\nUSER ${adminEmail}:`);
    if (user) {
      console.log("- ID:", user._id);
      console.log("- Raw Role ID (from DB):", user.get('role'));
      console.log("- Populated Role Object:", user.role);
    } else {
      console.log("- Not found");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
