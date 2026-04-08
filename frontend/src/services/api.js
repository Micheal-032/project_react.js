import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD ? 'https://social-media-backend-3ybx.onrender.com/api' : 'http://localhost:5000/api',
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (err) {
                console.error('Error parsing user from localStorage', err);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and redirect to login
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
