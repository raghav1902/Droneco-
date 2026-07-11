const User = require('./user.model');
const Role = require('./role.model');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate('role', 'name').select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, roleName, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (status) user.status = status;
    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (role) {
        user.role = role._id;
      }
    }

    await user.save();
    
    // Repopulate for response
    const updatedUser = await User.findById(req.params.id).populate('role', 'name').select('-password');
    res.status(200).json({ success: true, data: updatedUser, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error updating user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User removed successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
};

// @desc    Reset user password (Admin)
// @route   PUT /api/users/:id/reset-password
// @access  Private (Admin)
const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Server error resetting password' });
  }
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  resetPassword
};
