const express = require('express');
const router = express.Router();
const { createPayment, getPayments } = require('./payment.controller');
const { protect } = require('../../../middleware/authentication/authMiddleware');
const { authorize } = require('../../../middleware/authorization/roleMiddleware');
const { validate } = require('../../../middleware/validationMiddleware');
const { collectFeeSchema } = require('../../../validators/schemas');

router.post('/', protect, authorize('admin', 'receptionist'), validate(collectFeeSchema), createPayment);
router.get('/', protect, authorize('admin', 'receptionist'), getPayments);

module.exports = router;
