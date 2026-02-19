import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vendorAPI, serviceAPI } from '../api/client';
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
  availability: string;
  image?: string;
}

interface Service {
  _id: string;
  name: string;
  description: string;
}

const ServicesPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!serviceId) return;

      try {
        // Fetch service details and vendors
        const [serviceData, vendorsData] = await Promise.all([
          serviceAPI.getById(serviceId),
          vendorAPI.getByService(serviceId),
        ]);

        setService(serviceData);
        setVendors(vendorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vendors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleVendorClick = (vendorId: string) => {
    navigate(`/vendor/${vendorId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading vendors...</div>;
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
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Back to Services
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
        {service && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{service.name}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        )}

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        {vendors.length === 0 ? (
          <div className="text-center text-gray-500">No vendors available for this service.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map(vendor => (
              <div
                key={vendor._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {vendor.image && (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{vendor.name}</h3>
                  <p className="text-gray-600 mb-3">{vendor.description}</p>

                  <div className="mb-4 space-y-2 text-sm text-gray-600">
                    <p>📍 {vendor.address}, {vendor.city}</p>
                    <p>⭐ Rating: {vendor.rating.toFixed(1)}</p>
                    <p>💰 ${vendor.pricePerHour.toFixed(2)}/hour</p>
                    <p className={`font-semibold ${vendor.availability === 'available' ? 'text-green-600' : 'text-red-600'}`}>
                      Status: {vendor.availability}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVendorClick(vendor._id)}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ServicesPage;
