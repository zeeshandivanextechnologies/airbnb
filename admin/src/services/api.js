const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://airbnb-7xie.onrender.com/api');

/**
 * Universal API helper for communicating with Backend
 */
export async function adminApiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('/') 
    ? `${API_BASE_URL}${endpoint}` 
    : `${API_BASE_URL}/${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Attach JWT Bearer token if logged in
  const authData = localStorage.getItem('airbnb_admin_auth');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      if (parsed.token) {
        defaultHeaders['Authorization'] = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      // Ignore json parse error
    }
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`Admin API Error on ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Direct Admin Login (Email & Password - No OTP)
 */
export async function adminLogin(email, password) {
  return adminApiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Check backend connection status
 */
export async function checkBackendConnection() {
  return adminApiRequest('/health');
}
