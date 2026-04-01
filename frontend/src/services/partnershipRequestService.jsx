import apiClient from "./api";
import {
	normalizePartnershipRequest,
	normalizePartnershipRequestList,
	unwrapApiData,
} from "./normalizers";
import { apiRoutes } from "./routes";

const partnershipRequestService = {

	postPartnershipRequest: async (formData) => {
		try {
			const respone = await apiClient.post(apiRoutes.partnershipRequests.root, formData);
			return normalizePartnershipRequest(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}
	},

	getAllPartnershipRequest: async () => {

		try {
			const respone = await apiClient.get(apiRoutes.partnershipRequests.root);
			return normalizePartnershipRequestList(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}

	},

	updateStatus: async (requestId, status) => {
		try {
			const respone = await apiClient.patch(apiRoutes.partnershipRequests.status(requestId), status);
			return normalizePartnershipRequest(unwrapApiData(respone));
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

}

export default partnershipRequestService;
