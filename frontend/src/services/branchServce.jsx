import apiClient from "./api";
import {
	normalizeBranch,
	normalizePriceList,
	unwrapApiData,
} from "./normalizers";
import { apiRoutes } from "./routes";

const branchService = {
    getAllBranches: async (isCooperated) => {
        try {
            const response = await apiClient.get(apiRoutes.branches.root, {
                params: { isCooperated },
            });
            return (unwrapApiData(response) || []).map(normalizeBranch);
        } catch (error) {
            console.error("Error fetching branches:", error);
            throw error;
        }
    },

    getAllPricesOfBranch: async (branchId) => {
        try {
            const response = await apiClient.get(apiRoutes.prices.root, {
                params: { branchId },
            });
            return normalizePriceList(unwrapApiData(response));
        } catch (error) {
            console.error("Error fetching branch prices:", error);
            throw error;
        }
    },

    getBranchById: async (branchId) => {
        try {
            const response = await apiClient.get(apiRoutes.branches.byId(branchId));
            return normalizeBranch(unwrapApiData(response));
        } catch (error) {
            console.error('Error fetching branch:', error);
            throw error;
        }
    },

    getBranchByPartnershipRequest: async (requestId) => {
        try {
            const response = await apiClient.get(apiRoutes.branches.root, {
                params: { partnershipRequestId: requestId },
            });
            return normalizeBranch((unwrapApiData(response) || [])[0] || null);
        } catch (error) {
            console.error('Error fetching branch:', error);
            throw error;
        }
    },

    changeCooperate: async (branchId, cooperated) => {
        try {
            const response = await apiClient.patch(apiRoutes.branches.byId(branchId), cooperated);
            return normalizeBranch(unwrapApiData(response));
        } catch (error) {
            console.error('Error fetching branch:', error);
            throw error;
        }
    },

    createBranch: async (formData) => {
        try {
            const response = await apiClient.post(apiRoutes.branches.root, formData);
            return normalizeBranch(unwrapApiData(response));
        } catch (error) {
            console.error('Error create branch:', error);
            throw error;
        }
    },

    getBranchByAccountId: async (accountId) => {
        try {
            const response = await apiClient.get(apiRoutes.branches.root, {
                params: { managerAccountId: accountId },
            });
            return normalizeBranch((unwrapApiData(response) || [])[0] || null);
        } catch (error) {
            console.error("Error fetching branch by account ID:", error);
            throw error;
        }
    },

    updateBranch: async (branchId, branchData, token) => {
        if (!token) throw new Error("Không tìm thấy token đăng nhập.");
        if (!branchId) throw new Error("Không tìm thấy ID chi nhánh.");
        const isMultipart = typeof FormData !== "undefined" && branchData instanceof FormData;
        if (
            !branchData ||
            (!isMultipart && Object.keys(branchData).length === 0)
        ) {
            throw new Error("Dữ liệu chi nhánh không hợp lệ hoặc rỗng.");
        }

        try {
            const response = await apiClient.patch(
                apiRoutes.branches.byId(branchId),
                branchData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
                    },
                }
            );
            const updatedBranch = normalizeBranch(unwrapApiData(response));
            console.log("Branch updated successfully:", updatedBranch);
            return updatedBranch;
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
