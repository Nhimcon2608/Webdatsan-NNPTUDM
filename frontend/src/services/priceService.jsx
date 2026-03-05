import apiClient from "./api";

const priceService = {
	// Lấy tất cả bảng giá
	getAll: async () => {
		try {
			const response = await apiClient.get("/prices");
			return response.data;
		} catch (error) {
			console.error("Error fetching all prices:", error);
			throw error;
		}
	},

	// Lấy bảng giá theo ID
	getById: async (id) => {
		try {
			const response = await apiClient.get(`/prices/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching price by id ${id}:`, error);
			throw error;
		}
	},

	// Lấy bảng giá theo chi nhánh
	getByBranchId: async (branchId) => {
		try {
			const response = await apiClient.get(`/prices/branch/${branchId}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching prices by branchId ${branchId}:`, error);
			throw error;
		}
	},

	getAllPriceTypesByBranch: async (branchId) => {
		try {
			const response = await apiClient.get(`/prices/branch/${branchId}/all-types`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching all price types by branchId ${branchId}:`, error);
			throw error;
		}
	},

	getByBranchAndPriceType: async (branchId, priceTypeId) => {
		try {
			const token = localStorage.getItem("accessToken");
			const response = await apiClient.get(`/prices/branch/${branchId}/price-type/${priceTypeId}`);
			return response.data;
		} catch (error) {
			console.error(
				`Error fetching prices by branchId ${branchId} and priceTypeId ${priceTypeId}:`,
				error
			);
			throw error;
		}
	},



	// Tạo mới bảng giá
	create: async (data) => {
		try {
			const response = await apiClient.post("/prices", data);
			return response.data;
		} catch (error) {
			console.error("Error creating price:", error);
			throw error;
		}
	},

	// Cập nhật bảng giá
	update: async (id, data) => {
		try {
			const response = await apiClient.put(`/prices/${id}`, data);
			return response.data;
		} catch (error) {
			console.error(`Error updating price with id ${id}:`, error);
			throw error;
		}
	},

	// Xóa bảng giá
	delete: async (id) => {
		try {
			const response = await apiClient.delete(`/prices/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error deleting price with id ${id}:`, error);
			throw error;
		}
	},
};

export default priceService;