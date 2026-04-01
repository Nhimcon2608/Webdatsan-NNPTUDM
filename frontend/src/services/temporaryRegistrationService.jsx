import apiClient from "./api";
import { unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

const temporaryRegistrationService = {

    getAllTemporaryRegistrationOfUser: async () => {
        try {
            const response = await apiClient.get(apiRoutes.temporaryRecruitments.registrations);
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    register: async (temporaryRecruitmentId) => {
        try {
            const response = await apiClient.post(apiRoutes.temporaryRecruitments.registrations, { temporaryRecruitmentId });
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },
}

export default temporaryRegistrationService;
