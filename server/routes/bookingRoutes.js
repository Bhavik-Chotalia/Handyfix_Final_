const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (require authentication)
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings);
router.get('/:bookingId', authMiddleware, bookingController.getBookingById);
router.patch('/:bookingId/status', authMiddleware, bookingController.updateBookingStatus);
router.delete('/:bookingId/cancel', authMiddleware, bookingController.cancelBooking);

module.exports = router;
