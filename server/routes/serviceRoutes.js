const express = require('express');
const serviceController = require('../controllers/serviceController');

const router = express.Router();

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:serviceId', serviceController.getServiceById);

// Admin routes
router.post('/', serviceController.createService);

module.exports = router;
