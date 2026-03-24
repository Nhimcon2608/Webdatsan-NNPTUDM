import apiClient from "./api";
import { normalizeAccount, unwrapApiData } from "./normalizers";

const managerService = {
	uploadAvatar: async (formData) => {
		try {
			const response = await apiClient.put('/accounts/upload-image', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			return normalizeAccount(unwrapApiData(response));
		} catch (error) {
			console.error('Error uploading avatar:', error);
			throw new Error(error.response?.data?.message || 'Failed to upload avatar');
		}
	},
};

export default managerService;
