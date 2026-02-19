import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Booking {
  _id: string;
  vendorId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  serviceId: {
    _id: string;
    name: string;
  };
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  notes: string;
}

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingAPI.getMyBookings();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingAPI.cancel(bookingId);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading bookings...</div>;
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
              Browse Services
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your service bookings</p>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left side */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{booking.vendorId.name}</h3>
                    <p className="text-blue-600 font-medium mb-4">{booking.serviceId.name}</p>

                    <div className="space-y-2 text-gray-600 text-sm">
                      <p>
                        <span className="font-semibold">Date:</span> {formatDate(booking.bookingDate)}
                      </p>
                      <p>
                        <span className="font-semibold">Time:</span> {booking.startTime} - {booking.endTime}
                      </p>
                      <p>
                        <span className="font-semibold">Contact:</span> {booking.vendorId.phone}
                      </p>
                      {booking.notes && (
                        <p>
                          <span className="font-semibold">Notes:</span> {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div>
                        <p className="text-gray-600 text-sm">Total Price</p>
                        <p className="text-2xl font-bold text-green-600">${booking.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/vendor/${booking.vendorId._id}`)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Vendor
                      </button>
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookingsPage;
