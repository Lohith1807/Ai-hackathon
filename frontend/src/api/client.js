import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // Important for cookies
});

// Interceptor to handle errors globally if needed
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can handle specific global errors here, like redirecting on 401
    return Promise.reject(error);
  }
);

export default client;
