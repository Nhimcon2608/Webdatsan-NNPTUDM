import apiClient from './api';
import { unwrapApiData } from "./normalizers";
import { apiRoutes } from "./routes";

const temporaryRecruitmentService = {

    getAll: async () => {
        try {
            const response = await apiClient.get(apiRoutes.temporaryRecruitments.root);
            return unwrapApiData(response);
        } catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },

    getPaginated: async (params) => {
        try {
            const response = await apiClient.get(apiRoutes.temporaryRecruitments.root, {
                params: {
                    available: params?.status,
                },
            });
            let rows = unwrapApiData(response) || [];

            if (params?.searchByName) {
                const keyword = String(params.searchByName).trim().toLowerCase();
                rows = rows.filter((item) =>
                    JSON.stringify(item).toLowerCase().includes(keyword)
                );
            }

            if (params?.quantityMin !== undefined && params?.quantityMin !== "") {
                rows = rows.filter((item) => Number(item.quantity || 0) >= Number(params.quantityMin));
            }

            if (params?.quantityMax !== undefined && params?.quantityMax !== "") {
                rows = rows.filter((item) => Number(item.quantity || 0) <= Number(params.quantityMax));
            }

            if (params?.sortDirection === "ASC") {
                rows = [...rows].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
            } else {
                rows = [...rows].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            }

            const page = Number(params?.page || 0);
            const size = Number(params?.size || rows.length || 1);
            const start = page * size;
            const data = rows.slice(start, start + size);

            return {
                data,
                first: page === 0,
                last: start + size >= rows.length,
                pageNumber: page,
                pageSize: size,
                totalElements: rows.length,
                totalPages: Math.ceil(rows.length / size) || 1,
            };
        }
        catch (error) {
            console.error('Error fetching all temporary recruitments:', error);
            throw error;
        }
    },


    getById: async (id) => {
        try {
            const response = await apiClient.get(apiRoutes.temporaryRecruitments.byId(id));
            return unwrapApiData(response);
        }
        catch (error) {
            console.error('Error fetching temporary recruitment:', error);
            throw error;
        }
    },

    getFullInforById: async (id) => {
        try {
            const response = await apiClient.get(apiRoutes.temporaryRecruitments.byId(id), {
                params: { include: "full" },
            });
            return unwrapApiData(response);
        }
        catch (error) {
            console.error('Error fetching temporary recruitment:', error);
            throw error;
        }
    },

    getByReservation: async (id) => {
        try {
            const response = await apiClient.get(apiRoutes.temporaryRecruitments.root, {
                params: { reservationId: id },
            });
            return unwrapApiData(response);
        }
        catch (error) {
            console.error('Error fetching temporary recruitment:', error);
            throw error;
        }
    },

    create: async (request) => {
        try {
            const response = await apiClient.post(apiRoutes.temporaryRecruitments.root, request);
            return unwrapApiData(response);
        }
        catch (error) {
            console.error('Error creating temporary recruitment:', error);
            throw error;
        }
    },

    changeStatus: async (id, available) => {
        try {
            const response = await apiClient.patch(apiRoutes.temporaryRecruitments.byId(id), { available });
            return unwrapApiData(response);
        }
        catch (error) {
            console.error('Error creating temporary recruitment:', error);
            throw error;
        }
    },

    update: async (id, request) => {
        try {
            const response = await apiClient.patch(apiRoutes.temporaryRecruitments.byId(id), request);
            return unwrapApiData(response);
        }
        catch (error) {
            console.error('Error creating temporary recruitment:', error);
            throw error;
        }
    },

    delete: async () => {

    }
};

export default temporaryRecruitmentService;
