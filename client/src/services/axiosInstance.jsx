import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * METHYNIX-UMOJA API Instance
 * Handles base configuration and JWT injection
 */
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// --- REQUEST INTERCEPTOR ---
// Runs before every request is sent to the server
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            // Attach JWT token to headers
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- RESPONSE INTERCEPTOR ---
// Runs when a response comes back from the server
axiosInstance.interceptors.response.use(
    (response) => {
        // Return only the data part of the response for cleaner code in hooks
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';
        
        // Handle specific status codes
        if (error.response) {
            switch (error.status) {
                case 401:
                    // Unauthorized: Token might be expired or invalid
                    localStorage.removeItem('token');
                    // We don't redirect here to avoid infinite loops, 
                    // the AuthGuard/AuthProvider will handle the state change.
                    break;
                
                case 403:
                    toast.error("Huna ruhusa ya kufanya kitendo hiki (Forbidden)");
                    break;

                case 429:
                    toast.error("Maombi ni mengi mno, tulia kidogo (Too many requests)");
                    break;

                case 500:
                    toast.error("Hitilafu ya seva. Jaribu tena baadae.");
                    break;

                default:
                    // General error handling
                    break;
            }
        } else if (error.request) {
            // The request was made but no response was received (Network Error)
            toast.error("Imeshindwa kuunganisha kwenye seva. Angalia internet yako.");
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;