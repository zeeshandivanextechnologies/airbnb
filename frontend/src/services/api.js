const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Universal API helper for communicating with Express backend
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('/') 
    ? `${API_BASE_URL}${endpoint}` 
    : `${API_BASE_URL}/${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Attach JWT Bearer token if available
  const userAuth = localStorage.getItem('airbnb_user_auth');
  if (userAuth) {
    try {
      const parsed = JSON.parse(userAuth);
      if (parsed.token) {
        defaultHeaders['Authorization'] = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      // Ignore parse error
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
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// User Guest Auth Endpoints
export async function sendOtpApi(identifier) {
  return apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
}

export async function verifyOtpApi(identifier, otp) {
  return apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp }),
  });
}

export async function registerUserApi(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function loginWithPasswordApi(identifier, password) {
  return apiRequest('/auth/login-with-password', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export async function resetPasswordApi(data) {
  return apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// User Profile & Personal Information Endpoints
export async function getUserProfileApi(idOrEmail) {
  let endpoint = '/auth/profile';
  if (idOrEmail) {
    if (typeof idOrEmail === 'number' || /^\d+$/.test(idOrEmail)) {
      endpoint += `?id=${idOrEmail}`;
    } else {
      endpoint += `?email=${encodeURIComponent(idOrEmail)}`;
    }
  }
  return apiRequest(endpoint);
}

export async function updateUserProfileApi(profileData) {
  return apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// Login & Security Endpoints
export async function changePasswordApi(passwordData) {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  });
}

export async function setupPasskeyApi(passkeyData) {
  return apiRequest('/auth/setup-passkey', {
    method: 'POST',
    body: JSON.stringify(passkeyData),
  });
}

export async function removePasskeyApi(data) {
  return apiRequest('/auth/remove-passkey', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deactivateAccountApi(data) {
  return apiRequest('/auth/deactivate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteAccountApi(data) {
  return apiRequest('/auth/delete-account', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function requestPersonalDataApi(data) {
  return apiRequest('/auth/request-data', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getBlockedUsersApi(userId) {
  const query = userId ? `?userId=${userId}` : '';
  return apiRequest(`/auth/blocked-users${query}`);
}

export async function unblockUserApi(data) {
  return apiRequest('/auth/unblock-user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function blockUserApi(data) {
  return apiRequest('/auth/block-user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Quick health check to test backend connectivity
export async function checkBackendHealth() {
  return apiRequest('/health');
}
