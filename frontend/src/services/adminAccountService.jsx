import apiClient from "./api";
import { apiRoutes } from "./routes";
import {
	normalizeAccount,
	unwrapApiData,
} from "./normalizers";

const adminAccountService = {
	getAllAccounts: async () => {
		try {
			const response = await apiClient.get(apiRoutes.users.root);
			return (unwrapApiData(response) || []).map(normalizeAccount);
		} catch (error) {
			console.error("Error fetching accounts:", error);
			throw error;
		}
	},

	resetPassword: async (accountId) => {
		try {
			const response = await apiClient.post(apiRoutes.users.resetPassword(accountId));
			return unwrapApiData(response);
		} catch (error) {
			console.error("Error resetting password:", error);
			throw error;
		}
	},
};

export default adminAccountService;
