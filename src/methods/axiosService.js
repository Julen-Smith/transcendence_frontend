import axios from 'axios';
import router from '../router/index.js'

const axiosInstance = axios.create({
  baseURL: 'https://trascendence.tech:4242/api/',
  headers: {
      'Content-Type': 'application/json',
  },
  timeout: 5000,
});



axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (token !== localStorage.getItem('lastUsedToken')) {
      localStorage.removeItem('profilePhotoUrl');
      localStorage.removeItem('profilePhotoTimestamp');
      localStorage.setItem('lastUsedToken', token);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAuthToken();
        const token = localStorage.getItem('authToken');
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.log('Refresh token failed:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

async function refreshAuthToken() {
  console.log("Hola estoy en axiosservice ");
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post('https://trascendence.tech:4242/api/refresh-token', 
      { refresh: refreshToken },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const { access } = response.data;
    localStorage.setItem('authToken', access);
    console.log("Token refreshed successfully");
    return access;
  } catch (error) {
    console.log("Error refreshing token:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export default axiosInstance;