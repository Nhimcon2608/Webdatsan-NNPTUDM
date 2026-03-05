import apiClient from "./api";

const paymentService = {

    payWithMomo: async (paymentRequest) => {
        const res = await apiClient.post('payment/momo/create', paymentRequest);
        // console.log(res);
        window.location.href = res.data.payUrl;
    },
    
    getResIdsByOrderId: async (orderId) => {
        try {
			const response = await apiClient.get(`payment/momo/resIds-of/${orderId}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching ids: `, error);
			throw error;
		}
    }
}

export default paymentService;