// src/api/authApi.js
import axiosClient from './axiosClient';

export const authApi = {
    login: (data) => {
        return axiosClient.post('/auth/login', data);
    },
    getMe: () => {
        return axiosClient.get('/auth/me');
    },
    // Các hàm khác như changePassword có thể thêm vào đây
};