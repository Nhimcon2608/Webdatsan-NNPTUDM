import apiClient from './api';
import {
    normalizeOwner,
    normalizeOwnerList,
    unwrapApiData,
} from './normalizers';

const ownerService = {

    getOwnerByPhoneNumber: async (phoneNumber) => {
        try {
            const response = await apiClient.get(`owners/phone/${phoneNumber}`);
            return normalizeOwner(unwrapApiData(response));
        } catch (error) {
            console.error('Error fetching owner by phone number:', error);
            throw error;
        }
    },

    getAllOwner: async () => {
        try {
            const response = await apiClient.get('/owners');
            return normalizeOwnerList(unwrapApiData(response));
        } catch (error) {
            console.error('Error fetching owners: ', error);
            throw error;
        }
    }

}

export default ownerService;
