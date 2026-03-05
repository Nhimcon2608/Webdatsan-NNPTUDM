import apiClient from "./api";

const reviewService = {

    getAllReviewsOfBranch: async (branchId) => {
        try {
            const response = await apiClient.get(`/reviews/branch/${branchId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching branch reviews:', error);
            throw error;
        }
    },

    getAllReviewsOfUser: async () => {
        try {
            const response = await apiClient.get(`/reviews/user`);
            return response.data;
        } catch (error) {
            console.error('Error fetching branch reviews:', error);
            throw error;
        }
    },

    postReview: async (review) => {
        try {
            const response = await apiClient.post(`/reviews`, review)
            return response.data;

        } catch (error) {
            console.error('Error fetching branch review:', error);
            throw error;
        }
    },
    
    putReview: async (id, review) => {
        try {
            const response = await apiClient.put(`/reviews/${id}`, review)
            return response.data;

        } catch (error) {
            console.error('Error fetching branch review:', error);
            throw error;
        }
    }
}

export default reviewService;