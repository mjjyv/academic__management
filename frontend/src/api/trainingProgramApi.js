import axiosClient from './axiosClient';

export const trainingProgramApi = {
    getAll: (majorId) => {
        const url = majorId ? `/training-programs?majorId=${majorId}` : '/training-programs';
        return axiosClient.get(url);
    },
    getById: (id) => {
        return axiosClient.get(`/training-programs/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/training-programs', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/training-programs/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/training-programs/${id}`);
    },
    duplicate: (id, newCode, newName) => {
        return axiosClient.post(`/training-programs/${id}/duplicate?newCode=${newCode}&newName=${newName}`);
    }
};
