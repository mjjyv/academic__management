import axiosClient from './axiosClient';

export const semesterApi = {
    getAllSemesters: () => {
        return axiosClient.get('/semesters');
    },
    getActiveSemester: () => {
        return axiosClient.get('/semesters/active');
    },
    getSectionsBySemester: (semesterId) => {
        return axiosClient.get(`/course-sections/semester/${semesterId}`);
    },
    getSectionById: (id) => {
        return axiosClient.get(`/course-sections/${id}`);
    }
};
