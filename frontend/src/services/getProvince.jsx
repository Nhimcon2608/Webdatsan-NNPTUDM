import axios from 'axios';

const getProvince = async () => {
    try {
        const res = (await axios.get('https://provinces.open-api.vn/api/?depth=3')).data;        
        return res;
    } catch (err) {
        console.error('Lỗi:', err);
    }
};

export default getProvince;