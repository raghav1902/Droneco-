const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('./settings.controller');
const { protect } = require('../../../middleware/authentication/authMiddleware');
const { authorize } = require('../../../middleware/authorization/roleMiddleware');
const { validate } = require('../../../middleware/validationMiddleware');
const { settingsSchema } = require('../../../validators/schemas');

router.get('/', protect, getSettings);
router.put('/', protect, authorize('admin'), validate(settingsSchema), updateSettings);

module.exports = router;
