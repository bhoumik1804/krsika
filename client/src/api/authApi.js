/**
 * Authentication API service
 */
import apiClient from '@/lib/apiClient';

// Test credentials from environment variables
const TEMP_CREDENTIALS = {
    email: import.meta.env.VITE_AUTH_EMAIL || 'admin@krishak.com',
    password: import.meta.env.VITE_AUTH_PASSWORD || 'admin123'
};

/**
 * Mock login function with temporary credentials
 * Email: admin@krishak.com
 * Password: admin123
 */
export const login = async ({ email, password }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check temporary credentials
    if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
        // Mock successful response
        const mockUser = {
            id: '1',
            email: email,
            name: 'Admin User',
            role: 'admin',
            permissions: ['all']
        };

        const mockToken = 'mock_jwt_token_' + btoa(email);

        // Store token in localStorage
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));

        return {
            success: true,
            message: 'Login successful',
            data: {
                user: mockUser,
                token: mockToken
            }
        };
    }

    // Invalid credentials
    throw new Error('Invalid email or password');
};

/**
 * Logout function
 */
export const logout = async () => {
    // Remove from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        message: 'Logged out successfully'
    };
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (userString && token) {
        try {
            return JSON.parse(userString);
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

export default {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    TEMP_CREDENTIALS // Export for reference
};
