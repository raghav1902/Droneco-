const Settings = require('./settings.model');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Private (Admin, Receptionist)
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ type: 'global' });
    if (!settings) {
      settings = await Settings.create({ type: 'global' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    const { institute, fee, receipt } = req.body;

    let settings = await Settings.findOne({ type: 'global' });
    if (!settings) {
      settings = await Settings.create({ type: 'global' });
    }

    if (institute) {
      settings.institute = { ...settings.institute.toObject(), ...institute };
    }
    if (fee) {
      settings.fee = { ...settings.fee.toObject(), ...fee };
    }
    if (receipt) {
      settings.receipt = { ...settings.receipt.toObject(), ...receipt };
    }

    const updatedSettings = await settings.save();

    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Server error updating settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
