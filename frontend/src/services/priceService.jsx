import apiClient from "./api";
import {
	groupPricesByType,
	normalizePrice,
	normalizePriceList,
	unwrapApiData,
} from "./normalizers";
import { apiRoutes } from "./routes";

const priceService = {
	// Lấy tất cả bảng giá
	getAll: async () => {
		try {
			const response = await apiClient.get(apiRoutes.prices.root);
			return normalizePriceList(unwrapApiData(response));
		} catch (error) {
			console.error("Error fetching all prices:", error);
			throw error;
		}
	},

	// Lấy bảng giá theo ID
	getById: async (id) => {
		try {
			const response = await apiClient.get(apiRoutes.prices.byId(id));
			return normalizePrice(unwrapApiData(response));
		} catch (error) {
			console.error(`Error fetching price by id ${id}:`, error);
			throw error;
		}
	},

	// Lấy bảng giá theo chi nhánh
	getByBranchId: async (branchId) => {
		try {
			const response = await apiClient.get(apiRoutes.prices.root, {
				params: { branchId },
			});
			return normalizePriceList(unwrapApiData(response));
		} catch (error) {
			console.error(`Error fetching prices by branchId ${branchId}:`, error);
			throw error;
		}
	},

	getAllPriceTypesByBranch: async (branchId) => {
		try {
			const response = await apiClient.get(apiRoutes.priceTypes.root, {
				params: { branchId, include: "prices" },
			});
			return groupPricesByType(response);
		} catch (error) {
			console.error(`Error fetching all price types by branchId ${branchId}:`, error);
			throw error;
		}
	},

	getByBranchAndPriceType: async (branchId, priceTypeId) => {
		try {
			const response = await apiClient.get(apiRoutes.prices.root, {
				params: { branchId, priceTypeId },
			});
			return normalizePriceList(unwrapApiData(response));
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
			const response = await apiClient.post(apiRoutes.prices.root, data);
			return normalizePrice(unwrapApiData(response));
		} catch (error) {
			console.error("Error creating price:", error);
			throw error;
		}
	},

	// Cập nhật bảng giá
	update: async (id, data) => {
		try {
			const response = await apiClient.patch(apiRoutes.prices.byId(id), data);
			return normalizePrice(unwrapApiData(response));
		} catch (error) {
			console.error(`Error updating price with id ${id}:`, error);
			throw error;
		}
	},

	// Xóa bảng giá
	delete: async (id) => {
		try {
			const response = await apiClient.delete(apiRoutes.prices.byId(id));
			return normalizePrice(unwrapApiData(response));
		} catch (error) {
			console.error(`Error deleting price with id ${id}:`, error);
			throw error;
		}
	},
};

export default priceService;
