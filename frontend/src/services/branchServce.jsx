import apiClient from "./api";

const branchService = {
    getAllBranches: async (isCooperated) => {
        try {
            const response = await apiClient.get(
                `/branches/is-cooperated/${isCooperated}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching branches:", error);
            throw error;
        }
    },

    getAllPricesOfBranch: async (branchId) => {
        try {
            const response = await apiClient.get(`/prices/branch/${branchId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching branch prices:", error);
            throw error;
        }
    },

    getBranchById: async (branchId) => {
        try {
            const response = await apiClient.get(`/branches/${branchId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching branch:', error);
            throw error;
        }
    },

    getBranchByPartnershipRequest: async (requestId) => {
        try {
            const response = await apiClient.get(`/branches/request/${requestId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching branch:', error);
            throw error;
        }
    },

    changeCooperate: async (branchId, cooperated) => {
        try {
            const response = await apiClient.put(`/branches/${branchId}/status`, cooperated);
            return response.data;
        } catch (error) {
            console.error('Error fetching branch:', error);
            throw error;
        }
    },

    createBranch: async (formData) => {
        try {
            const response = await apiClient.post(`/branches`, formData);
            return response.data;
        } catch (error) {
            console.error('Error create branch:', error);
            throw error;
        }
    },

    getBranchByAccountId: async (accountId) => {
        try {
            const response = await apiClient.get(`/branches/manager/${accountId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching branch by account ID:", error);
            throw error;
        }
    },

    updateBranch: async (branchId, branchData, token) => {
        if (!token) throw new Error("Không tìm thấy token đăng nhập.");
        if (!branchId) throw new Error("Không tìm thấy ID chi nhánh.");
        if (!branchData || Object.keys(branchData).length === 0) {
            throw new Error("Dữ liệu chi nhánh không hợp lệ hoặc rỗng.");
        }

        try {
            const response = await apiClient.put(
                `/branches/${branchId}/update`,
                branchData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log("Branch updated successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating branch:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Cập nhật thông tin chi nhánh thất bại.";
            throw new Error(errorMessage);
        }
    },
};

export default branchService;
