import apiClient from './api';

const UserService = {
    getAccount: async () => {
        try {
            const response = await apiClient.get('/accounts/current');
            return response;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    },

    getProfile: async (accountId) => {
        try {
            const response = await apiClient.get(`/players/current`);
            return response;
        } catch (error) {
            console.error(`Error fetching profile for account ID ${accountId}:`, error);
            throw error;
        }
    },

    updateProfile: async (userData) => {
        try {
            const response = await apiClient.put('/players/current', userData);
            return response;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    uploadAvatar: async (formData) => {
        try {
            const response = await apiClient.put('/accounts/current/avatar', formData, {
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
