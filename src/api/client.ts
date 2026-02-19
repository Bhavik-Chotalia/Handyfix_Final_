const API_BASE_URL = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export const apiCall = async (endpoint: string, options: RequestOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestOptions = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }

  return data;
};

// Auth API
export const authAPI = {
  signup: (userData: { name: string; email: string; phone: string; password: string }) =>
    apiCall('/auth/signup', { method: 'POST', body: userData }),
  login: (credentials: { email: string; password: string }) =>
    apiCall('/auth/login', { method: 'POST', body: credentials }),
  getMe: () => apiCall('/auth/me', { method: 'GET' }),
};

// Service API
export const serviceAPI = {
  getAll: () => apiCall('/services', { method: 'GET' }),
  getById: (serviceId: string) => apiCall(`/services/${serviceId}`, { method: 'GET' }),
};

// Vendor API
export const vendorAPI = {
  getAll: () => apiCall('/vendors', { method: 'GET' }),
  getByService: (serviceId: string) => apiCall(`/vendors/by-service/${serviceId}`, { method: 'GET' }),
  getById: (vendorId: string) => apiCall(`/vendors/${vendorId}`, { method: 'GET' }),
};

// Booking API
export const bookingAPI = {
  create: (bookingData: any) => apiCall('/bookings', { method: 'POST', body: bookingData }),
  getMyBookings: () => apiCall('/bookings/my-bookings', { method: 'GET' }),
  getById: (bookingId: string) => apiCall(`/bookings/${bookingId}`, { method: 'GET' }),
  updateStatus: (bookingId: string, status: string) =>
    apiCall(`/bookings/${bookingId}/status`, { method: 'PATCH', body: { status } }),
  cancel: (bookingId: string) => apiCall(`/bookings/${bookingId}/cancel`, { method: 'DELETE' }),
};
