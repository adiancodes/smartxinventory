import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const login = (email, password) => {
  return axios.post(API_URL + '/login', {
    email,
    password,
  }).then(response => {
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Save the full user info from the response
      localStorage.setItem('user', JSON.stringify({ 
        username: response.data.username, 
        role: response.data.role,
        storeId: response.data.storeId // Save the store ID
      }));
    }
    return response.data; // Return the full {token, username, role, storeId} object
  });
};

const register = (registerData) => {
  // Register just sends the data. It does not log the user in.
  return axios.post(API_URL + '/register', registerData)
    .then(response => {
      // We don't save the token here, we make them log in
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getCurrentUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// We can add this for the manager pages
const getCurrentUserStoreId = () => {
  const user = getCurrentUser();
  return user ? user.storeId : null;
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getCurrentUserRole,
  getCurrentUserStoreId,
};

export default authService;
