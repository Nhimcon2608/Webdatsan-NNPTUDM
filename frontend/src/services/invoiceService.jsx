import apiClient from "./api";
import {
	normalizePayment,
	normalizePaymentList,
	unwrapApiData,
} from "./normalizers";

const invoiceService = {
	// Tạo hóa đơn mới
	createInvoice: async (reservationId, token) => {
		try {
			const response = await apiClient.post(
				"/payments",
				{ reservationId },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return normalizePayment(unwrapApiData(response));
		} catch (error) {
			console.error("Error creating invoice:", error);
			throw new Error(error.response?.data?.message || "Tạo hóa đơn thất bại.");
		}
	},

	// Lấy danh sách hóa đơn theo chi nhánh
	getInvoicesByBranch: async (branchId, token) => {
		try {
			const response = await apiClient.get(`/payments/branch/${branchId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return normalizePaymentList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching invoices:", error);
			throw new Error(
				error.response?.data?.message || "Không thể lấy danh sách hóa đơn."
			);
		}
	},

	// Cập nhật trạng thái thanh toán (PAID, PENDING,...)
	updatePaymentStatus: async (invoiceId, status, token) => {
		try {
			const response = await apiClient.put(
				`/payments/${invoiceId}/status`,
				{ paymentStatus: status }, // ✅ sửa ở đây
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			return normalizePayment(unwrapApiData(response));
		} catch (error) {
			console.error("Error updating payment status:", error);
			throw new Error(
				error.response?.data?.message || "Cập nhật trạng thái thanh toán thất bại!"
			);
		}
	},

	getInvoiceByReservationId: async (reservationId, token) => {
		try {
			const response = await apiClient.get(`/payments/reservation/${reservationId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return normalizePayment(unwrapApiData(response));
		} catch (error) {
			if (error.response?.status === 404) {
				return null;
			}
			console.error("Error fetching invoice by reservation:", error);
			throw new Error(
				error.response?.data?.message || "Không thể lấy hóa đơn theo lịch đặt."
			);
		}
	},

};

export default invoiceService;
