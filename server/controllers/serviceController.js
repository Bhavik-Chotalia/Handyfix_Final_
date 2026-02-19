const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create service (for admin)
exports.createService = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ message: 'Please provide name and description' });
    }

    const service = new Service({
      name,
      description,
      icon,
    });

    await service.save();
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
