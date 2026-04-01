import apiClient from "./api";
import { normalizeAccount, unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

const authService = {
    login: (loginData) => {
        return apiClient.post(apiRoutes.auth.login, loginData);
    },

    changePassword: (formData) => {
        return apiClient.put(apiRoutes.users.password, formData);
    },

    register: (registerData) => {
        return apiClient.post(apiRoutes.auth.register, registerData);
    },

    logout: () => {
        return apiClient.post(apiRoutes.auth.logout);
    },

    getCurrentAccount: async () => {
        try {
            const response = await apiClient.get(apiRoutes.users.me);
            return normalizeAccount(unwrapApiData(response));
        } catch (error) {
            console.error("Error fetching current account:", error);
            throw error;
        }
    },

    updatePhoneNumber: async (phoneNumber, token) => {
        try {
            const response = await apiClient.patch(
                apiRoutes.users.me,
                { phoneNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const account = normalizeAccount(unwrapApiData(response));
            console.log("Phone number updated:", account);
            return account;
        } catch (error) {
            console.error("Error updating phone number:", error);
            throw new Error(
                error.response?.data?.message || "Cập nhật số điện thoại thất bại."
            );
        }
    },

};

export default authService;
