import apiClient from './api';
import { apiRoutes } from './routes';

const UserService = {
    getAccount: async () => {
        try {
            const response = await apiClient.get(apiRoutes.users.me);
            return response;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    },

    getProfile: async (accountId) => {
        try {
            const response = await apiClient.get(apiRoutes.players.me);
            return response;
        } catch (error) {
            console.error(`Error fetching profile for account ID ${accountId}:`, error);
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await apiClient.put(apiRoutes.players.me, userData);
            return response;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    uploadAvatar: async (formData) => {
        try {
            const response = await apiClient.put(apiRoutes.users.avatar, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            throw error;
        }
    },
};

export default UserService;
