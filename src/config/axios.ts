import { API_BASE_URL } from '@/constants';
import axios from 'axios';

const instance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(
    async function (config) {
        const accessToken = '';
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },

    function (error) {
        console.log(error);
        return Promise.reject(error);
    },
);

export default instance;
