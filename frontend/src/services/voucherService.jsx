import apiClient from "./api";
import {
	normalizeVoucher,
	normalizeVoucherList,
	unwrapApiData,
} from "./normalizers";

const voucherService = {
    getAllVouchersOfBranch: async (branchId) => {
        try {
            const response = await apiClient.get(`/vouchers/branch/${branchId}`);
            return normalizeVoucherList(unwrapApiData(response));
        } catch (error) {
            console.error("Error fetching branch reviews:", error);
            throw error;
        }
    },
    createVoucher: async (voucherData, token) => {
        try {
            const response = await apiClient.post("/vouchers", voucherData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const voucher = normalizeVoucher(unwrapApiData(response));
            console.log("Voucher created:", voucher);
            return voucher;
        } catch (error) {
            console.error("Error creating voucher:", error);
            throw new Error(error.response?.data?.message || "Tạo voucher thất bại.");
        }
    },

    updateVoucher: async (voucherId, voucherData, token) => {
        try {
            const response = await apiClient.put(
                `/vouchers/${voucherId}`,
                voucherData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const voucher = normalizeVoucher(unwrapApiData(response));
            console.log("Voucher updated:", voucher);
            return voucher;
        } catch (error) {
            console.error("Error updating voucher:", error);
            throw new Error(
                error.response?.data?.message || "Cập nhật voucher thất bại."
            );
        }
    },

    toggleVoucherAvailability: async (voucherId, status, token) => {
        try {
            const response = await apiClient.patch(
                `/vouchers/enable?voucherId=${voucherId}&status=${status}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const voucher = normalizeVoucher(unwrapApiData(response));
            console.log("Voucher availability toggled:", voucher);
            return voucher;
        } catch (error) {
            console.error("Error toggling voucher availability:", error);
            throw new Error(
                error.response?.data?.message || "Cập nhật trạng thái voucher thất bại."
            );
        }
    },
};

export default voucherService;
