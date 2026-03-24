import apiClient from "./api";
import { unwrapApiData } from "./normalizers";

const paymentService = {

    payWithMomo: async (paymentRequest) => {
        const res = await apiClient.post('/payment-links', paymentRequest);
        const data = unwrapApiData(res);
        window.location.href = data?.payUrl;
    },
    
    getResIdsByOrderId: async (orderId) => {
        try {
			const response = await apiClient.get(`/payments`, {
				params: { orderId },
			});
			return (unwrapApiData(response) || []).map((payment) => payment.reservationId).filter(Boolean);
		} catch (error) {
			console.error(`Error fetching ids: `, error);
			throw error;
		}
    }
}

export default paymentService;
