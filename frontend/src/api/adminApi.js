import axiosClient from "./axiosClient";

const adminApi = {
    // User Management
    getAllUsers: (params) => {
        const url = '/admin/users';
        return axiosClient.get(url, { params });
    },
    getUserById: (id) => {
        const url = `/admin/users/${id}`;
        return axiosClient.get(url);
    },
    createUser: (data) => {
        const url = '/admin/users';
        return axiosClient.post(url, data);
    },
    updateUser: (id, data) => {
        const url = `/admin/users/${id}`;
        return axiosClient.put(url, data);
    },
    deleteUser: (id) => {
        const url = `/admin/users/${id}`;
        return axiosClient.delete(url);
    },
    resetPassword: (id, newPassword) => {
        const url = `/admin/users/${id}/reset-password`;
        return axiosClient.patch(url, null, { params: { newPassword } });
    },

    // Role Management
    getAllRoles: () => {
        const url = '/admin/roles';
        return axiosClient.get(url);
    },
    getRoleById: (id) => {
        const url = `/admin/roles/${id}`;
        return axiosClient.get(url);
    },
    createRole: (data) => {
        const url = '/admin/roles';
        return axiosClient.post(url, data);
    },
    updateRole: (id, data) => {
        const url = `/admin/roles/${id}`;
        return axiosClient.put(url, data);
    },
    deleteRole: (id) => {
        const url = `/admin/roles/${id}`;
        return axiosClient.delete(url);
    },

    // Permission Management
    getAllPermissions: () => {
        const url = '/admin/permissions';
        return axiosClient.get(url);
    },
    getGroupedPermissions: () => {
        const url = '/admin/permissions/grouped';
        return axiosClient.get(url);
    }
};

export default adminApi;
