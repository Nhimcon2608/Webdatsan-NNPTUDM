import apiClient from "./api";
import { normalizeReservation, normalizeReservationList, unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

async function findFixedBookingIdByReservationIds(reservationIds) {
	const firstReservationId = reservationIds?.[0];
	if (!firstReservationId) {
		throw new Error("Thiếu reservationIds để tìm fixed booking.");
	}

	const response = await apiClient.get(apiRoutes.reservations.fixedBookings, {
		params: { reservationId: firstReservationId },
	});
	const fixedBookings = unwrapApiData(response) || [];
	const fixedBooking = fixedBookings.find((item) =>
		reservationIds.every((id) => (item.reservationIds || []).includes(String(id)))
	);

	if (!fixedBooking?.id) {
		throw new Error("Không tìm thấy fixed booking tương ứng.");
	}

	return fixedBooking.id;
}

const reservationService = {
	getAllReservation: async () => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root);
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	getUncanceledReservationOfBranchByDate: async (branchId, date) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: { branchId, date, excludeCancelled: true },
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	getUncanceledReservationOfBranchBetween: async (branchId, from, to) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: { branchId, from, to, excludeCancelled: true },
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	getReservationById: async (reservationId) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.byId(reservationId));
			return normalizeReservation(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	getAllReservationsOfUser: async (status) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: { userScope: "current", status },
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	postReservation: async (formData) => {
		try {
			const response = await apiClient.post(apiRoutes.reservations.root, formData);
			return normalizeReservation(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	cancelReservation: async (reservationId) => {
		try {
			const response = await apiClient.patch(apiRoutes.reservations.byId(reservationId), {
				status: "CANCELLED",
			});
			return normalizeReservation(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	updateReservation: async (reservationId, reservationData) => {
		try {
			const response = await apiClient.patch(
				apiRoutes.reservations.byId(reservationId),
				reservationData
			);
			return normalizeReservation(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	scheduleCancellation: async (reservationId) => {
		try {
			const response = await apiClient.patch(apiRoutes.reservations.byId(reservationId), {
				status: "SCHEDULED_CANCEL",
			});
			return normalizeReservation(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	scheduleCancellationListId: async (reservationIds) => {
		try {
			const response = await apiClient.patch(apiRoutes.reservations.statusUpdates, {
				reservationIds,
				status: "SCHEDULED_CANCEL",
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw error;
		}
	},

	getRecentReservations: async (branchId) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: { branchId, excludeCancelled: true },
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching recent reservations:", error);
			throw error;
		}
	},

	getAllReservationsByBranch: async (branchId) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: { branchId },
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching recent reservations:", error);
			throw error;
		}
	},

	getAllReservationsByBookAtDesc: async (branchId) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: {
					...(branchId ? { branchId } : {}),
					sort: "-createdAt",
				},
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching latest reservations:", error);
			throw error;
		}
	},

	getTodayReservation: async (branchId, date) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: { branchId, date, excludeCancelled: true },
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations of today:", error);
			throw error;
		}
	},
	updateReservationStatus: async (reservationId, status, token) => {
		try {
			const response = await apiClient.patch(
				apiRoutes.reservations.byId(reservationId),
				{ status },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			return normalizeReservation(unwrapApiData(response));
		} catch (error) {
			console.error("Error updating reservation status:", error);
			throw new Error(
				error.response?.data?.message || "Cập nhật trạng thái thất bại."
			);
		}
	},
	getReservationsByBranch: async (branchId, token) => {
		try {
			const response = await apiClient.get(apiRoutes.reservations.root, {
				params: { branchId, excludeCancelled: true },
				headers: { Authorization: `Bearer ${token}` },
			});
			return normalizeReservationList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching reservations:", error);
			throw new Error(
				error.response?.data?.message || "Không thể lấy danh sách đặt sân."
			);
		}
	},

	sendToManager: async (reservationId) => {
		try {
			const response = await apiClient.post(apiRoutes.reservations.notifications(reservationId), {});
			return unwrapApiData(response);
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
	},

	createFixedBooking: async (fixedBookingRequest) => {
		try {
			const response = await apiClient.post(apiRoutes.reservations.fixedBookings, fixedBookingRequest);
			const data = unwrapApiData(response);
			return {
				...data,
				reservations: data?.reservationIds || [],
			};
		} catch (error) {
			console.error("Lỗi khi đặt sân cố định:", error);
			const msg = error.response?.data?.message || error.message || "Đã có lỗi xảy ra";
			throw new Error(msg);
		}
	},

	// ===== THAY ĐỔI TRẠNG THÁI ĐẶT CỐ ĐỊNH (HÀNG LOẠT) =====
	updateFixedBookingStatus: async (reservationIds, status) => {
		try {
			const fixedBookingId = await findFixedBookingIdByReservationIds(reservationIds);
			const response = await apiClient.patch(`${apiRoutes.reservations.fixedBookings}/${fixedBookingId}`, {
				status: status.toLowerCase(),
			});
			return unwrapApiData(response);
		} catch (error) {
			console.error("Lỗi cập nhật trạng thái đặt cố định:", error);
			const msg = error.response?.data?.message || error.response?.data || "Cập nhật trạng thái thất bại";
			throw new Error(msg);
		}
	},


	// ===== ĐẶT CỐ ĐỊNH: XÁC NHẬN THANH TOÁN =====
	confirmFixedBookingPayment: async (reservationIds) => {
		try {
			return await reservationService.updateFixedBookingStatus(reservationIds, "WAITING");
		} catch (error) {
			console.error("Lỗi xác nhận thanh toán cố định:", error);
			throw new Error(error.response?.data?.message || "Xác nhận thanh toán thất bại");
		}
	},

	// ===== ĐẶT CỐ ĐỊNH: HỦY ĐẶT SÂN =====
	cancelFixedBooking: async (reservationIds) => {
		try {
			return await reservationService.updateFixedBookingStatus(
				reservationIds.map(id => String(id)),
				"CANCELLED"
			);
		} catch (error) {
			console.error("Lỗi hủy đặt cố định:", error);
			throw new Error(error.response?.data?.message || "Hủy đặt sân thất bại");
		}
	},
};

export default reservationService;
