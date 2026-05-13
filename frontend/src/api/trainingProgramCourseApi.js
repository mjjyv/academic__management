import axiosClient from './axiosClient';

export const trainingProgramCourseApi = {
    getCoursesByProgram: (programId) => {
        return axiosClient.get(`/training-program-courses/program/${programId}`);
    },
    addCourseToProgram: (data) => {
        return axiosClient.post('/training-program-courses', data);
    },
    updateProgramCourse: (id, data) => {
        return axiosClient.put(`/training-program-courses/${id}`, data);
    },
    removeCourseFromProgram: (id) => {
        return axiosClient.delete(`/training-program-courses/${id}`);
    }
};
