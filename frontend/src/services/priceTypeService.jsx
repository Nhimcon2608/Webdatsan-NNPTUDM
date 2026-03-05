// src/services/priceTypeService.js
import apiClient from "./api";

const priceTypeService = {
	// Lấy tất cả PriceType
	getAll: async () => {
		try {
			const response = await apiClient.get("/price-types");
			return response.data;
		} catch (error) {
			console.error("Error fetching price types:", error);
			throw error;
		}
	},

	// Lấy PriceType theo ID
	getById: async (id) => {
		try {
			const response = await apiClient.get(`/price-types/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error fetching price type by id ${id}:`, error);
			throw error;
		}
	},

	// Tạo mới PriceType
	create: async (data) => {
		try {
			const response = await apiClient.post("/price-types", data);
			return response.data;
		} catch (error) {
			console.error("Error creating price type:", error);
			throw error;
		}
	},

	// Xóa PriceType
	delete: async (id) => {
		try {
			const response = await apiClient.delete(`/price-types/${id}`);
			return response.data;
		} catch (error) {
			console.error(`Error deleting price type with id ${id}:`, error);
			throw error;
		}
	},
};

export default priceTypeService;