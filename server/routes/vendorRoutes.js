const express = require('express');
const vendorController = require('../controllers/vendorController');

const router = express.Router();

// Public routes
router.get('/', vendorController.getAllVendors);
router.get('/by-service/:serviceId', vendorController.getVendorsByService);
router.get('/:vendorId', vendorController.getVendorById);

// Admin routes
router.post('/', vendorController.createVendor);

module.exports = router;
