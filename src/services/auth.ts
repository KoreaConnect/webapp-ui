import instance, { credentialInstance } from '@/config/axios';

export const authWithGoogle = async () => {
    try {
        const response = await instance.get('/auth/google');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getMe = async () => {
    try {
        const response = await instance.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await instance.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const refreshToken = async () => {
    try {
        const response = await credentialInstance.post('/auth/refresh-token');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
