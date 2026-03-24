import apiClient from "./api";
import {
	normalizeAccount,
	unwrapApiData,
} from "./normalizers";

const adminAccountService = {
	getAllAccounts: async () => {
		try {
			const response = await apiClient.get("/accounts");
			return (unwrapApiData(response) || []).map(normalizeAccount);
		} catch (error) {
			console.error("Error fetching accounts:", error);
			throw error;
		}
	},
};

export default adminAccountService;
