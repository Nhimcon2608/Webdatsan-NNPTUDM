import apiClient from "./api";
import { unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

const paymentService = {

    payWithMomo: async (paymentRequest) => {
        const res = await apiClient.post(apiRoutes.payments.links, paymentRequest);
        const data = unwrapApiData(res);
        window.location.assign(data?.payUrl);
    },

    getPaymentsByOrderId: async (orderId) => {
        try {
			const response = await apiClient.get(apiRoutes.payments.root, {
				params: { orderId },
			});
			return unwrapApiData(response) || [];
		} catch (error) {
			console.error(`Error fetching payments: `, error);
			throw error;
		}
    },
    
    getResIdsByOrderId: async (orderId) => {
        try {
			const payments = await paymentService.getPaymentsByOrderId(orderId);
			return [
				...new Set(
					payments.flatMap((payment) => {
						const reservationIds = Array.isArray(payment?.reservationIds)
							? payment.reservationIds
							: [];

						return [
							...reservationIds,
							...(payment?.reservationId ? [payment.reservationId] : []),
						].filter(Boolean);
					})
				),
			];
		} catch (error) {
			console.error(`Error fetching ids: `, error);
			throw error;
		}
    }
}

export default paymentService;
