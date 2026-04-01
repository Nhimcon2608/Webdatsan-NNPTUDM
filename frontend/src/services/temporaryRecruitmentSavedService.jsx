import apiClient from "./api";
import { unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

const temporaryRecruitmentSavedService = {

    getAllTemporaryRecruitmentSavedOfUser: async () => {
        try {
            const response = await apiClient.get(apiRoutes.temporaryRecruitments.saved);
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    save: async (temporaryRecruitmentId) => {
        try {
            const response = await apiClient.post(apiRoutes.temporaryRecruitments.saved, {temporaryRecruitmentId});
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    unSaved: async (temporaryRecruitmentId) => {
        try {
            const response = await apiClient.delete(apiRoutes.temporaryRecruitments.savedById(temporaryRecruitmentId));
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    }

}

export default temporaryRecruitmentSavedService;
