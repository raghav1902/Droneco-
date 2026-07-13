const express = require('express');
const router = express.Router();
const { createFee, getDueFees, getFeesByStudent, getFees } = require('../controllers/fee.controller');
const { protect } = require('../middleware/authentication/authMiddleware');
const { authorize } = require('../middleware/authorization/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { admissionSchema } = require('../validators/schemas');

router.post('/', protect, authorize('admin', 'receptionist'), validate(admissionSchema), createFee);
router.get('/', protect, authorize('admin', 'receptionist'), getFees);
router.get('/dues', protect, authorize('admin', 'receptionist'), getDueFees);
router.get('/student/:leadId', protect, authorize('admin', 'receptionist'), getFeesByStudent);

module.exports = router;
