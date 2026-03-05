import apiClient from "./api";

const temporaryRegistrationService = {

    getAllTemporaryRegistrationOfUser: async () => {
        try {
            const response = await apiClient.get('/temporary-registrations');
            return response.data;
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    register: async (temporaryRecruitmentId) => {
        try {
            const response = await apiClient.post('/temporary-registrations', { temporaryRecruitmentId });
            return response.data;
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    // unsubscribe: async (temporaryRecruitmentId) => {
    //     try {
    //         const response = await apiClient.delete(`/temporary-registrations/${temporaryRecruitmentId}`);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error fetching all temporary recruitments:', error);
    //         throw error;
    //     }
    // }

}

export default temporaryRegistrationService;