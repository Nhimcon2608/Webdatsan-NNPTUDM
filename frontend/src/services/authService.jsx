import apiClient from "./api";
import { normalizeAccount, unwrapApiData } from "./normalizers";

const authService = {
    login: (loginData) => {
        return apiClient.post("/sessions", loginData);
    },

    changePassword: (formData) => {
        return apiClient.patch("/accounts/current/password", formData);
    },

    register: (registerData) => {
        return apiClient.post("/accounts", registerData);
    },

    logout: () => {
        return apiClient.delete("/sessions/current");
    },

    getCurrentAccount: async () => {
        try {
            const response = await apiClient.get("/accounts/current");
            return normalizeAccount(unwrapApiData(response));
        } catch (error) {
            console.error("Error fetching current account:", error);
            throw error;
        }
    },

    updatePhoneNumber: async (phoneNumber, token) => {
        try {
            const response = await apiClient.patch(
                "/accounts/current",
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
