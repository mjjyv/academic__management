import axiosClient from './axiosClient';

export const employeeApi = {
    getAll: (params) => {
        return axiosClient.get('/employees', { params });
    },

    getById: (id) => {
        return axiosClient.get(`/employees/${id}`);
    },

    create: (data) => {
        return axiosClient.post('/employees', data);
    },

    update: (id, data) => {
        return axiosClient.put(`/employees/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/employees/${id}`);
    }
};

export const departmentApi = {
    getAllActive: () => axiosClient.get('/departments'),
};

export const positionApi = {
    getAllActive: () => axiosClient.get('/positions'),
};
