import apiClient from './api';
import {
    normalizeOwner,
    normalizeOwnerList,
    unwrapApiData,
} from './normalizers';
import { apiRoutes } from './routes';

const ownerService = {

    getOwnerByPhoneNumber: async (phoneNumber) => {
        try {
            const response = await apiClient.get(apiRoutes.owners.root, {
                params: { phoneNumber },
            });
            return normalizeOwner(unwrapApiData(response));
        } catch (error) {
            console.error('Error fetching owner by phone number:', error);
            throw error;
        }
    },

    getAllOwner: async () => {
        try {
            const response = await apiClient.get(apiRoutes.owners.root);
            return normalizeOwnerList(unwrapApiData(response));
        } catch (error) {
            console.error('Error fetching owners: ', error);
            throw error;
        }
    }

}

export default ownerService;
