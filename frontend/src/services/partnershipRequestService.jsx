import apiClient from "./api";
import {
	normalizePartnershipRequest,
	normalizePartnershipRequestList,
	unwrapApiData,
} from "./normalizers";

const partnershipRequestService = {

	postPartnershipRequest: async (formData) => {
		try {
			const respone = await apiClient.post('/partnership-requests', formData);
			return normalizePartnershipRequest(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getAllPartnershipRequest: async () => {

		try {
			const respone = await apiClient.get('/partnership-requests');
			return normalizePartnershipRequestList(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}

	},

	updateStatus: async (requestId, status) => {
		try {
			const respone = await apiClient.patch(`/partnership-requests/${requestId}`, status);
			return normalizePartnershipRequest(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

}

export default partnershipRequestService;
