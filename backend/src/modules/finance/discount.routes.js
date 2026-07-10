const express = require('express');
const router = express.Router();
const { getDiscounts, createDiscount, updateDiscount, deleteDiscount } = require('./discount.controller');
const { protect } = require('../../../middleware/authentication/authMiddleware');
const { authorize } = require('../../../middleware/authorization/roleMiddleware');
const { validate } = require('../../../middleware/validationMiddleware');
const { discountSchema } = require('../../../validators/schemas');

// Protect all routes and restrict to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getDiscounts)
  .post(validate(discountSchema), createDiscount);

router.route('/:id')
  .put(validate(discountSchema), updateDiscount)
  .delete(deleteDiscount);

module.exports = router;
