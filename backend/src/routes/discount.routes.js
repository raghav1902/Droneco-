const express = require('express');
const router = express.Router();
const { getDiscounts, createDiscount, updateDiscount, deleteDiscount } = require('../controllers/discount.controller');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { discountSchema } = require('../validators/schemas');

// Protect all routes
router.use(protect);

router.route('/')
  .get(authorize('admin', 'receptionist'), getDiscounts)
  .post(authorize('admin'), validate(discountSchema), createDiscount);

router.route('/:id')
  .put(authorize('admin'), validate(discountSchema), updateDiscount)
  .delete(authorize('admin'), deleteDiscount);

module.exports = router;
