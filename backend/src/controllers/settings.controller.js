const Settings = require('../models/settings.model');

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

// @desc    Get public settings (for frontend forms)
// @route   GET /api/settings/public
// @access  Public
const getPublicSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ type: 'global' });
    if (!settings) {
      settings = await Settings.create({ type: 'global' });
    }
    // Only return non-sensitive settings needed for the form
    res.status(200).json({
      success: true,
      data: {
        institute: {
          name: settings.institute.name,
          logo: settings.institute.logo
        },
        formConfig: settings.formConfig
      }
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching settings' });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Admin)
const updateSettings = async (req, res) => {
  try {
    const { institute, fee, receipt, formConfig } = req.body;

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
    if (formConfig) {
      settings.formConfig = formConfig; // Complete replace is fine for this UI approach
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
  getPublicSettings,
  updateSettings
};
