import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    async (config) => {
        // Automatically attach Clerk token if available
        if (window.Clerk && window.Clerk.session) {
            try {
                const token = await window.Clerk.session.getToken();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            } catch (err) {
                console.error("Error getting Clerk token:", err);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
