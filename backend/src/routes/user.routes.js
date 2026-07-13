const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, resetPassword } = require('../controllers/user.controller');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { editUserSchema } = require('../validators/schemas');

// Apply protection and Admin-only authorization to all user routes
router.use(protect);
router.use(authorize('Admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .put(validate(editUserSchema), updateUser)
  .delete(deleteUser);

router.route('/:id/reset-password')
  .put(resetPassword);

module.exports = router;
