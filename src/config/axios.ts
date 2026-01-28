import { API_BASE_URL } from '@/constants';
import { useAuthStore } from '@/store/use-auth-store';
import axios from 'axios';

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

instance.interceptors.request.use(
    async function (config) {
        const accessToken = useAuthStore.getState().accessToken || '';
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },

    function (error) {
        console.log(error);
        return Promise.reject(error);
    },
);

export default instance;
