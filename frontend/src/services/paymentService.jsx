import apiClient from "./api";
import { unwrapApiData } from "./normalizers";

const paymentService = {

    payWithMomo: async (paymentRequest) => {
        const res = await apiClient.post('payment/momo/create', paymentRequest);
        const data = unwrapApiData(res);
        window.location.href = data?.payUrl;
    },
    
    getResIdsByOrderId: async (orderId) => {
        try {
			const response = await apiClient.get(`payment/momo/resIds-of/${orderId}`);
			return unwrapApiData(response);
		} catch (error) {
			console.error(`Error fetching ids: `, error);
			throw error;
		}
    }
}

export default paymentService;
