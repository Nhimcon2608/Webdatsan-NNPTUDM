import apiClient from "./api";

const partnershipRequestService = {

	postPartnershipRequest: async (formData) => {
		try {
			const respone = await apiClient.post('/partnershiprequests', formData);
			return respone;
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getAllPartnershipRequest: async () => {

		try {
			const respone = await apiClient.get('/partnershiprequests');
			return respone.data;
		} catch (error) {
			console.log(error);
			throw error;
		}

	},

	updateStatus: async (requestId, status) => {
		try {
			const respone = await apiClient.patch(`/partnershiprequests/${requestId}/status`, status);
			return respone.data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

}

export default partnershipRequestService;