import axios from 'axios';
import { auth } from '@/lib/firebase';
import { EROUTES } from '@/constants/EROUTES';

// Create axios instance with base configuration
const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Firebase auth token
authApi.interceptors.request.use(
    async (config) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Failed to get auth token:', error);
        }

        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
authApi.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    async (error) => {
        const { response } = error;

        if (response?.status === 401) {
            // Token expired or invalid - user needs to re-authenticate
            console.warn('Authentication token expired or invalid');
            // Could trigger logout or token refresh here
            window.location.href = EROUTES.LOGIN;
            return Promise.reject(error);
        }

        console.error(`❌ API Response Error: ${response?.status} ${response?.config?.url}`, error);
        return Promise.reject(error);
    }
);

export default authApi;