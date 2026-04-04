import apiClient from "./api";
import { normalizeCourt, normalizeCourtList, unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

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

function toCourtStatusParam(status) {
    const normalizedStatus = String(status || "all").trim().toLowerCase();

    if (normalizedStatus === "all") {
        return null;
    }

    if (normalizedStatus === "true" || normalizedStatus === "available" || normalizedStatus === "active") {
        return "ACTIVE";
    }

    if (normalizedStatus === "false" || normalizedStatus === "unavailable" || normalizedStatus === "inactive") {
        return "INACTIVE";
    }

    return String(status).trim().toUpperCase();
}

const badmintionCourtService = {

    getAllCourtsOfBranchByStatus: async (branchId, status) => {
        try {
            const params = { branchId };
            const statusParam = toCourtStatusParam(status);
            if (statusParam) {
                params.status = statusParam;
            }
            const response = await apiClient.get(apiRoutes.courts.root, { params });
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
                apiRoutes.courts.root,
                {
                    params: { branchId },
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
                apiRoutes.courts.root,
                {
                    params: { managerAccountId: accountId },
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
                apiRoutes.courts.byId(courtId),
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
            const response = await apiClient.post(apiRoutes.courts.root, request);
            return normalizeCourt(unwrapApiData(response));
        } catch (error) {
            console.error('Error fetching branch reviews:', error);
            throw error;
        }
    },

    uploadImage: async (formData) => {
        try {
            const courtId = formData.get("badmintonCourtId") || formData.get("courtId");
            const response = await apiClient.post(apiRoutes.courts.images(courtId), formData, {
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
            const response = await apiClient.delete(apiRoutes.courts.imageById(badmintonCourtId, imageId))
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching delete image:', error);
            throw error;
        }
    },
}

export default badmintionCourtService;
