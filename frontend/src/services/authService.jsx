import apiClient from "./api";

const authService = {
    login: (loginData) => {
        return apiClient.post("/auth/login", loginData);
    },

    changePassword: (formData) => {
        return apiClient.patch("/accounts/change-password", formData);
    },

    register: (registerData) => {
        return apiClient.post("/auth/register", registerData);
    },

    logout: () => {
        return apiClient.post("/auth/logout");
    },

    getCurrentAccount: async () => {
        try {
            const response = await apiClient.get("/accounts/me");
            return response.data;
        } catch (error) {
            console.error("Error fetching current account:", error);
            throw error;
        }
    },

    updatePhoneNumber: async (phoneNumber, token) => {
        try {
            const response = await apiClient.put(
                "/accounts/me/phone",
                { phoneNumber },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Phone number updated:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating phone number:", error);
            throw new Error(
                error.response?.data?.message || "Cập nhật số điện thoại thất bại."
            );
        }
    },

};

export default authService;
