const mongoose = require('mongoose');
require('dotenv').config();
const Lead = require('../src/modules/leads/lead.model');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/institute_lead_db');
    console.log('Connected to DB');

    const leads = await Lead.find({});
    let updated = 0;

    for (const lead of leads) {
      let changed = false;
      let setObj = {};
      
      // Update interested_course_id
      if (typeof lead.interested_course_id === 'string' && mongoose.Types.ObjectId.isValid(lead.interested_course_id)) {
        setObj.interested_course_id = new mongoose.Types.ObjectId(lead.interested_course_id);
        changed = true;
      }
      
      // Update assigned_to_staff_id
      if (typeof lead.assigned_to_staff_id === 'string' && mongoose.Types.ObjectId.isValid(lead.assigned_to_staff_id)) {
        setObj.assigned_to_staff_id = new mongoose.Types.ObjectId(lead.assigned_to_staff_id);
        changed = true;
      }

      if (changed) {
        // Use updateOne to bypass validations or save hooks
        await mongoose.connection.collection('leads').updateOne(
          { _id: lead._id },
          { $set: setObj }
        );
        updated++;
      }
    }

    console.log(`Migrated ${updated} leads successfully`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
