import axiosClient from './axiosClient';

export const courseApi = {
    getAllCourses: (departmentId) => {
        return axiosClient.get('/courses', { params: { departmentId } });
    },
    getCourseById: (id) => {
        return axiosClient.get(`/courses/${id}`);
    },
    createCourse: (data) => {
        return axiosClient.post('/courses', data);
    },
    updateCourse: (id, data) => {
        return axiosClient.put(`/courses/${id}`, data);
    },
    deleteCourse: (id) => {
        return axiosClient.delete(`/courses/${id}`);
    }
};
