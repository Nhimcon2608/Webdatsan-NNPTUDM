import apiClient from "./api";
import {
	normalizePartnershipRequest,
	normalizePartnershipRequestList,
	unwrapApiData,
} from "./normalizers";

const partnershipRequestService = {

	postPartnershipRequest: async (formData) => {
		try {
			const respone = await apiClient.post('/partnershiprequests', formData);
			return normalizePartnershipRequest(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getAllPartnershipRequest: async () => {

		try {
			const respone = await apiClient.get('/partnershiprequests');
			return normalizePartnershipRequestList(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}

	},

	updateStatus: async (requestId, status) => {
		try {
			const respone = await apiClient.patch(`/partnershiprequests/${requestId}/status`, status);
			return normalizePartnershipRequest(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

}

export default partnershipRequestService;
