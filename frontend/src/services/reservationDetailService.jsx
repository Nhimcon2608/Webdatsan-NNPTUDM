import apiClient from "./api";
import {
	normalizeReservationDetail,
	unwrapApiData,
} from "./normalizers";

const reservationDetailService = {
    getAllDetailOfReservation: async (reservationId) => { },

    postReservationDetail: async (formData) => {
        try {
            const reposonse = await apiClient.post("/reservation-details", formData);
            return normalizeReservationDetail(unwrapApiData(reposonse));
        } catch (error) {
            console.error("Error fetching reservations details:", error);
            throw error;
        }
    },
    getTodaySlotsByCourt: async (courtId, token) => {
        try {
            const response = await apiClient.get(`/reservation-details`, {
                params: { courtId, date: "today" },
                headers: { Authorization: `Bearer ${token}` },
            });
            return (unwrapApiData(response) || []).map((detail, index) =>
                normalizeReservationDetail(detail, index)
            );
        } catch (error) {
            console.error("Error fetching today slots:", error);
            throw new Error(
                error.response?.data?.message ||
                "Không thể lấy dữ liệu đặt sân hôm nay."
            );
        }
    },
};

export default reservationDetailService;
