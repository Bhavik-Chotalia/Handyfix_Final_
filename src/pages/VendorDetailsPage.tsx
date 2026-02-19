import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vendorAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  rating: number;
  pricePerHour: number;
  address: string;
  city: string;
  zipCode: string;
  availability: string;
  image?: string;
  serviceId: {
    _id: string;
    name: string;
  };
}

const VendorDetailsPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) return;

      try {
        const data = await vendorAPI.getById(vendorId);
        setVendor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vendor details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleBooking = () => {
    if (vendor) {
      navigate(`/booking/${vendor._id}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading vendor details...</div>;
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Vendor not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700"
          >
            HandyFix
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {vendor.image && (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{vendor.name}</h1>
              <p className="text-xl text-blue-600 font-semibold">{vendor.serviceId.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">About</h3>
                <p className="text-gray-600 mb-6">{vendor.description}</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-4">Details</h3>
                <div className="space-y-3 text-gray-600">
                  <p>
                    <span className="font-semibold">Email:</span> {vendor.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {vendor.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {vendor.address}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span> {vendor.city}, {vendor.zipCode}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="mb-4">
                    <p className="text-gray-600">Rating</p>
                    <p className="text-3xl font-bold text-yellow-500">⭐ {vendor.rating.toFixed(1)}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600">Price per Hour</p>
                    <p className="text-3xl font-bold text-green-600">${vendor.pricePerHour.toFixed(2)}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600">Availability</p>
                    <p className={`text-lg font-semibold ${vendor.availability === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                      {vendor.availability.charAt(0).toUpperCase() + vendor.availability.slice(1)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={vendor.availability !== 'available'}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {vendor.availability === 'available' ? 'Book Now' : 'Currently Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDetailsPage;
