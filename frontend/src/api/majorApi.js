import axiosClient from './axiosClient';

export const majorApi = {
    getAll: (departmentId) => {
        const url = departmentId ? `/majors?departmentId=${departmentId}` : '/majors';
        return axiosClient.get(url);
    },
    getById: (id) => {
        return axiosClient.get(`/majors/${id}`);
    },
    create: (data) => {
        return axiosClient.post('/majors', data);
    },
    update: (id, data) => {
        return axiosClient.put(`/majors/${id}`, data);
    },
    delete: (id) => {
        return axiosClient.delete(`/majors/${id}`);
    }
};
