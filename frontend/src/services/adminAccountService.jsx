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
};

export default adminAccountService;
