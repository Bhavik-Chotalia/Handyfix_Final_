import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vendorAPI, bookingAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Vendor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  pricePerHour: number;
  serviceId: {
    _id: string;
    name: string;
  };
}

const BookingPage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    startTime: '09:00',
    endTime: '10:00',
    notes: '',
  });

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchVendor = async () => {
      if (!vendorId) return;

      try {
        const data = await vendorAPI.getById(vendorId);
        setVendor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vendor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const calculateTotal = () => {
    if (!vendor || !bookingData.startTime || !bookingData.endTime) return 0;

    const start = new Date(`2000-01-01 ${bookingData.startTime}`);
    const end = new Date(`2000-01-01 ${bookingData.endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    return hours > 0 ? hours * vendor.pricePerHour : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!bookingData.bookingDate) {
        setError('Please select a booking date');
        setIsSubmitting(false);
        return;
      }

      const bookingPayload = {
        vendorId: vendorId,
        serviceId: vendor?.serviceId._id,
        bookingDate: new Date(bookingData.bookingDate),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        notes: bookingData.notes,
      };

      const response = await bookingAPI.create(bookingPayload);
      setSuccess('Booking created successfully! Redirecting...');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading booking form...</div>;
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Vendor not found</p>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Book a Service</h1>
            <p className="text-gray-600 mb-6">Vendor: <span className="font-semibold">{vendor.name}</span></p>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Service</label>
                <input
                  type="text"
                  value={vendor.serviceId.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Booking Date</label>
                <input
                  type="date"
                  name="bookingDate"
                  value={bookingData.bookingDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={bookingData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={bookingData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleChange}
                  placeholder="Any special requests or instructions..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Price per Hour:</span>
                  <span className="font-semibold">${vendor.pricePerHour.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-semibold">Total Price:</span>
                  <span className="text-2xl font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
