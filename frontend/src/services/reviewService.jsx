import apiClient from "./api";
import { unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

const reviewService = {

    getAllReviewsOfBranch: async (branchId) => {
        try {
            const response = await apiClient.get(apiRoutes.reviews.root, {
                params: { branchId },
            });
            return unwrapApiData(response) || [];
        } catch (error) {
            console.error('Error fetching branch reviews:', error);
            throw error;
        }
    },

    getAllReviewsOfUser: async () => {
        try {
            const response = await apiClient.get(apiRoutes.reviews.root, {
                params: { scope: "current" },
            });
            return unwrapApiData(response) || [];
        } catch (error) {
            console.error('Error fetching branch reviews:', error);
            throw error;
        }
    },

    postReview: async (review) => {
        try {
            const response = await apiClient.post(apiRoutes.reviews.root, review)
            return unwrapApiData(response);

        } catch (error) {
            console.error('Error fetching branch review:', error);
            throw error;
        }
    },
    
    putReview: async (id, review) => {
        try {
            const response = await apiClient.patch(apiRoutes.reviews.byId(id), review)
            return unwrapApiData(response);

        } catch (error) {
            console.error('Error fetching branch review:', error);
            throw error;
        }
    }
}

export default reviewService;
