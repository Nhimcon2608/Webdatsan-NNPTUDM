import apiClient from "./api";
import { normalizeCourt, normalizeCourtList, unwrapApiData } from "./normalizers";

function filterCourtsByStatus(courts, status) {
    const normalizedStatus = String(status || "all").trim().toLowerCase();

    if (normalizedStatus === "all") {
        return courts;
    }

    if (normalizedStatus === "true" || normalizedStatus === "available" || normalizedStatus === "active") {
        return courts.filter((court) => court.available);
    }

    if (normalizedStatus === "false" || normalizedStatus === "unavailable" || normalizedStatus === "inactive") {
        return courts.filter((court) => !court.available);
    }

    return courts.filter((court) => String(court.status).toLowerCase() === normalizedStatus);
}

const badmintionCourtService = {

    getAllCourtsOfBranchByStatus: async (branchId, status) => {
        try {
            const response = await apiClient.get(`/badminton-courts/branch/${branchId}`);
            const courts = normalizeCourtList(unwrapApiData(response));
            return filterCourtsByStatus(courts, status);
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
            return normalizeCourtList(unwrapApiData(response));
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
            return normalizeCourtList(unwrapApiData(response));
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
            return normalizeCourt(unwrapApiData(response));
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
            return normalizeCourt(unwrapApiData(response));
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
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching upload image:', error);
            throw error;
        }
    },

    deleteImage: async (badmintonCourtId, imageId) => {
        try {
            const response = await apiClient.delete(`/badminton-courts-images/${badmintonCourtId}/images/${imageId}`)
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching delete image:', error);
            throw error;
        }
    },
}

export default badmintionCourtService;
