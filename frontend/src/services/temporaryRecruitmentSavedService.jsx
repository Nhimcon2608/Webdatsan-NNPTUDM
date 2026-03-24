import apiClient from "./api";
import { unwrapApiData } from "./normalizers";

const temporaryRecruitmentSavedService = {

    getAllTemporaryRecruitmentSavedOfUser: async () => {
        try {
            const response = await apiClient.get('/temporary-recruitments-saved');
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    save: async (temporaryRecruitmentId) => {
        try {
            const response = await apiClient.post('/temporary-recruitments-saved', {temporaryRecruitmentId});
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    unSaved: async (temporaryRecruitmentId) => {
        try {
            const response = await apiClient.delete(`/temporary-recruitments-saved/${temporaryRecruitmentId}`);
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    }

}

export default temporaryRecruitmentSavedService;
