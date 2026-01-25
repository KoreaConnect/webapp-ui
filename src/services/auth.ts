import instance from '@/config/axios';

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
        const response = await instance.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};
