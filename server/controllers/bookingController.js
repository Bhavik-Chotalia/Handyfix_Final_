const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { vendorId, serviceId, bookingDate, startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!vendorId || !serviceId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get vendor to calculate total price
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Calculate hours and total price
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    const totalPrice = hours * vendor.pricePerHour;

    const booking = new Booking({
      userId,
      vendorId,
      serviceId,
      bookingDate,
      startTime,
      endTime,
      totalPrice,
      notes,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId })
      .populate('vendorId')
      .populate('serviceId');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate('userId')
      .populate('vendorId')
      .populate('serviceId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate('vendorId').populate('serviceId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
