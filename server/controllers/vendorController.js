const Vendor = require('../models/Vendor');

// Get all vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('serviceId');
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get vendors by service
exports.getVendorsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const vendors = await Vendor.find({ serviceId }).populate('serviceId');
    
    if (vendors.length === 0) {
      return res.status(404).json({ message: 'No vendors found for this service' });
    }

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findById(vendorId).populate('serviceId');
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create vendor (for admin)
exports.createVendor = async (req, res) => {
  try {
    const { name, email, phone, serviceId, description, pricePerHour, address, city, zipCode } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !serviceId || !description || !pricePerHour || !address || !city || !zipCode) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const vendor = new Vendor({
      name,
      email,
      phone,
      serviceId,
      description,
      pricePerHour,
      address,
      city,
      zipCode,
    });

    await vendor.save();
    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
