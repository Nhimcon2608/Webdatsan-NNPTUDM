import apiClient from './api';

const temporaryRecruitmentService = {

    getAll: async () => {
        try {
            const response = await apiClient.get('/temporary-recruitments');
            return response.data;
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    getPaginated: async (params) => {
        try {
            const response = await apiClient.get('/temporary-recruitments', { params });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },


    getById: async (id) => {
        try {
            const response = await apiClient.get(`/temporary-recruitments/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching temporary recruitment:', error);
            throw error;
        }
    },

    getFullInforById: async (id) => {
        try {
            const response = await apiClient.get(`/temporary-recruitments/full-infor/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching temporary recruitment:', error);
            throw error;
        }
    },

    getByReservation: async (id) => {
        try {
            const response = await apiClient.get(`/temporary-recruitments/by-reservation/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching temporary recruitment:', error);
            throw error;
        }
    },

    create: async (request) => {
        try {
            const response = await apiClient.post(`/temporary-recruitments`, request);
            return response.data;
        }
        catch (error) {
            console.error('Error creating temporary recruitment:', error);
            throw error;
        }
    },

    changeStatus: async (id, available) => {
        try {
            const response = await apiClient.patch(`/temporary-recruitments/${id}`, { available });
            return response.data;
        }
        catch (error) {
            console.error('Error creating temporary recruitment:', error);
            throw error;
        }
    },

    update: async (id, request) => {
        try {
            const response = await apiClient.put(`/temporary-recruitments/${id}`, request);
            return response.data;
        }
        catch (error) {
            console.error('Error creating temporary recruitment:', error);
            throw error;
        }
    },

    delete: async (id) => {

    }
};

export default temporaryRecruitmentService;