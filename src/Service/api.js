import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        // Broader check: If the URL contains the word 'auth' anywhere, do NOT send the token
        if (token && !config.url.includes('auth')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;