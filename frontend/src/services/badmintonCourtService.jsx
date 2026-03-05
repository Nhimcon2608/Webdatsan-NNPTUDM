import apiClient from "./api";

const badmintionCourtService = {

    getAllCourtsOfBranchByStatus: async (branchId, status) => {
        try {
            const response = await apiClient.get(
                `/badminton-courts/branch/${branchId}/${status}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching branch reviews:", error);
            throw error;
        }
    },

    getByBranchId: async (branchId, token) => {
        try {
            const response = await apiClient.get(
                `/badminton-courts/branch/${branchId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sân:", error);
            throw error;
        }
    },

    getCourtsByManager: async (accountId, token) => {
        try {
            const response = await apiClient.get(
                `/badminton-courts/manager/${accountId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching courts:", error);
            throw new Error(
                error.response?.data?.message || "Không thể lấy danh sách sân."
            );
        }
    },
    
    toggleCourtStatus: async (courtId, token) => {
        try {
            const response = await apiClient.patch(
                `/badminton-courts/${courtId}/toggle`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error toggling court status:", error);
            throw new Error(
                error.response?.data?.message || "Không thể cập nhật trạng thái sân."
            );
        }
    },

    addCourt: async (request) => {
        try {
            const response = await apiClient.post(`/badminton-courts`, request);
            return response.data;
        } catch (error) {
            console.error('Error fetching branch reviews:', error);
            throw error;
        }
    },

    uploadImage: async (formData) => {
        try {
            const response = await apiClient.post(`/badminton-courts-images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data;
        } catch (error) {
            console.error('Error fetching upload image:', error);
            throw error;
        }
    },

    deleteImage: async (badmintonCourtId, imageId) => {
        try {
            const response = await apiClient.delete(`/badminton-courts-images/${badmintonCourtId}/images/${imageId}`)
            return response.data;
        } catch (error) {
            console.error('Error fetching delete image:', error);
            throw error;
        }
    },
}

export default badmintionCourtService;
